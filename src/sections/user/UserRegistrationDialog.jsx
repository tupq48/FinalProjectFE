import Joi from 'joi';
import PropTypes from 'prop-types';
import { React,useState } from 'react';
import { EyeOutlined, EyeInvisibleOutlined, } from '@ant-design/icons';

import {
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
// Define validation schema using Joi
const schema = Joi.object({
  name: Joi.string()
    .pattern(/^[\p{L}\s']*$/u)
    .max(100)
    .required()
    .messages({
      'string.pattern.base': '"Name" must not contain numbers or special characters.',
      'string.max': '"Name" must have a maximum length of {#limit} characters.',
      'any.required': '"Name" is required.',
    }),
  gmail: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,50}$/)
    .strict()
    .required()
    .messages({
      'string.pattern.base':
        '"Password" must contain at least one uppercase letter, one lowercase letter, and one digit.',
      'any.required': '"Password" is required.',
    }),
  // repeatPassword: Joi.string().valid(Joi.ref('password')).required().messages({
  //   'any.only': '"Repeat Password" must match "Password".',
  //   'any.required': '"Repeat Password" is required.',
  // }),
  gender: Joi.string().valid('MALE', 'FEMALE').required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(10)
    .required(),
});
export default function UserRegistrationDialog({ open, closePopup, onSubmitUser, setVisible, visible }) {
  const [formData, setFormData] = useState({
    name: '',
    gmail: '',
    username: '',
    password: '',
    phoneNumber: '',
    gender: '',
  });
  const [errors, setErrors] = useState({});

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
  const handleSubmit = async () => {
    console.log("ahihi")
    const validationResult = schema.validate(formData, { abortEarly: false });
    console.log("ahihi2")
    if (validationResult.error) {
      console.log("ahihi3")
      const newErrors = {};
      validationResult.error.details.forEach((detail) => {
        newErrors[detail.context.key] = detail.message;
      });
      setErrors(newErrors);
      return;
    }
    console.log("ahihi4")

    try {
      const f = onSubmitUser(formData);
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
        <Stack spacing={2} margin={2}>

          <TextField name="name" label="FullName" value={formData.name} placeholder="name" onChange={handleChange} error={!!errors.name}
            helperText={errors.name} />
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
          {/* <TextField
            id="gender"
            label="Gender"
            value={formData.gender}
            placeholder="gender"
            onChange={handleChange}
          /> */}
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
