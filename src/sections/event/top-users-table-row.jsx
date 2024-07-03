import { useState } from 'react';
import PropTypes from 'prop-types';
import 'react-toastify/dist/ReactToastify.css';

import {Stack} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------


export default function TopUserTableRow({
  id,
  name,
  avatarUrl,
  email,
  gender,
  amountOfEvent,
  point,
}) {
  const [, setOpen] = useState(null);
//   const [, setLoading] = useState(false);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };  
  

  return (
      <TableRow hover tabIndex={-1} role="checkbox">
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

        <TableCell align="center">{amountOfEvent}</TableCell>

        <TableCell align="center">
            {point}
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
  );

}
TopUserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  email: PropTypes.any,
  amountOfEvent: PropTypes.any,
  name: PropTypes.any,
  gender: PropTypes.any,
  point: PropTypes.any,
  id: PropTypes.any,

};
