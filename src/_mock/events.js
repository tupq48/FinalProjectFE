
import axios from 'axios';

import urlBEAPI from 'src/sections/urlAPI';

// ----------------------------------------------------------------------




const getEventsByPage = async (page = 1, pageSize = 8) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const url = `${urlBEAPI}/api/event?pageSize=${pageSize}&page=${page}`;
    // const url = `http://localhost:8080/api/event?pageSize=${pageSize}&page=${page}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const { eventDtos, total } = response.data;
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
const getEventsByStatus = async (page = 1, pageSize = 8, filterBy = 0) => {
  console.log("filterBy: ", filterBy);
  const accessToken = localStorage.getItem("accessToken");
  try {
    const url = `${urlBEAPI}/api/event/getEventByStatus?pageSize=${pageSize}&page=${page}&filter_by=${filterBy}`;
    // const url = `http://localhost:8080/api/event?pageSize=${pageSize}&page=${page}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const { eventDtos, total } = response.data;
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

const registerEvent = async (eventData) => {
  const accessToken = localStorage.getItem("accessToken");
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`
    }
  };
  try {
    const url = `${urlBEAPI}/api/event`;
    // const url = 'http://localhost:8080/api/event';
    const response = await axios.post(url, eventData, config);
    return response.data; // Trả về dữ liệu từ phản hồi của API
  } catch (error) {
    console.error('Có lỗi xảy ra khi đăng ký sự kiện:', error);
    throw error; // Ném lỗi để bên gọi hàm có thể xử lý
  }
};

const updateEvent = async (eventData) => {
  const accessToken = localStorage.getItem("accessToken");
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`
    }
  };
  try {
    const url = `${urlBEAPI}/api/event`;
    // const url = 'http://localhost:8080/api/event';
    const response = await axios.put(url, eventData, config);
    return response.data;
  } catch (error) {
    console.error('Có lỗi xảy ra khi đăng ký sự kiện:', error);
    throw error;
  }
};

const deleteEvent = async (eventId) => {
  const accessToken = localStorage.getItem("accessToken");
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`
    }
  }; try {
    const url = `${urlBEAPI}/api/event`;
    // const url = 'http://localhost:8080/api/event';
    const params = { eventId }; // Truyền eventId vào phần queryParams
    const response = await axios.delete(url, { params, ...config });
    return response.data;
  } catch (error) {
    console.error('Có lỗi xảy ra khi xóa sự kiện:', error);
    throw error;
  }
}

const getEventInfoById = async (id) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const url = `${urlBEAPI}/api/event/${id}`;
    // const url = `http://localhost:8080/api/event/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Có lỗi xảy ra khi đăng ký tham gia sự kiện:', error);
    throw error;
  }
}
const getImagesUser = async (userId, eventId) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const url = `${urlBEAPI}/api/event/getImagesUser?userId=${userId}&eventId=${eventId}`;
    // const url = `http://localhost:8080/api/event/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data; 
  } catch (error) {
    console.error('Có lỗi xảy ra khi đăng ký tham gia sự kiện:', error);
    throw error; 
  }
}
const updateStatusRegistrants = async (eventId, userId, updateBy) => {
  console.log("updateBy: " ,updateBy)
  const accessToken = localStorage.getItem("accessToken");
  try {
    const url = `${urlBEAPI}/api/registration/updateStatusRegistrants?eventId=${eventId}&userId=${userId}&update-by=${updateBy}`;
    // const url = 'http://localhost:8080/api/event';
    const response = await axios.put(url,'', {headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
    return response.data; 
  } catch (error) {
    console.error('Có lỗi xảy ra khi xác nhận:', error);
    throw error; 
  }
};

  
export {deleteEvent, updateEvent, registerEvent, getImagesUser, getEventsByPage, getEventInfoById, getEventsByStatus, updateStatusRegistrants  };
