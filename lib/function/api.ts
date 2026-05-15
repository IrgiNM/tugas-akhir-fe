import axios from "axios";
import { getToken } from "./token";
import { loginType } from "@/type/loginType";
import { registerType } from "@/type/registerType";
import { userGetType } from "@/type/userGetType";

export const BASEURL = process.env.NEXT_PUBLIC_API_URL + "/";

export const api = axios.create({
  baseURL: BASEURL,
  withCredentials: true,
  timeout: 60000,
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

export const getListNetworkTraffic = () => api.get("api/networkTraffic/list/");
export const uploadFileCSV = (data: FormData) => api.post("api/uploadCSV/", data);

export const getLogWatchguard = () => api.get("detection/fetch-logs/");
export const getLogCSV = (data: FormData) => api.post("detection/getLogCSV/", data);
export const getLogDataset = (date?: string) =>
  api.get("detection/getRawLogCSV/", {
      params: {
          date: date
      }
  });

export const runDetection = (created_at: string) =>
  api.post("detection/run/", {
      created_at: created_at
  });

export const getDataTopReportsAll = () => api.get(`detection/top-reports/`);
export const getDataTopReportsDay = (date: string) => api.get(`detection/top-reports/?date=${date}`);
export const getDataTopReportsMonth = (date: string) => api.get(`detection/top-reports/?month=${date}`);
export const getDataTopReportsYear = (date: string) => api.get(`detection/top-reports/?year=${date}`);
