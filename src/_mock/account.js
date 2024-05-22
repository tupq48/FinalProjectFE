import { jwtDecode } from "jwt-decode";

import userService from 'src/sections/user/service/userService';

const token = localStorage.getItem('accessToken');
const account = {};

if (token) {
  try {
    console.log("token: ",token)
    const decoded = jwtDecode(token);
    const data = await userService.getUserById(decoded.id);

    if (data) {
      Object.assign(account, {
        displayName: data.name,
        photoURL: data.urlImage,
      });
    } else {
      console.error("No data returned from userService.");
    }
  } catch (e) {
    console.error("Error while decoding token or fetching user:", e);
  }
} else {
  console.error("No token found in localStorage.");
}

export default account;
