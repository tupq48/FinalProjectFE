
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

import Grid from '@mui/material/Unstable_Grid2';
import { Avatar, Button, TextField } from '@mui/material';

import { schema } from 'src/utils/validation';

import userService from 'src/sections/user/service/userService';



// ----------------------------------------------------------------------

export default function ProfileView() {
  const gridContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
  };

  const gridItemStyle = {
    maxWidth: '800px',
    width: '100%',
  };
  const saveButtonStyle = {
    width: '100px',
  };
  const avatarStyle = {
    width: '50px', // Đặt chiều rộng mong muốn cho Avatar
    height: '50px', // Đặt chiều cao mong muốn cho Avatar
  };
  const [file, setFile] = useState(null);
  const [, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    gmail: '',
    username: '',
    phoneNumber: '',
    gender: '',
    address:'',
    dateOfBirth:'',
    urlImage:''
  });
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setLoading(false);
    }
    finally {
      setLoading(false);
    }

  };
  function findId(token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (e) {
      console.error('Invalid token:', e);
      return false;
    }
  }
  const formatDate = (dateString) => {
    if (!dateString) return ''; // Trả về chuỗi rỗng nếu dateString không tồn tại
  
    // Tách chuỗi ngày tháng từ định dạng "00:00:00 27-09-2023"
    const [, datePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-');
  
    console.log("day: ", day, "month: ", month, "year: ", year);
  
    // Tạo đối tượng Date từ định dạng "YYYY-MM-DD"
    const formattedDateString = `${year}-${month}-${day}`;
    const date = new Date(formattedDateString);
  
    // Kiểm tra nếu date không hợp lệ
  
    const formattedYear = date.getFullYear();
    const formattedMonth = String(date.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(date.getDate()).padStart(2, '0');
  
    console.log("Formatted Date: ", `${formattedYear}-${formattedMonth}-${formattedDay}`);
  
    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
  };
  const token = localStorage.getItem('accessToken');
  const idUser = findId(token);
  useEffect(() => {
    const findUserById = async () => {
      try {
        const data = await userService.getUserById(idUser);
        console.log("dataUs: ", data)
        setFormData({
          id: data.id,
          gender: data.gender,
          name: data.name,
          gmail: data.gmail,
          username: data.username,
          phoneNumber: data.phoneNumber,
          address:data.address,
          dateOfBirth:formatDate(data.birthday),
          urlImage:data.urlImage
        });
      } catch (error) {
        console.error('Error  get UserDetail data: ', error);
      }
      finally {
        setLoading(false);
      }
    };  
    findUserById();
  }, [idUser]);
  if (loading) {
    return <div>Loading...</div>;
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.id]: '',
    }));
  };
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleSave = async () => {
    const formDataUpdate = new FormData();
    if (file) {
      formDataUpdate.append('image', file);
    }
    Object.entries(formData).forEach(([key, value]) => {
      formDataUpdate.append(key, value);
    });
    // const entriesArray = Array.from(formDataUpdate.entries());
    // entriesArray.forEach(pair => {
    //   console.log(`${pair[0]}: ${pair[1]}`);
    // });
    const formDataObj = {};
    formDataUpdate.forEach((value, key) => { formDataObj[key] = value; });
    delete formDataObj.id;
    delete formDataObj.urlImage;
    delete formDataObj.image;
    const validationResult = schema.validate(formDataObj, { abortEarly: false });
    console.log(validationResult)
    if (validationResult.error) {
      const newErrors = {};
      validationResult.error.details.forEach((detail) => {
        newErrors[detail.context.key] = detail.message;
      });
      setErrors(newErrors);
      return;
    }
    try {
      const f = onSubmitUpdateUser(formDataUpdate);
      await f;
    } catch (error) {
      console.error('Đã xảy ra lỗi khi đăng ký sự kiện:', error);
    }
  };

  const onSubmitUpdateUser = async (formDataUpdate) => {
    toast
      .promise(userService.updateUser(formDataUpdate), {
        pending: 'Đang xử lý...',
        success: 'Cập nhật user thành công!',
        error: 'Đã xảy ra lỗi khi cập nhật user!',
      })
      .then(async () => {
        fetchData();
      });
  };
  const handleDateChange = (event) => {
    const { value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      dateOfBirth: value
    }));
  }

  return (
    <Grid container spacing={3} style={gridContainerStyle}>
      <Grid container spacing={3} md={8} style={gridItemStyle}>
        <Grid item xs={12} md={12}>
          <Avatar style={avatarStyle} alt="Avatar" src={formData.urlImage}/>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </Grid>
      </Grid>

      <Grid container spacing={3} md={8} style={gridItemStyle}>
        <Grid item xs={12} sm={6} md={8}>
          <TextField id="name" label="FullName" value={formData.name} onChange={handleChange} error={!!errors.name}
            helperText={errors.name} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          <TextField id="username" label="UserName" value={formData.username} onChange={handleChange} error={!!errors.username}
            helperText={errors.username} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          <TextField id="phoneNumber" type='number' label="Phone Number"
            value={formData.phoneNumber} onChange={handleChange} error={!!errors.phoneNumber}
            helperText={errors.phoneNumber} fullWidth/>
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          <TextField id="address" label="Address" value={formData.address} onChange={handleChange} placeholder="Address" error={!!errors.address}
            helperText={errors.address}fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          <TextField id="dateOfBirth" type="date" label="Date of Birth" value={formData.dateOfBirth} onChange={handleDateChange} error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          <TextField id="gmail" type='email' label="Gmail" value={formData.gmail} onChange={handleChange} error={!!errors.gmail}
            helperText={errors.gmail} fullWidth/>
        </Grid>
      </Grid>
      <Grid container spacing={3} md={8} style={gridItemStyle}>
        <Grid item xs={12} md={8}>
          <Button variant="contained" color="primary" onClick={handleSave} style={saveButtonStyle}>Save</Button>
        </Grid>
      </Grid>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Grid>
    
  );
}
