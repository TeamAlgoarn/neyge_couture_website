const ADMIN_TOKEN_KEY = "admin_access_token";

export const adminAuth = {
  setToken(token: string) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  },

  getToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },

  removeToken() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },

  isLoggedIn() {
    return !!localStorage.getItem(ADMIN_TOKEN_KEY);
  },
};