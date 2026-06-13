export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const setToken = async (token: string) => {
  localStorage.setItem("token", token);
};
export const setUsernameToken = async (token: string) => {
  localStorage.setItem("username", token);
  // alert('berhasil menyimpan username token');
};
export const setIdUserToken = async (token: string) => {
  localStorage.setItem("id_user", token);
  // alert('berhasil menyimpan id user token');
};

export async function logoutUser() {
    try {
      await localStorage.removeItem('token');
    } catch (error) {
      
    }
  }