
import axios from 'axios';

import urlBEAPI from 'src/sections/urlAPI';

const accessToken = localStorage.getItem("accessToken");


const isUserRegisteredEvent = async (eventId) => {
    try {
        // const url = `http://localhost:8080/api/registration/isUserRegistered?eventId=${eventId}`;
        const url = `${urlBEAPI}/api/registration/isUserRegistered?eventId=${eventId}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data; // Trả về kết quả true hoặc false từ server
        
    } catch (error) {
        console.error('Có lỗi xảy ra khi đăng ký tham gia sự kiện:', error);
        throw error;
    }
}

const registrationEvent = async (eventId) => {
    try {
        // const url = `http://localhost:8080/api/registration/registerEvent?eventId=${eventId}`;
        const url = `${urlBEAPI}/api/registration/registerEvent?eventId=${eventId}`;
        const response = await axios.post(url,null, {
            headers: {
                accept: "*/*",
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data; 
    } catch (error) {
        console.error('Có lỗi xảy ra khi đăng ký tham gia sự kiện:', error);
        throw error;
    }
}

const cancelRegistration = async (eventId) => {
    try {
        // const url = `http://localhost:8080/api/registration/cancelRegistration?eventId=${eventId}`;
        const url = `${urlBEAPI}/api/registration/cancelRegistration?eventId=${eventId}`;
        const response = await axios.post(url,null, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data; 
    } catch (error) {
        console.error('Có lỗi xảy ra khi hủy tham gia sự kiện:', error);
        throw error;
    }
}
export { registrationEvent, cancelRegistration, isUserRegisteredEvent };
