import { jwtDecode } from 'jwt-decode';

const urlBEAPI = "https://finalprojectbe-development-v1.up.railway.app";

const isAdmin = () => {
    try {
        const decoded = jwtDecode(localStorage.getItem("accessToken"));
        return decoded.authorities && decoded.authorities.includes('ROLE_ADMIN');
    } catch (e) {
        console.error('Invalid token:', e);
        return false;
    }
};

export { isAdmin, urlBEAPI as default  };
