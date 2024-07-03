import { jwtDecode } from 'jwt-decode';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import React, { useState, useEffect, useCallback } from 'react';

import Container from '@mui/material/Container';
import { Grid, Table, TableBody, TableContainer, TablePagination, CircularProgress } from '@mui/material';

import Scrollbar from 'src/components/scrollbar';

import UserTableHead from 'src/sections/user/user-table-head';
import userService from 'src/sections/user/service/userService';
import { isModelExist } from 'src/sections/ai-model/api/ai-model-api';

import EventTableRow from '../event-table-row';
import { uploadProofImage } from '../api/activity-api';



// ----------------------------------------------------------------------

export default function ActivityView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [hasModel, setHasModel] = useState(false);
  const [totalPoint, setTotalPoint] = useState(0);
  const token = localStorage.getItem('accessToken');
  const idUser = findId(token);

  function findId(userToken) {
    try {
      const decoded = jwtDecode(userToken);
      return decoded.id;
    } catch (e) {
      console.error('Invalid token:', e);
      return false;
    }
  }

  const reloadTotalPoint = (data) => {
    let point = 0;
    data.map(event => {
      if (event.status === "attended") {
        point += event.point;
        console.log("cộng");
      }
      return "";
    });
    setTotalPoint(point);
  }


  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getListOfEventAttended(idUser);
      setEvents(data);
      reloadTotalPoint(data);

      const model = await isModelExist();
      setHasModel(model);
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

  const handleUploadProofImage = async (image, eventId) => {
    const id = toast.loading('Đang xử lý...');
    try {
      const result = await uploadProofImage(image, eventId);
      if (result) {
        toast.update(id, { render: 'Upload ảnh thành công!', type: 'success', isLoading: false, autoClose: 3000 });
      } else {
        toast.update(id, { render: 'Model không thể nhận diện được bạn, minh chứng của bạn sẽ được admin duyệt thủ công!', type: 'error', isLoading: false, autoClose: 3000 });
      }
      const data = await userService.getListOfEventAttended(idUser);
      setEvents(data);
      reloadTotalPoint(data);
    } catch (error) {
      toast.update(id, { render: 'Đã xảy ra lỗi khi upload hình ảnh, vui lòng thử lại sau!', type: 'error', isLoading: false, autoClose: 3000 });
      console.error('Lỗi khi upload hình ảnh:', error);
    }
  }

  return (
    <>
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
      <Container>
        {loading && (
          <Grid container justifyContent="center" alignItems="center" style={{ height: '70vh' }}>
            <CircularProgress size={100} />
          </Grid>
        )}
        {!loading && (
          <>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h3>List Event Registered</h3>
              <h3>Total Point: {totalPoint}</h3>
            </div>
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <UserTableHead open={false}
                    noNeedCheckbox
                    headLabel={[
                      { id: 'eventName', label: 'Event Name' },
                      { id: 'startTime', label: 'Start Time' },
                      { id: 'endTime', label: 'End Time' },
                      { id: 'location', label: 'Location', align: 'center' },
                      { id: 'point', label: 'Point' },
                      { id: 'status', label: 'Status' },
                      { id: 'image', label: 'Upload Image' },
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
                        status={row.status}
                        eventId={row.eventId}
                        imageUrl={row.imageUrl}
                        isModelExist={hasModel}
                        handleClick={(event) => handleClick(event, row.name)}
                        handleUploadProofImage={handleUploadProofImage}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                page={page}
                component="div"
                count={events.length}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Scrollbar>
          </>
        )}
      </Container>
    </>
  );
}