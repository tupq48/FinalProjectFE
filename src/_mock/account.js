import { jwtDecode } from "jwt-decode";

import userService from 'src/sections/user/service/userService';

const getUserInfo = async () => {
  const token = localStorage.getItem('accessToken');
  const account = {};

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const data = await userService.getUserById(decoded.id);
      if (data) {
        Object.assign(account, {
          displayName: data.name,
          photoURL: data.urlImage,
        });
        return account;
      } 
      console.error("No data returned from userService.");
      return [];
      
    } catch (e) {
      console.error("Error while decoding token or fetching user:", e);
      return null;
    }
  } else {
    console.error("No token found in localStorage.");
    return null;
  }

}

export default getUserInfo;