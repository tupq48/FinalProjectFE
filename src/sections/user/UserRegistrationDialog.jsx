import React from 'react';
import PropTypes from 'prop-types';
import { EyeOutlined, EyeInvisibleOutlined, } from '@ant-design/icons';

import {
  Stack,
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,

} from '@mui/material';

function UserRegistrationDialog({ open, closePopup, formData, handleChange, handleSubmit, setVisible, visible }) {
  return (
    <Dialog open={open} fullWidth onClose={closePopup}>
      <DialogTitle>User Register </DialogTitle>
      <DialogContent>
        <Stack spacing={2} margin={2}>

          <TextField id="name" label="FullName" value={formData.name} placeholder="name" onChange={handleChange} />
          <TextField id="gmail" type='email' label="Gmail" value={formData.gmail} placeholder="gmail" onChange={handleChange} />
          <TextField id="username" label="UserName" value={formData.username} placeholder="username" onChange={handleChange} />
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <TextField
              id="password"
              type={visible ? "text" : "password"}
              label="Password"
              value={formData.password}
              placeholder="password"
              onChange={handleChange}
              style={{ flex: 1 }}
            />
            <Button onClick={() => setVisible(!visible)} style={{ right: '0', position: 'absolute' }}>
              {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </Button>
          </div>
          <TextField id="phoneNumber" type='number' label="Phone Number"
            value={formData.phoneNumber} placeholder="phoneNumber" onChange={handleChange} />
          <TextField
            id="gender"
            label="Gender"
            value={formData.gender}
            placeholder="gender"
            onChange={handleChange}
          />
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
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  setVisible: PropTypes.func,
  visible: PropTypes.bool
};

export default UserRegistrationDialog;