import PropTypes from 'prop-types';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useCallback } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Box, Modal, Button, MenuItem, TextField } from '@mui/material';

import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from '../user/utils';
import TopUserTableRow from './top-users-table-row';
import UserTableHead from '../user/user-table-head';
import TableEmptyRows from '../user/table-empty-rows';
import userService from '../user/service/userService';


const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const years = [];
const currentYear = new Date().getFullYear();
let year = currentYear;
while (year >= 2020) {
  years.push(year);
  year -= 1;
}
const filters = [
  { value: 'month', label: 'Filter by Month' },
  { value: 'year', label: 'Filter by Year' },
];
function TopUsersByEventPoints({ isOpen, onClose, label }) {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  // const [filterName,] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const fetchData = useCallback(async (searchString) => {
    try {
      setLoading(true);
      const data = await userService.getTopUsersByEventPoints(searchString);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  }, []);
  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần +1
  // const currentYear = currentDate.getFullYear();
  const [filterType, setFilterType] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [, setSearchResult] = useState(null);

  const handleSearch = () => {
    let result;
    let startTime;
    let endTime; 
    if (filterType === 'month') {
      result = `Searching for information in month: ${selectedMonth} (${months[selectedMonth - 1]}), year: ${selectedYear}`;
      const startDate = new Date(selectedYear, selectedMonth-1, 1);
      startTime = `${startDate.toLocaleDateString('sv-SE')} 00:00:00`;
  
      const endDate = new Date(selectedYear, selectedMonth, 0);
      endTime = `${endDate.toLocaleDateString('sv-SE')} 23:59:59`;
    } else {
      result = `Searching for information in year: ${selectedYear}, ${selectedMonth }`;
      startTime=`${selectedYear}-01-01 00:00:00`;
      endTime=`${selectedYear}-12-31 23:59:59`;
    }
    console.log("time: ", startTime, ", ", endTime)

    setSearchResult(result);
    const searchString = `startDate=${startTime}&endDate=${endTime}`;
    console.log("search: ", searchString)
    fetchData(searchString);
  };
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          minWidth: '1000px',
        }}
      >
        <h3 style={{ textAlign: 'center' }}>{label}</h3>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              select
              label="Filter Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              {filters.map((filter) => (
                <MenuItem key={filter.value} value={filter.value}>
                  {filter.label}
                </MenuItem>
              ))}
            </TextField>

            {filterType === 'month' && (
              <TextField
                select
                label="Month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                sx={{ minWidth: 120 }}
              >
                {months.map((month, index) => (
                  <MenuItem key={index} value={index + 1}>
                    {month}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              select
              label="Year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ ml: 2 }}>
              <Button variant="contained" color="primary" onClick={handleSearch}>
                Search
              </Button>
            </Box>
          </Box>
          <div> </div>

          {/* {searchResult && (
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              {searchResult}
            </Typography>
          )} */}
        </Box>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead open={false}
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'gender', label: 'Gender' },
                  { id: 'amoutOfEvents', label: 'Amount Of Event', align: 'center' },
                  { id: 'point', label: 'Total Point' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TopUserTableRow
                    key={row.user_id}
                    id={row.id}
                    name={row.name}
                    gender={row.gender}
                    point={row.point}
                    email={row.gmail}
                    avatarUrl={row.urlImage}
                    amountOfEvent={row.amountOfEvent}
                  />
                ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          page={page}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </Modal>

  );
}

TopUsersByEventPoints.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default TopUsersByEventPoints;
