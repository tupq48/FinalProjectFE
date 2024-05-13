import axios from 'axios';

import urlBEAPI from 'src/sections/urlAPI';

const accessToken = localStorage.getItem("accessToken");
const getAllUsers = async () => {
  try {
    const response = await axios.get(`${urlBEAPI}/api/user/getAll`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    );

    console.log("data: ", response);
    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
};

const updateUser = async (formDataUpdate) => {
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
  try {
    const response = await axios.get(`${urlBEAPI}/api/user/getUserById/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log("User Detail: ", response);
    return response.data;
  } catch (error) {
    console.error('Error getUser data: ', error);
    throw error;
  }
};
const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${urlBEAPI}/api/user/${id}/deleteBusiness/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log("data: ", response);
    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
};
const addUser = async (formData) => {
  try {
    const response = await axios.post(`${urlBEAPI}/api/auth/register`, formData);
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
  getAllUsers, updateUser, getUserById, deleteUser, addUser, login
};