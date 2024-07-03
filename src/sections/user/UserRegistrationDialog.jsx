// import Joi from 'joi';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { React, useState } from 'react';
import { EyeOutlined, EyeInvisibleOutlined, } from '@ant-design/icons';

// import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; import {
  Stack,
  Button,
  Dialog,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  DialogTitle,
  DialogContent,
  DialogActions,

} from '@mui/material';

import { schema } from 'src/utils/validation';

export default function UserRegistrationDialog({ open, closePopup, onSubmitUser, setVisible, visible }) {
  const [formData, setFormData] = useState({
    name: '',
    gmail: '',
    username: '',
    password: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: dayjs(),
    gender: '',
  });
  const [errors, setErrors] = useState({});
  const handleChangeTime = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleChange = (e) => {
      const { name, value } = e.target;
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
  };
  function formatDateTime(date) {
    console.log(date);
    date = new Date(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
  const handleSubmit = async () => {
    const form = new FormData();
Object.entries(formData).forEach(([key, value]) => {
  if (key === 'dateOfBirth') {
    value = formatDateTime(value);
  }
  form.append(key, value);
});
const formDataObj = {};
form.forEach((value, key) => { formDataObj[key] = value; });
    const validationResult = schema.validate(formDataObj, { abortEarly: false });
    if (validationResult.error) {
      const newErrors = {};
      validationResult.error.details.forEach((detail) => {
        newErrors[detail.context.key] = detail.message;
      });
      setErrors(newErrors);
      return;
    }
    try {
      const f = onSubmitUser(formDataObj);
      closePopup()
      await f;
    } catch (error) {
      console.error('Đã xảy ra lỗi khi đăng ký user:', error);
    }
  };
  return (
    <Dialog open={open} fullWidth onClose={closePopup}>
      <DialogTitle>User Register </DialogTitle>
      <DialogContent>
        <Stack spacing={2} margin={2} >
          <TextField name="name" label="FullName" value={formData.name} placeholder="name" onChange={handleChange} error={!!errors.name}
            helperText={errors.name}  />
          <TextField name="gmail" type='email' label="Gmail" value={formData.gmail} placeholder="gmail" onChange={handleChange} error={!!errors.gmail}
            helperText={errors.gmail}/>
          <TextField name="username" label="UserName" value={formData.username} placeholder="username" onChange={handleChange} error={!!errors.username}
            helperText={errors.username}/>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <TextField
              name="password"
              type={visible ? "text" : "password"}
              label="Password"
              value={formData.password}
              placeholder="password"
              onChange={handleChange}
              style={{ flex: 1 }}
              error={!!errors.password}
              helperText={errors.password}
            />
            <Button onClick={() => setVisible(!visible)} style={{ right: '0', position: 'absolute' }}>
              {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </Button>
          </div>
          <TextField name="phoneNumber" type='number' label="Phone Number"
            value={formData.phoneNumber} placeholder="phoneNumber" onChange={handleChange} error={!!errors.phoneNumber}
            helperText={errors.phoneNumber} />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of birth"
                value={formData.dateOfBirth}
                onChange={(value) => handleChangeTime('dateOfBirth', value)}
                sx={{ width: '100%' }}
                maxDate={dayjs()}

              />
            </LocalizationProvider>
          <TextField name="address" label="Address" value={formData.address} placeholder="Address" onChange={handleChange} error={!!errors.address}
            helperText={errors.address}/>
          <FormControl fullWidth>
            <InputLabel
              id="gender-label"
              sx={{ position: 'absolute', zIndex: 1, bgcolor: 'background.paper', px: 1 }}
            >
              Gender
            </InputLabel>
            <Select
              labelId="gender-label"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              error={!!errors.gender}
            >
              <MenuItem value="MALE">MALE</MenuItem>
              <MenuItem value="FEMALE">FEMALE</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>Submit</Button>
        <Button onClick={closePopup}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
UserRegistrationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  closePopup: PropTypes.func,
  onSubmitUser: PropTypes.func,
  setVisible: PropTypes.func,
  visible: PropTypes.bool
};
