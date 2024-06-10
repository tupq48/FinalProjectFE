import Joi from 'joi';
import { useState } from 'react';

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import {
  Box,
  Link,
  Card,
  Grid,
  Stack,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
} from '@mui/material';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

import userService from '../user/service/userService';

// ----------------------------------------------------------------------
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
  repeatPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': '"Repeat Password" must match "Password".',
    'any.required': '"Repeat Password" is required.',
  }),
  gender: Joi.string().valid('MALE', 'FEMALE').required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(10)
    .required(),
});

export default function RegisterView() {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    gmail: '',
    username: '',
    password: '',
    repeatPassword: '',
    gender: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

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
    const validationResult = schema.validate(formData, { abortEarly: false });
    if (validationResult.error) {
      const newErrors = {};
      validationResult.error.details.forEach((detail) => {
        newErrors[detail.context.key] = detail.message;
      });
      setErrors(newErrors);
      return;
    }

    // const { repeatPassword, ...saveData } = formData;
    // console.log('Form data:', saveData);
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
  form.append(key, value);
});
    const response = await userService.addUser(form);
    localStorage.setItem('accessToken', response.accessToken);
    alert('save done');
    console.log(response);
    window.location.href = '/';
  };

  const renderForm = (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="gmail"
            label="Email address"
            value={formData.gmail}
            onChange={handleChange}
            error={!!errors.gmail}
            helperText={errors.gmail}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="repeatPassword"
            label="Repeat Password"
            type={showRepeatPassword ? 'text' : 'password'}
            value={formData.repeatPassword}
            onChange={handleChange}
            error={!!errors.repeatPassword}
            helperText={errors.repeatPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowRepeatPassword(!showRepeatPassword)} edge="end">
                    <Iconify icon={showRepeatPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={6} sx={{ position: 'relative' }}>
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
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
            </Select>
          </FormControl>
          {errors.gender && (
            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
              {errors.gender}
            </Typography>
          )}
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            name="phoneNumber"
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
          />
        </Grid>
      </Grid>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleSubmit} // Change onClick to call handleSubmit function
        style={{ marginTop: '20px' }}
      >
        Register
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Sign up</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Already have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }} href="/login">
              Login now
            </Link>
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
