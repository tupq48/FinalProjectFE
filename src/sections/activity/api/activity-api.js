import axios from 'axios';

import urlBEAPI from 'src/sections/urlAPI';

// ----------------------------------------------------------------------

const uploadProofImage = async (image, eventId) => {
    try {
        const formData = new FormData();
        formData.append('image', image);
        formData.append("eventId", eventId);
        const url = `${urlBEAPI}/api/ai-model/predict`;
        const response = await axios.post(url, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                'Content-Type': 'multipart/form-data',
            }
        });
        if (response.status === 200) {
            return response.data; 
          }
          return false;
    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
        return false;
    }
};

export { uploadProofImage };


