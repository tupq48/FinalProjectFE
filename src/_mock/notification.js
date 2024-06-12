import axios from 'axios';

import urlBEAPI from 'src/sections/urlAPI';

// ----------------------------------------------------------------------

// const readNotification = async (id) => {
//     const accessToken = localStorage.getItem("accessToken");
//     try {
//         const url = `${urlBEAPI}/api/notification/readed/${id}`;
//         const response = await axios.get(url, {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`
//             }
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Có lỗi xảy ra khi xác nhận đã đọc notification:', error);
//         throw error;
//     }
// }

const readNotification = async (id) => 
    new Promise((resolve) =>
        setTimeout(() => {
            // Mô phỏng dữ liệu trả về sau khi đọc thông báo
            const mockResponse = {
                success: true,
                message: `Notification ${id} has been marked as read.`,
            };
            resolve(mockResponse);
        }, 2000)
    );


export { readNotification };
