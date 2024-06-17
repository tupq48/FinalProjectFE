import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress'; // Thêm CircularProgress
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

import { Select, MenuItem , FormControl  } from '@mui/material';

import { registerEvent, getEventsByPage, getEventsByStatus } from 'src/_mock/events';

import Iconify from 'src/components/iconify';

import EventCard from '../event-card';
import EventPopup from '../add-event';
import TopUsersByEventPoints from '../TopUsersByEventPoints';

export default function EventPage() {
  const [page, setPage] = useState(0);
  const [totalEvent, setTotalEvent] = useState(0);
  const [events, setEvents] = useState([]);
  const [eventsPerPage, setEventsPerPage] = useState(8);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogTopUsers, setOpenDialogTopUsers] = useState(false);
  const [filterValue, setFilterValue] = useState('0');

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      let fetchedEvents;
      if (filterValue === 0) {
        fetchedEvents = await getEventsByPage(1);
      } else {
        fetchedEvents = await getEventsByStatus(1, 8, filterValue);
      }
      setEvents(fetchedEvents.events);
      setTotalEvent(fetchedEvents.total);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, [filterValue]);
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleChangePage = async (event, newPage) => {
    setLoading(true);
    setEvents([]);
    let data;
    if (filterValue === 0) {
      data = await getEventsByPage(newPage + 1, eventsPerPage);
    } else {
      data = await getEventsByStatus(newPage+ 1, eventsPerPage, filterValue);
    }
    setEvents(data.events);
    setTotalEvent(data.total);
    setPage(newPage);
    setLoading(false);
  };

  const handleChangeEventsPerPage = async (event) => {
    setPage(0);
    setLoading(true);
    setEvents([]);
    const newEventsPerPage = parseInt(event.target.value, 10);
    setEventsPerPage(newEventsPerPage);
    let data;
    if (filterValue === 0) {
      data = await getEventsByPage(1, newEventsPerPage);
    } else {
      data = await getEventsByStatus(1, newEventsPerPage, filterValue);
    }
    setEvents(data.events);
    setTotalEvent(data.total);
    setLoading(false);
  };

  const handleOpenDialog = (event) => {
    setOpenDialog(true);
  };
  const handleOpenDialogTopUsers = (event) => {
    setOpenDialogTopUsers(true);
  };

  const onSubmitEvent = async (form) => {
    console.log(form);
    toast
      .promise(registerEvent(form), {
        pending: 'Đang xử lý...',
        success: 'Sự kiện đã được đăng ký thành công!',
        error: 'Đã xảy ra lỗi khi đăng ký sự kiện!',
      })
      .then(() => {
        setEvents([]);
        fetchEvents();
      });
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Events</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Iconify icon="eva:people-outline" />}
            onClick={handleOpenDialogTopUsers}
          >
            Top Users By Event Point
          </Button>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenDialog}
          >
            New Event
          </Button>
        </Stack>
      </Stack>
      <Grid item xs={6} style={{}}>
    <Stack direction="row" alignItems="center" justifyContent="flex-end">
      <FormControl style={{ minWidth: '140px', marginBottom:'20px' }}>
        <Select
          labelId="event-filter"
          id="event-filter-select"
          value={filterValue}
          onChange={handleFilterChange}
        >
          <MenuItem value="0">All</MenuItem>
          <MenuItem value="1">On Going</MenuItem> 
          <MenuItem value="2">Upcoming</MenuItem>
          <MenuItem value="3">Completed</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  </Grid>
      {loading && (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '70vh' }}>
          <CircularProgress size={100} />
        </Grid>
      )}
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid key={event.eventId} xs={12} sm={6} md={3}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>
      <Card style={{ marginTop: '16px' }}>
        <TablePagination
          page={page}
          component="div"
          count={totalEvent}
          rowsPerPage={eventsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[8, 12, 16, 60]}
          onRowsPerPageChange={handleChangeEventsPerPage}
          labelRowsPerPage="Events Per Page"
        />
      </Card>
      <EventPopup
        isOpen={openDialog}
        label="Add Event"
        onClose={() => setOpenDialog(false)}
        onSubmitEvent={onSubmitEvent}
      />
      <TopUsersByEventPoints
        isOpen={openDialogTopUsers}
        label="Top 10 Users By Event Point"
        // initialValues={data}
        onClose={() => setOpenDialogTopUsers(false)}
        // onSubmitEvent={handleEditEvent}
        // EventId={id}
      />
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
    </Container>
  );
}
