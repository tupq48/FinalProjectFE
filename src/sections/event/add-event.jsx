import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import { Modal, Button, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function EventPopup({ isOpen, onClose, onSubmitEvent, initialValues, label }) {
  const [formData, setFormData] = useState(
    initialValues || {
      point: 0,
      maxAttenders: 0,
      eventName: '',
      location: '',
      description: '',
      startTime: null,
      endTime: null,
      imageUrls: [],
    }
  );

  useEffect(() => {
    if (initialValues != null && initialValues.startTime != null) {
      const formDataCopy = { ...initialValues };
      formDataCopy.startTime = dayjs(convertDateTimeStringToObject(initialValues.startTime));
      formDataCopy.endTime = dayjs(convertDateTimeStringToObject(initialValues.endTime));
      setFormData(formDataCopy);
    }
  }, [initialValues]);

  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function convertDateTimeStringToObject(dateTimeString) {
    const [time, date] = dateTimeString.split(' ');
    const [hours, minutes, seconds] = time.split(':');
    const [day, month, year] = date.split('-');
    const newDate = new Date(year, month - 1, day, hours, minutes, seconds);

    return newDate;
  }

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

  const handleSubmit = async () => {
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'startTime' || key === 'endTime') {
        value = formatDateTime(value);
      }
      form.append(key, value);
    });

    selectedImages.forEach((image, index) => {
      form.append(`images`, image);
    });

    try {
      const f = onSubmitEvent(form);
      onClose();
      await f;
    } catch (error) {
      console.error('Đã xảy ra lỗi khi đăng ký sự kiện:', error);
    }
  };

  const getImageLinkFromUrl = (url, index) => {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    return (
      <a style={{ margin: '0 10px' }} href={url} key={index}>
        {fileName}
      </a>
    );
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
          minWidth: '400px',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>{initialValues ? 'Chỉnh sửa thông tin' : label}</h2>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Tên sự kiện"
              variant="outlined"
              name="eventName"
              value={formData.eventName}
              onChange={(e) => handleChange('eventName', e.target.value)}
              InputLabelProps={{ style: { textAlign: 'center', lineHeight: '2' } }}
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Điểm"
              variant="outlined"
              type="number"
              name="point"
              value={formData.point}
              onChange={(e) => handleChange('point', e.target.value)}
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Số người tối đa"
              variant="outlined"
              name="maxAttenders"
              type="number"
              value={formData.maxAttenders}
              onChange={(e) =>
                handleChange('maxAttenders', Math.max(0, parseInt(e.target.value, 10 || 0)))
              }
              inputProps={{ min: 0 }}
              style={{ width: '100%' }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Địa điểm"
              variant="outlined"
              name="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              style={{ width: '100%' }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Mô tả"
              variant="outlined"
              name="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Thời gian bắt đầu"
                value={formData.startTime}
                onChange={(value) => handleChange('startTime', value)}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Thời gian kết thúc"
                value={formData.endTime}
                onChange={(value) => handleChange('endTime', value)}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="inherit" component="label">
              Upload Images
              <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
            </Button>
            {selectedImages.map((image, index) => (
              <span key={index}>{`   ${image.name}   `}</span>
            ))}

            {selectedImages.length === 0 &&
              formData.imageUrls.length > 0 &&
              formData.imageUrls.map((item, index) => getImageLinkFromUrl(item, index))}
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {initialValues ? 'Lưu' : 'Thêm'}
            </Button>
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
}

EventPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmitEvent: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  label: PropTypes.string.isRequired,
};

export default EventPopup;
