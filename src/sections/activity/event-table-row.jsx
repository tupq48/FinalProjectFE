import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import {Stack,  Button  } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';


// ----------------------------------------------------------------------

export default function EventTableRow({
  eventId,
  selected,
  eventName,
  endTime,
  startTime,
  location,
  point,
  status,
  handleClick,
  imageUrl,
  isModelExist,
  handleUploadProofImage
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const renderAction = () => {
    if (!isModelExist) {
      return "Cần tạo Model AI trước!";
    }

    const [time, date] = startTime.split(' ');
    const [hours, minutes, seconds] = time.split(':');
    const [day, month, year] = date.split('-');

    const startDate = new Date(year, month - 1, day, hours, minutes, seconds);
    const currentDate = new Date();

    if (imageUrl != null && imageUrl !== "") {
      if (status === "registered")
        return <a href={imageUrl}>Waiting Admin Accept</a>;
      if (status === "attended")
        return <a href={imageUrl}>Accepted</a>;
      if (status === 'registered_but_not_attended')
        return <a href={imageUrl}>Not Acceptted</a>
    }

    // So sánh thời gian hiện tại với startTime
    if (currentDate > startDate && status === "registered") {
      return (
        <Button variant="contained" component="label" sx={{ marginTop: '8px', marginBottom: '16px' }} >
          Nộp ảnh
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(event) => handleUploadProofImage(event.target.files[0], eventId)}
          />
        </Button>
      );
    }
    
    return " ";
  }
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {eventName}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{startTime}</TableCell>

        <TableCell>{endTime}</TableCell>

        <TableCell align="center">{location}</TableCell>

        <TableCell>
          {point}
        </TableCell>

        <TableCell>
          {status === "registered_but_not_attended" ? "Registered But Not Attended" : status}
        </TableCell>

        <TableCell>
          {renderAction()}
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

        <MenuItem>
          <Link
            to={`/event/${eventId}`}
            style={{
              color: 'inherit',
              textDecoration: 'none',
              fontSize: '1rem',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
            }}>
            <Iconify icon="eva:edit-fill" sx={{ marginRight: "10px" }} />
            View Event
          </Link>
        </MenuItem>
      </Popover>
    </>
  );
}

EventTableRow.propTypes = {
  eventId: PropTypes.number,
  endTime: PropTypes.any,
  handleClick: PropTypes.func,
  location: PropTypes.any,
  eventName: PropTypes.any,
  startTime: PropTypes.any,
  selected: PropTypes.any,
  point: PropTypes.string,
  status: PropTypes.string,
  imageUrl: PropTypes.string,
  isModelExist: PropTypes.bool,
  handleUploadProofImage: PropTypes.func
};
