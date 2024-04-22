
import axios from 'axios';

// ----------------------------------------------------------------------

const getEventsByPage = async (page = 1, pageSize = 8) => {
  try {
    const url = `http://localhost:8080/api/event?pageSize=${pageSize}&page=${page}`;
    const response = await axios.get(url);
    const { eventDtos, total } = response.data; // Destructuring
    console.log(eventDtos);
    return {
      total,
      events: eventDtos,
    };
  } catch (error) {
    // Xử lý lỗi ở đây
    console.error('Có lỗi xảy ra:', error);
    // Trả về một object rỗng trong trường hợp lỗi
    return {
      total: 0,
      events: [],
    };
  }
};
  
export { getEventsByPage };