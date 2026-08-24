export const tokenStorage = {
  get() {
    return localStorage.getItem("access_token");
  },

  set(token: string) {
    localStorage.setItem("access_token", token);
  },

  remove() {
    localStorage.removeItem("access_token");
  },

  has() {
    return !!localStorage.getItem("access_token");
  },
};