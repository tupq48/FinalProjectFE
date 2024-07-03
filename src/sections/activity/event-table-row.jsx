import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Stack, Button, Tooltip } from '@mui/material';

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
  handleUploadProofImage,
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
      return 'You need to create a Identification Model first!';
    }

    const [time, date] = startTime.split(' ');
    const [hours, minutes, seconds] = time.split(':');
    const [day, month, year] = date.split('-');

    const startDate = new Date(year, month - 1, day, hours, minutes, seconds);
    const currentDate = new Date();

    const linkStyle = {
      color: 'inherit', // Giữ nguyên màu chữ
      textDecoration: 'none', // Loại bỏ gạch chân
    };

    if (imageUrl != null && imageUrl !== '') {
      if (status === 'registered')
        return (
          <a href={imageUrl} target="_blank" style={linkStyle} rel="noopener noreferrer">
            Waiting Admin Accept
          </a>
        );
      if (status === 'attended')
        return (
          <a href={imageUrl} target="_blank" style={linkStyle} rel="noopener noreferrer">
            Accepted
          </a>
        );
      if (status === 'registered_but_not_attended')
        return (
          <a href={imageUrl} target="_blank" style={linkStyle} rel="noopener noreferrer">
            Not Acceptted
          </a>
        );
    }

    // So sánh thời gian hiện tại với startTime
    if (currentDate > startDate && status === 'registered') {
      return (
        <Button
          variant="contained"
          component="label"
          sx={{ marginTop: '8px', marginBottom: '16px' }}
        >
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

    return ' ';
  };

  const tooltipTitleStatus =
    status === 'registered_but_not_attended'
      ? 'Registered But Not Attended'.toUpperCase()
      : status.toUpperCase();

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Tooltip title={eventName}>
              <span
                style={{
                  color: 'darkblue',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '200px', // Điều chỉnh kích thước theo yêu cầu
                  display: 'inline-block',
                }}
              >
                {eventName}
              </span>
            </Tooltip>
          </Stack>
        </TableCell>

        <TableCell>
          <Tooltip title={startTime.split(' ')[1]}>
            <span
              style={{
                color: 'dimgray',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '200px', // Điều chỉnh kích thước theo yêu cầu
                display: 'inline-block',
              }}
            >
              {startTime.split(' ')[1]}
            </span>
          </Tooltip>
        </TableCell>

        <TableCell>
          <Tooltip title={endTime.split(' ')[1]}>
            <span
              style={{
                color: 'dimgray',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '200px', // Điều chỉnh kích thước theo yêu cầu
                display: 'inline-block',
              }}
            >
              {endTime.split(' ')[1]}
            </span>
          </Tooltip>
        </TableCell>

        <TableCell align="center">
          <Tooltip title={location}>
            <span
              style={{
                color: 'dimgray',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100px', // Điều chỉnh kích thước theo yêu cầu
                display: 'inline-block',
              }}
            >
              {location}
            </span>
          </Tooltip>
        </TableCell>

        <TableCell>
          <Tooltip title={point}>
            <span
              style={{
                color: 'dimgray',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '150px', // Điều chỉnh kích thước theo yêu cầu
                display: 'inline-block',
              }}
            >
              {point}
            </span>
          </Tooltip>
        </TableCell>

        <TableCell>
          <Tooltip title={tooltipTitleStatus}>
            <span
              style={{
                color: 'dimgray',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '150px', // Điều chỉnh kích thước theo yêu cầu
                display: 'inline-block',
              }}
            >
              {tooltipTitleStatus}
            </span>
          </Tooltip>
        </TableCell>
        {console.log(status)}
        <TableCell>
          {!isModelExist ? (
            <Tooltip title={renderAction()}>
              <span
                style={{
                  color: renderAction().length > 15 ? 'red' : 'blue',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '150px', // Điều chỉnh kích thước theo yêu cầu
                  display: 'inline-block',
                }}
              >
                {renderAction()}
              </span>
            </Tooltip>
          ) : (
            <span
              style={{
                color: renderAction().length > 15 ? 'red' : 'blue',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '150px', // Điều chỉnh kích thước theo yêu cầu
                display: 'inline-block',
              }}
            >
              {renderAction()}
            </span>
          )}
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
            }}
          >
            <Iconify icon="eva:edit-fill" sx={{ marginRight: '10px' }} />
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
  startTime: PropTypes.string,
  selected: PropTypes.string,
  point: PropTypes.string,
  status: PropTypes.string,
  imageUrl: PropTypes.string,
  isModelExist: PropTypes.bool,
  handleUploadProofImage: PropTypes.func,
};
