import { loginType } from "@/type/loginType";
import { registerType } from "@/type/registerType";
import axios from "axios";
import { getToken } from "./token";
import { permissionType } from "@/type/permissionType";
import { SyslogLogFilterType } from "@/type/syslogLogType";


export const BASEURL = `${"https://monitoringupatikpolindra.com".replace(/\/$/, "")}/`;
// export const BASEURL = `${"http://127.0.0.1:8000".replace(/\/$/, "")}/`;

export const api = axios.create({
  baseURL: BASEURL,
  withCredentials: true,
  timeout: 0,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// AUTH
export const login = (data: loginType) => api.post("api/login/", data);
export const register = (data: registerType) => api.post("api/user/create/", data);
export const getUser = () => api.get("api/user/get/");
export const getMe = () => api.get("api/user/me/");
export const deleteUser = (id: number) => api.delete(`api/user/delete/${id}/`);


// PERMISSION
export const createPermission = (data: permissionType) =>
  api.post("api/permission/create/", data);

export const getPermission = (id: number) =>
  api.get(`api/permission/list/${id}/`);

export const deletePermissionUser = (id: number) =>
  api.delete(`api/permission/delete/${id}/`);


// BACKUP
export const getDatabaseInfo = () => api.get("api/database-info/");

export const backupDatabase = () =>
  api.post(
    "detection/backup/",
    {},
    {
      responseType: "blob",
    }
  );


// TOP REPORTS
export const getDataTopReportsAll = () => api.get("detection/top-reports/");

export const getDataTopReportsDay = (date: string) =>
  api.get(`detection/top-reports/?date=${date}`);

export const getDataTopReportsMonth = (date: string) =>
  api.get(`detection/top-reports/?month=${date}`);

export const getDataTopReportsYear = (date: string) =>
  api.get(`detection/top-reports/?year=${date}`);

export const runAllTopReports = () => api.post(`detection/top-reports/run/`);

export const getGeoIP = (data: string) =>
  api.get(`detection/geo/?ip=${data}`);


// SYSLOG LOGS
export const getSyslogLogs = (params?: SyslogLogFilterType) => {
  return api.get("detection/syslog-logs/", {
    params,
  });
};

export const getSyslogLogDetail = (id: number) => {
  return api.get(`detection/syslog-logs/${id}/`);
};

export const fetchSyslogLogs = () => {
  return api.post("detection/syslog-logs/fetch/", {});
};


// DATASET
export const getSyslogDatasetList = () => {
  return api.get("detection/syslog-dataset/list/");
};

export const createSyslogDataset = (date?: string) => {
  return api.get(
    date
      ? `detection/syslog-dataset/export/?date=${date}`
      : "detection/syslog-dataset/export/"
  );
};

export const downloadSyslogDataset = async (
  filename: string
) => {
  const downloadUrl =
    `/api/download-dataset?filename=${encodeURIComponent(filename)}`

  const response = await fetch(downloadUrl, {
    method: "GET",
    cache: "no-store",
  })

  if (!response.ok) {
    let errorMessage = "Gagal mengunduh dataset."

    try {
      const errorData = await response.json()

      if (errorData?.message) {
        errorMessage = errorData.message
      }
    } catch {
      errorMessage =
        `Gagal mengunduh dataset. Status: ${response.status}`
    }

    throw new Error(errorMessage)
  }

  const blob = await response.blob()

  if (blob.size === 0) {
    throw new Error("File dataset kosong.")
  }

  const blobUrl = window.URL.createObjectURL(blob)

  const link = document.createElement("a")

  link.href = blobUrl
  link.download = filename

  document.body.appendChild(link)
  link.click()
  link.remove()

  setTimeout(() => {
    window.URL.revokeObjectURL(blobUrl)
  }, 1000)

  return true
}