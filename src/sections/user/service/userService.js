import axios from 'axios';

import urlBEAPI from 'src/sections/urlAPI';

const getAllUsers = async () => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`${urlBEAPI}/api/user/getAll`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
};
const getListOfEventRegistrants = async (id) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`${urlBEAPI}/api/user/getEventRegistrants?eventId=${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
};
const getListOfEventAttended = async (id) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`${urlBEAPI}/api/event/listEventAttended?user_id=${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
};

const updateUser = async (formDataUpdate) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    await axios.post(`${urlBEAPI}/api/user`, formDataUpdate, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    });
  } catch (error) {
    console.error('Failed to register user:', error);
    throw error;
  }
};
const getUserById = async (id) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await axios.get(`${urlBEAPI}/api/user/getUserById/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getUser data: ', error);
    throw error;
  }
};
const deleteUser = async (id) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await axios.delete(`${urlBEAPI}/api/user/${id}/deleteBusiness/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
};
const removeRegistrantFromEvent = async (userId, eventId) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.delete(`${urlBEAPI}/api/registration/removeRegistrantFromEvent?userId=${userId}&eventId=${eventId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
};

const addUser = async (formData) => {
  try {
    const response = await axios.post(`${urlBEAPI}/api/auth/register`, formData);
    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
};
const login = async (formData) => {

  try {
    const response = await axios.post(`${urlBEAPI}/api/auth/authenticate`, formData);
    return response.data;
  } catch (error) {
    console.error('Error login data: ', error);
    throw error;
  }
};

export default {
  getAllUsers, getListOfEventRegistrants, getListOfEventAttended, removeRegistrantFromEvent, updateUser, getUserById, deleteUser, addUser, login
};