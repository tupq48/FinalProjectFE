import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect, useCallback  } from 'react';

import Container from '@mui/material/Container';
import { Table, TableBody, TableContainer, TablePagination } from '@mui/material';

import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from 'src/sections/user/utils' ;
import UserTableHead from 'src/sections/user/user-table-head';
import userService from 'src/sections/user/service/userService';
import TableEmptyRows from 'src/sections/user/table-empty-rows';

import EventTableRow from '../event-table-row';


// ----------------------------------------------------------------------

export default function ActivityView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [, setLoading] = useState(true);
  const [events,setEvents] =useState([]);
  const [selected, setSelected] = useState([]);

  function findId(token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (e) {
      console.error('Invalid token:', e);
      return false;
    }
  }
  const token = localStorage.getItem('accessToken');
  const idUser = findId(token);
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getListOfEventAttended(idUser);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  }, [idUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  return (
    <Container>
      <h3 style={{ textAlign: 'center' }}>List of Event Attended</h3>
      <Scrollbar>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <UserTableHead open={false}
              // order={order}
              // orderBy={orderBy}
              // rowCount={users.length}
              // numSelected={selected.length}
              // onRequestSort={handleSort}
              // onSelectAllClick={handleSelectAllClick}
              headLabel={[
                { id: 'eventName', label: 'Event Name' },
                { id: 'startTime', label: 'Start Time' },
                { id: 'endTime', label: 'End Time' },
                { id: 'location', label: 'Location', align: 'center' },
                { id: 'point', label: 'Point' },
                { id: '' },
              ]}
            />
            <TableBody>
              {events.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <EventTableRow
                  key={row.user_id}
                  id={row.id}
                  eventName={row.eventName}
                  startTime={row.startTime}
                  point={row.point}
                  endTime={row.endTime}
                  avatarUrl={row.urlImage}
                  location={row.location}
                  // selected={selected.indexOf(row.name) !== -1}
                  handleClick={(event) => handleClick(event, row.name)}
                />
              ))}
              <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, events.length)}
                />
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
      <TablePagination
          page={page}
          component="div"
          count={events.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </Container>
  );
}