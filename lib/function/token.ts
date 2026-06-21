export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const setToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
};

export const setUsernameToken = (username: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("username", username);
};

export const getUsernameToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("username");
};

export const setIdUserToken = (id: string | number) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("id_user", String(id));
};

export const getIdUserToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("id_user");
};

export const logoutUser = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("id_user");
  localStorage.removeItem("permission");
};