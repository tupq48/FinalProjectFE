import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress'; // Thêm CircularProgress

import { getEventsByPage } from 'src/_mock/events';

import Iconify from 'src/components/iconify';

import EventCard from '../event-card';

export default function EventPage() {
  const [page, setPage] = useState(0);
  const [totalEvent, setTotalEvent] = useState(0);
  const [events, setEvents] = useState([]);
  const [eventsPerPage, setEventsPerPage] = useState(8);
  const [loading, setLoading] = useState(false); // Thêm state cho loading

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true); // Bắt đầu loading khi gọi API
        const fetchedEvents = await getEventsByPage(1);
        setEvents(fetchedEvents.events);
        setTotalEvent(fetchedEvents.total);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false); // Kết thúc loading sau khi API call xong
      }
    };

    fetchEvents();
  }, []);

  const handleChangePage = async (event, newPage) => {
    setLoading(true); // Bắt đầu loading khi gọi API
    setEvents([]);
    const data = await getEventsByPage(newPage + 1, eventsPerPage);
    setEvents(data.events);
    setTotalEvent(data.total);
    setPage(newPage);
    setLoading(false); // Kết thúc loading sau khi API call xong
  };

  const handleChangeEventsPerPage = async (event) => {
    setPage(0);
    setLoading(true); // Bắt đầu loading khi gọi API
    setEvents([]);
    const newEventsPerPage = parseInt(event.target.value, 10);
    setEventsPerPage(newEventsPerPage);
    const data = await getEventsByPage(1, newEventsPerPage);
    setEvents(data.events);
    setTotalEvent(data.total);
    setLoading(false); // Kết thúc loading sau khi API call xong
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Events</Typography>
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New Event
        </Button>
      </Stack>
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
          rowsPerPageOptions={[8, 12, 16]}
          onRowsPerPageChange={handleChangeEventsPerPage}
          labelRowsPerPage="Events Per Page"
        />
      </Card>
    </Container>
  );
}
