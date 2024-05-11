
import axios from 'axios';

// ----------------------------------------------------------------------

const getEventsByPage = async (page = 1, pageSize = 8) => {
  try {
    const url = `http://localhost:8080/api/event?pageSize=${pageSize}&page=${page}`;
    const response = await axios.get(url);
    const { eventDtos, total } = response.data; 
    console.log(eventDtos);
    return {
      total,
      events: eventDtos,
    };
  } catch (error) {
    console.error('Có lỗi xảy ra:', error);
    return {
      total: 0,
      events: [],
    };
  }
};

const config = {
  headers: {
      'Content-Type': 'multipart/form-data'
  }
};

const registerEvent = async (eventData) => {
  try {
    Array.from(eventData.entries()).forEach(([key, value]) => {
      console.log("event: ",key, value);
    });
    console.log(eventData );
    const url = 'http://localhost:8080/api/event';
    const response = await axios.post(url, eventData, config);
    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    console.error('Có lỗi xảy ra khi đăng ký sự kiện:', error);
    throw error; // Ném lỗi để bên gọi hàm có thể xử lý
  }
};


  
export { registerEvent, getEventsByPage };