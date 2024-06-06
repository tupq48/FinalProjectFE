import { useState } from 'react';
import PropTypes from 'prop-types';
// import { EyeOutlined, EyeInvisibleOutlined, } from '@ant-design/icons';
import { toast   } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Stack, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { updateStatusRegistrants } from 'src/_mock/events';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import ImageGallery from './imageGallery';
// ----------------------------------------------------------------------

export default function RegistrantsTableRow({
  selected,
  id,
  name,
  avatarUrl,
  email,
  gender,
  phone,
  status,
  eventId,
  handleClick,
  onRefreshUser,
  onDeleteUser
}) {
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openImagesPopup, setImagesPopup] = useState(false);
  // const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(null);
  const [, setLoading] = useState(false);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const openDeletePopup = () => {
    setOpenDeleteConfirm(true);
  };
  const openImageGallery = async () => {
    try {
      setLoading(true);
      // await findUserById(id);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
    setImagesPopup(true);

  };
  const closeImagePopup = () => {
    setImagesPopup(false);
  };

  const closeDeletePopup = () => {
    setOpenDeleteConfirm(false);
  };
  const handleDeleteUser = async () => {
    try {
      const f = onDeleteUser(id);
      closeDeletePopup();
      await f;
    } catch (error) {
      console.error('Đã xảy ra lỗi khi đăng ký sự kiện:', error);
    }
  };
  const handleAccept = async () => {
    
    try {
      toast
      .promise(updateStatusRegistrants(eventId,id,0), {
        pending: 'Đang xử lý...',
        success: 'Cập nhật trạng thái thành công!',
        error: 'Đã xảy ra lỗi khi cập nhật trạng thái!',
      })
      .then(async () => {
        onRefreshUser()     
      });
      closeImagePopup();
    } catch (error) {
      console.error('Đã xảy ra lỗi khi đăng ký sự kiện:', error);
    }
  };
  const handleReject = async () => {
    
    try {
      toast
      .promise(updateStatusRegistrants(eventId,id,1), {
        pending: 'Đang xử lý...',
        success: 'Cập nhật trạng thái thành công!',
        error: 'Đã xảy ra lỗi khi cập nhật trạng thái!',
      })
      .then(async () => {
        onRefreshUser()     
      });
      closeImagePopup();
    } catch (error) {
      console.error('Đã xảy ra lỗi khi đăng ký sự kiện:', error);
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell> */}

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
        <MenuItem onClick={openImageGallery}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Evidence
        </MenuItem>
        <Dialog open={openImagesPopup} fullWidth onClose={closeImagePopup}>
          <DialogTitle>View submitted Evidence </DialogTitle>
          <DialogContent>
            <ImageGallery
            eventId={eventId}
            UserId={id}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAccept}>Accept</Button>
            <Button onClick={handleReject}>Reject</Button>
            <Button onClick={closeImagePopup}>Close</Button>

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
      {/* {loading && (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '70vh' }}>
          <CircularProgress size={100} />
        </Grid>
      )} */}
    </>
  );
}

RegistrantsTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  email: PropTypes.any,
  handleClick: PropTypes.func,
  phone: PropTypes.any,
  name: PropTypes.any,
  gender: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.any,
  id: PropTypes.any,
  eventId:PropTypes.any,
  onRefreshUser: PropTypes.func,
  onDeleteUser: PropTypes.func

};
