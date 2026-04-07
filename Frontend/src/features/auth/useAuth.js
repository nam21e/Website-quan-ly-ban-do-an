export const useAuth = () => {
  const token = localStorage.getItem('token');
  if (!token) return { isLoggedIn: false };

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // 👉 Nếu token hết hạn thì coi như chưa đăng nhập
    if (payload.exp < currentTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('fullName');
      localStorage.removeItem('username');
      localStorage.removeItem('roles');
      return { isLoggedIn: false };
    }

    return {
      isLoggedIn: true,
      username: payload["unique_name"] || payload["name"],
      role: payload["role"] || null,
      fullName: payload["fullName"] || "",
      email: payload["email"] || ""
    };
  } catch (e) {
    return { isLoggedIn: false };
  }
};
