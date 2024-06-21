import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress'; // Thêm CircularProgress

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
  const [cloneUsers, setCloneUsers] = useState([]);
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
  let notFound;
  const functionOpenPopup = () => {
    openChange(true);
  };
  const closePopup = () => {
    openChange(false);
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
      setCloneUsers(data);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setLoading(false);
    }
    finally {
      setLoading(false);
    }

  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelecteds = users.map((n) => n.name);
  //     setSelected(newSelecteds);
  //     return;
  //   }
  //   setSelected([]);
  // };

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
  // let dataFiltered;
  const handleFilterByName = async (event) => {
    setPage(0);
    const filterValue = (event.target.value);
    const dataFiltered = applyFilter({
      inputData: cloneUsers,
      comparator: getComparator(order, orderBy),
      filterName: filterValue,
    });
    setFilterName(event.target.value);
    setUsers(dataFiltered);
  };
  function formatDateTime(date) {
    date = new Date(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
  const onSubmitUser = async (form) => {
    const formAdd = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === 'dateOfBirth') {
        value = formatDateTime(value);
      }
      formAdd.append(key, value);
    });
     toast
      .promise(userService.addUser(formAdd), {
        pending: 'Processing...',
        success: 'User added successfully!',
        error: 'An error occurred while adding the user!',
      })
      .then(async () => {
        setUsers([]);
        const data = await userService.getAllUsers();
        setUsers(data);
        setCloneUsers(data);
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.taget.name]: e.target.value });
    //   setFormData((prevData) => ({
    //     ...prevData,
    //     [name]: value,
    //   }));
  };
  const onSubmitUpdateUser = async (formDataUpdate) => {
     toast
      .promise(userService.updateUser(formDataUpdate), {
        pending: 'Processing...',
        success: 'User updated successfully!',
        error: 'An error occurred while updating the user!',
      })
      .then(async () => {
        fetchData();      
      });
  };
  const onDeleteUser = async (id) => {
    toast
     .promise(userService.deleteUser(id), {
       pending: 'Processing...',
       success: 'User deleted successfully!',
       error: 'An error occurred while deleting the user!',
     })
     .then(async () => {
       fetchData();      
     });
 };

  return (
    <Container>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Users</Typography>

        <Button
          onClick={functionOpenPopup}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:person-add-fill" />}
        >
          New User
        </Button>
        <UserRegistrationDialog
          open={open}
          closePopup={closePopup}
          formData={formData}
          handleChange={handleChange}
          onSubmitUser={onSubmitUser}
          setVisible={setVisible}
          visible={visible}
        />
      </Stack>
      {loading && (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '70vh' }}>
          <CircularProgress size={100} />
        </Grid>
      )}
      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          // filterName={filterName}
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
                // onSelectAllClick={handleSelectAllClick}
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
                    onSubmitUpdateUser={onSubmitUpdateUser}
                    onDeleteUser={onDeleteUser}
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
