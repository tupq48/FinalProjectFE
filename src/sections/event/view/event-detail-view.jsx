import Carousel from 'react-material-ui-carousel';
import { Navigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

export default function EventDetailView() {
  const { id } = useParams();

  // Kiểm tra nếu id không phải là số, chuyển hướng tới trang 404
  if (Number.isNaN(Number(id))) {
    return <Navigate to="/404" replace />;
  }

  const items = [
    <img key={1} src="https://picsum.photos/300/200" alt="" />,
    <img key={2} src="https://picsum.photos/300/200" alt="" />,
    <img key={3} src="https://picsum.photos/300/200" alt="" />,
    <img key={4} src="https://picsum.photos/300/200" alt="" />,
    <img key={5} src="https://picsum.photos/300/200" alt="" />,
  ];

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Events</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => {}}
        >
          New Event
        </Button>
      </Stack>
      <Grid container spacing={2}>
        <Grid item xs={2} />
        <Grid item xs={8}>
          <Carousel
            autoPlay
            animation="slide"
            navButtonsAlwaysVisible
            timeout={500}
            centered
            visibleSlides={1}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '30%',
            }}
          >
            {items.map((item, i) => (
              <div
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                key={i}
              >
                {item}
              </div>
            ))}
          </Carousel>
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={12}>
          <h1>thông tin chi tiết</h1>
        </Grid>
      </Grid>
    </Container>
  );
}
