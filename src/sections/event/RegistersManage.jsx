import PropTypes from 'prop-types';
import { toast   } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';

import { Modal } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../user/table-no-data';
import UserTableRow from '../user/user-table-row';
import UserTableHead from '../user/user-table-head';
import TableEmptyRows from '../user/table-empty-rows';
import userService from '../user/service/userService';
import UserTableToolbar from '../user/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../user/utils' ;



function RegistersManagePopup({ isOpen, onClose, onSubmitEvent, initialValues, label }) {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
 
  const fetchData = async (id) => {
    try {
      setLoading(true);
      const data = await userService.getListOfEventRegistrants(id);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setLoading(false);
    }
    finally {
      setLoading(false);
    }

  };
  useEffect(() => {
    if (initialValues != null && initialValues.eventId != null) {
      fetchData(initialValues.eventId);
    }
  }, [initialValues]);  
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
  const notFound = !dataFiltered.length && !!filterName;
  const onSubmitUpdateUser = async (formDataUpdate) => {
     toast
      .promise(userService.updateUser(formDataUpdate), {
        pending: 'Đang xử lý...',
        success: 'Cập nhật user thành công!',
        error: 'Đã xảy ra lỗi khi cập nhật user!',
      })
      .then(async () => {
        fetchData();      
      });
  };
  const onDeleteUser = async (id) => {
    toast
     .promise(userService.removeRegistrantFromEvent(id,initialValues.eventId), {
       pending: 'Đang xử lý...',
       success: 'Delete user from event success!',
       error: 'Đã xảy ra lỗi khi cập nhật user!',
     })
     .then(async () => {
       fetchData(initialValues.eventId);      
     });
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
        <h3 style={{ textAlign: 'center' }}>{initialValues ? 'List of Event Registrants' : label}</h3>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />
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
        </div>
      </Modal>
    
  );
}

RegistersManagePopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmitEvent: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  label: PropTypes.string.isRequired,
};

export default RegistersManagePopup;
