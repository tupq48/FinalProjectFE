import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import userService from '../service/userService';
import UserTableToolbar from '../user-table-toolbar';
import UserRegistrationDialog from '../UserRegistrationDialog';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [open, openChange] = useState(false);
  const [visible, setVisible] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    gmail: '',
    username: '',
    password: '',
    phoneNumber: '',
    gender: '',
  });
  const functionOpenPopup = () => {
    openChange(true);
  };
  const closePopup = () => {
    openChange(false);
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (users.length === 0) {
    return <TableNoData />;
  }
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const data = await userService.addUser(formData);
      console.log('User registered:', data);
      closePopup();
    } catch (error) {
      console.error('Failed to register user:', error.response);
    }
    fetchData();
  };

  const notFound = !dataFiltered.length && !!filterName;
  const handleChange = (e) => {
    const id = e.target.id.includes('Select') ? 'gender' : e.target.id;
    setFormData({ ...formData, [id]: e.target.value });
  };

  const validateForm = () => {
    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return false;
    }
    return true;
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Users</Typography>

        <Button
          onClick={functionOpenPopup}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          New User
        </Button>
        <UserRegistrationDialog
          open={open}
          closePopup={closePopup}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          setVisible={setVisible}
          visible={visible}
        />
      </Stack>
      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
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
                  { id: 'phone', label: 'Phone', align: 'center' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <UserTableRow
                    key={row.user_id}
                    id={row.id}
                    name={row.name}
                    gender={row.gender}
                    status={row.enabled}
                    email={row.gmail}
                    avatarUrl={row.urlImage}
                    phone={row.phoneNumber}
                    selected={selected.indexOf(row.name) !== -1}
                    handleClick={(event) => handleClick(event, row.name)}
                  />
                ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {notFound && <TableNoData query={filterName} />}
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
      </Card>
    </Container>
  );
}
