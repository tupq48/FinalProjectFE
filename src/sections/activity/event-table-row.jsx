import { useState } from 'react';
import PropTypes from 'prop-types';
// import { EyeOutlined, EyeInvisibleOutlined, } from '@ant-design/icons';

import { Stack } from '@mui/material';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';


// ----------------------------------------------------------------------

export default function EventTableRow({
  selected,
  id,
  eventName,
  avatarUrl,
  endTime,
  startTime,
  location,
  point,
  handleClick,
}) {
  const [open, setOpen] = useState(null);
  // const [, setLoading] = useState(false);
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <Avatar alt={eventName} src={avatarUrl} /> */}
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
        <MenuItem >
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          View Detail
        </MenuItem>
      </Popover>
    </>
  );
}

EventTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  endTime: PropTypes.any,
  handleClick: PropTypes.func,
  location: PropTypes.any,
  eventName: PropTypes.any,
  startTime: PropTypes.any,
  selected: PropTypes.any,
  point: PropTypes.string,
  id: PropTypes.any,
};
