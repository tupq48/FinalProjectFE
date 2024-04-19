import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

// import Scrollbar from 'src/components/scrollbar';
// import { events } from 'src/_mock/events';
import { getEventsByPage } from 'src/_mock/events';

import Iconify from 'src/components/iconify';

import EventCard from '../event-card';

// ----------------------------------------------------------------------

export default function EventPage() {
  const [page, setPage] = useState(0);

  const [totalEvent, setTotalEvent] = useState(0);

  const [events, setEvents] = useState([]);

  //   const [order, setOrder] = useState('asc');

  //   const [selected, setSelected] = useState([]);

  //   const [orderBy, setOrderBy] = useState('name');

  //   const [filterName, setFilterName] = useState('');

  const [eventsPerPage, setEventsPerPage] = useState(8);

  //   const handleSort = (event, id) => {};

  //   const handleSelectAllClick = (event) => {};

  //   const handleClick = (event, name) => {};

  useEffect(() => {
    // Gọi API khi component được tải lần đầu tiên
    const fetchEvents = async () => {
      try {
        // Gọi API để lấy danh sách sự kiện từ trang 1 với kích thước trang mặc định là 10
        const fetchedEvents = await getEventsByPage(1);
        setEvents(fetchedEvents.events); // Cập nhật state với danh sách sự kiện đã lấy được
        setTotalEvent(fetchedEvents.total);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents(); // Gọi hàm fetchEvents
  }, []);

  const handleChangePage = async (event, newPage) => {
    const data = await getEventsByPage(newPage + 1, eventsPerPage);
    setEvents(data.events);
    setTotalEvent(data.total);
    setPage(newPage);
  };

  const handleChangeEventsPerPage = async (event) => {
    setPage(0);
    const newEventsPerPage = parseInt(event.target.value, 10);
    setEventsPerPage(newEventsPerPage);
    const data = await getEventsByPage(1, newEventsPerPage);
    setEvents(data.events);
    setTotalEvent(data.total);
  };

  //   const handleFilterByName = (event) => {};

  //   const dataFiltered = applyFilter({});

  //   const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Events</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New Event
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid key={event.id} xs={12} sm={6} md={3}>
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
          rowsPerPageOptions={[8, 12, 16]}
          onRowsPerPageChange={handleChangeEventsPerPage}
          labelRowsPerPage="Events Per Page"
        />
      </Card>
    </Container>
  );
}
