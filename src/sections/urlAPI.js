import { jwtDecode } from 'jwt-decode';

// const urlBEAPI = "https://hoatdongcongdong.up.railway.app";
const urlBEAPI="http://localhost:8080"

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
