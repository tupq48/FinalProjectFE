import axios from 'axios';

import urlBEAPI from 'src/sections/urlAPI';

const getAllUsers = async () => {
  try {
    // Lấy token từ localStorage
    const accessToken = localStorage.getItem("accessToken");

    const response = await axios.get(`${urlBEAPI}/api/user/getAll`, {
      headers: {
        Authorization: `Bearer ${accessToken}` // Thêm token vào header
      }
    });

    console.log("data: ", response);
    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
};

const updateUser = async (formDataUpdate) => {
  try {
    await axios.post('http://localhost:8080/api/user', formDataUpdate, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Failed to register user:', error);
    throw error;
  }
};
const getUserById = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/user/getUserById/${id}`);
    console.log("User Detail: ", response);
    return response.data;
  } catch (error) {
    console.error('Error getUser data: ', error);
    throw error;
  }
};
const deleleUser = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:8080/api/user/${id}/deleteBusiness/`);
    console.log("data: ", response);
    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
};
const addUser = async (formData) => {
  try {
    const response = await axios.post('http://localhost:8080/api/auth/register', formData);
    console.log("data: ", response);
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
  getAllUsers, updateUser, getUserById, deleleUser, addUser, login
};