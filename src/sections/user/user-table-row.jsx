import { useState } from 'react';
import PropTypes from 'prop-types';
// import { EyeOutlined, EyeInvisibleOutlined, } from '@ant-design/icons';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Stack, Dialog, TextField, DialogTitle, DialogActions, DialogContent, } from '@mui/material';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import userService from './service/userService';
// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  id,
  name,
  avatarUrl,
  email,
  gender,
  phone,
  status,
  handleClick,
  onSubmitUpdateUser
}) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    gmail: '',
    username: '',
    phoneNumber: '',
    gender: '',
  });
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openUpdateForm, setUpdateForm] = useState(false);
  // const [visible, setVisible] = useState(true);
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(null);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const openDeletePopup = () => {
    setOpenDeleteConfirm(true);
  };
  const openUpdatePopup = () => {
    setUpdateForm(true);
    findUserById(id);
  };
  const closeUpdatePopup = () => {
    setUpdateForm(false);
  };

  const closeDeletePopup = () => {
    setOpenDeleteConfirm(false);
  };
  const handleDeleteUser = async () => {
    try {
      console.log("id: ", id);
      const data = await userService.deleleUser(id)
      if (data) {
        alert("Delele success")
      }
      else {
        alert("Error Delete");
      }
      window.location.reload();
    } catch (error) {
      console.error('Failed to register user:', error.response);
    } closeDeletePopup();
  };
  const findUserById = async () => {
    try {
      const data = await userService.getUserById(id)
      console.log("user Detail: ", data);
      setFormData({
        id: data.id,
        gender: data.gender,
        name: data.name,
        gmail: data.gmail,
        username: data.username,
        phoneNumber: data.phoneNumber,
      })
    } catch (error) {
      console.error('Error  get UserDetail data: ', error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleUpload = async () => {
    const formDataUpdate = new FormData();
    if (file) {
      formDataUpdate.append('image', file);
    }
    Object.entries(formData).forEach(([key, value]) => {
      formDataUpdate.append(key, value);
    });
    try {
      const f = onSubmitUpdateUser(formDataUpdate);
      closeUpdatePopup();
      await f;
    } catch (error) {
      console.error('Đã xảy ra lỗi khi đăng ký sự kiện:', error);
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>{gender}</TableCell>

        <TableCell align="center">{phone}</TableCell>

        <TableCell>
          <Label style={{ color: status ? 'green' : 'red' }}>
            {status ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={openUpdatePopup}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <Dialog open={openUpdateForm} fullWidth onClose={closeUpdatePopup}>
          <DialogTitle>User Update </DialogTitle>
          <DialogContent>
            <Stack spacing={2} margin={2}>
              <TextField id="name" label="FullName" value={formData.name} onChange={handleChange} />
              <TextField id="gmail" type='email' label="Gmail" value={formData.gmail} onChange={handleChange} />
              <TextField id="username" label="UserName" value={formData.username} onChange={handleChange} />
              <TextField id="phoneNumber" type='number' label="Phone Number"
                value={formData.phoneNumber} onChange={handleChange} />
              <TextField
                id="gender"
                label="Gender"
                value={formData.gender}
                onChange={handleChange}
              />
              <div>
              <Label htmlFor="avatar" style={{ fontSize: '20px', height:'0px' }}>Upload Avatar:</Label>
              <input type="file" label="Change Avatar" onChange={handleFileChange} />
              </div>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpload}>Submit</Button>
            <Button onClick={closeUpdatePopup}>Close</Button>
          </DialogActions>
        </Dialog>
        <MenuItem onClick={openDeletePopup} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
        <Dialog open={openDeleteConfirm} onClose={closeDeletePopup} fullWidth>
          <DialogTitle>Delete Confirm</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this user?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeletePopup} color="primary">
              Cancle
            </Button>
            <Button onClick={handleDeleteUser} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  email: PropTypes.any,
  handleClick: PropTypes.func,
  phone: PropTypes.any,
  name: PropTypes.any,
  gender: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
  id: PropTypes.any,
  onSubmitUpdateUser: PropTypes.func
};
