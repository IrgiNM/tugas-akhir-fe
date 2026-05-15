export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const setToken = async (token: string) => {
  localStorage.setItem("token", token);
};

export async function logoutUser() {
    try {
      await localStorage.removeItem('token');
    } catch (error) {
    }
  }