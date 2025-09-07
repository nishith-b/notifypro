export const storage = {
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem("users") || "[]");
    } catch {
      return [];
    }
  },
  saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  },
  getSession() {
    try {
      return JSON.parse(localStorage.getItem("session") || "null");
    } catch {
      return null;
    }
  },
  saveSession(user) {
    localStorage.setItem("session", JSON.stringify(user));
  },
  clearSession() {
    localStorage.removeItem("session");
  },
};
