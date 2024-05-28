import { useState, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';
import { toast, ToastContainer } from 'react-toastify';
import { Navigate, useParams, useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';

import { deleteEvent, updateEvent, getEventInfoById } from 'src/_mock/events';
import {
  registrationEvent,
  cancelRegistration,
  isUserRegisteredEvent,
} from 'src/_mock/registrations';

import Iconify from 'src/components/iconify';

import { isAdmin } from 'src/sections/urlAPI';

import EventPopup from '../add-event';
import RegistersManagePopup from '../RegistersManage';

export default function EventDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    point: 0,
    maxAttenders: 0,
    eventName: '',
    location: '',
    description: '',
    startTime: null,
    endTime: null,
    imageUrls: [],
  });
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [isClickButton, setIsClickButton] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogManageRegister, setOpenDialogManageRegister] = useState(false);

  useEffect(() => {
    fetchData(id);
  }, [id]);

  const fetchData = async (eventId) => {
    try {
      setLoading(true);
      const [fetchedData, isRegistered] = await Promise.all([
        getEventInfoById(eventId),
        isUserRegisteredEvent(eventId),
      ]);
      setData(fetchedData);
      setIsUserRegistered(isRegistered);
    } catch (error) {
      console.error('Error fetching events in event view:', error);
    } finally {
      setLoading(false);
    }
  };

  if (Number.isNaN(Number(id))) {
    return <Navigate to="/404" replace />;
  }

  const handleRegistrationEvent = () => {
    if (isClickButton) return;
    setIsClickButton(true);
    toast
      .promise(registrationEvent(id), {
        pending: 'Đang xử lý...',
        success: 'Đăng ký thành công!',
        error: 'Đã xảy ra lỗi khi đăng ký sự kiện!',
      })
      .then(() => {
        setIsUserRegistered(true);
      })
      .finally(() => {
        setIsClickButton(false);
      });
  };
  const renderRegisterEventButton = () => (
    <Button
      variant="contained"
      color="success"
      startIcon={<Iconify icon="eva:plus-fill" />}
      onClick={() => handleRegistrationEvent()}
    >
      Register Event
    </Button>
  );

  const handleCancelRegistration = () => {
    if (isClickButton) return;
    setIsClickButton(true);
    toast
      .promise(cancelRegistration(id), {
        pending: 'Đang xử lý...',
        success: 'Hủy thành công!',
        error: 'Đã xảy ra lỗi khi hủy sự kiện!',
      })
      .then(() => {
        setIsUserRegistered(false);
      })
      .finally(() => {
        setIsClickButton(false);
      });
  };

  const renderCancelRegistrationButton = () => (
    <Button
      variant="contained"
      color="secondary"
      startIcon={<Iconify icon="" />}
      onClick={() => handleCancelRegistration()}
    >
      Cancel Registration
    </Button>
  );

  const handleEditEvent = async (form) => {
    form.append('eventId', id);
    toast
      .promise(updateEvent(form), {
        pending: 'Đang xử lý...',
        success: 'Sự kiện đã được sửa đổi thành công!',
        error: 'Đã xảy ra lỗi khi sửa đổi sự kiện!',
      })
      .then(() => {
        fetchData(id);
      });
  };

  const renderEditEventButton = () => (
    <Button
      variant="contained"
      color="secondary"
      startIcon={<Iconify icon="" />}
      onClick={() => setOpenDialog(true)}
    >
      Edit Event
    </Button>
  );
  const renderListRegistrantsButton = () => (
    <Button
      variant="contained"
      color="secondary"
      startIcon={<Iconify icon="" />}
      onClick={() => setOpenDialogManageRegister(true)}
    >
      List Registrants
    </Button>
  );

  const handleDeleteEvent = async () => {
    if (isClickButton) return;
    setIsClickButton(true);
    toast
      .promise(deleteEvent(id), {
        pending: 'Đang xử lý...',
        success: 'Xóa sự kiện thành công!',
        error: 'Đã xảy ra lỗi khi xóa sự kiện!',
      })
      .finally(() => {
        setIsClickButton(false);
        setTimeout(() => {
          navigate('/admin/event', { replace: true });
        }, 2000);
      });
  };

  const renderDeleteEventButton = () => (
    <Button
      variant="contained"
      color="error"
      startIcon={<Iconify icon="" />}
      onClick={() => {
        handleDeleteEvent(id);
      }}
    >
      Delete Event
    </Button>
  );

  const renderEventActionButton = () => {
    if (isAdmin()) {
      return renderEditEventButton();
    }

    if (isUserRegistered) {
      return renderCancelRegistrationButton();
    }

    return renderRegisterEventButton();
  };
  const renderListRegistrantsActionButton = () => {
    if (isAdmin()) {
      return renderListRegistrantsButton();
    }
    return  '';
  }


  const renderPage = () => (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">{data.eventName}</Typography>
        <Stack direction="row" spacing={2}>
          {renderEventActionButton()}
          {renderListRegistrantsActionButton()}
        </Stack>
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
            {data.imageUrls.map((url, index) => (
              <div
                key={index}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <img
                  src={url}
                  alt=""
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                />
              </div>
            ))}
          </Carousel>
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={12}>
          <Typography variant="h6" component="b">
            Point:
          </Typography>{' '}
          {data.point}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" component="b">
            Max Attenders:
          </Typography>{' '}
          {data.maxAttenders}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" component="b">
            Starts:
          </Typography>{' '}
          {data.startTime}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" component="b">
            Ends:
          </Typography>{' '}
          {data.endTime}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" component="b">
            Location:
          </Typography>{' '}
          {data.location}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" component="b">
            Description:
          </Typography>{' '}
          {data.description}
        </Grid>
      </Grid>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4"> </Typography>
        {isAdmin() ? renderDeleteEventButton() : ''}
      </Stack>
    </>
  );

  return (
    <Container>
      {loading && (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '70vh' }}>
          <CircularProgress size={100} />
        </Grid>
      )}
      {loading === false && renderPage()}
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

      <EventPopup
        isOpen={openDialog}
        label="Edit event"
        initialValues={data}
        onClose={() => setOpenDialog(false)}
        onSubmitEvent={handleEditEvent}
      />
      <RegistersManagePopup
        isOpen={openDialogManageRegister}
        label="Manage Register"
        initialValues={data}
        onClose={() => setOpenDialogManageRegister(false)}
        onSubmitEvent={handleEditEvent}
      />
    </Container>
  );
}
