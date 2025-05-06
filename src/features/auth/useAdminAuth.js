export const useAdminAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return { isAdmin: false };

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (!payload.exp || payload.exp < currentTime) {
            localStorage.removeItem('admin_token');
            return { isAdmin: false };
        }

        let roles = payload.role;
        if (!Array.isArray(roles)) roles = [roles];

        const isAdmin = roles.some(role => role?.toLowerCase() === 'admin');

        return {
            isAdmin,
            roles
        };
    } catch (e) {
        return { isAdmin: false };
    }
};
