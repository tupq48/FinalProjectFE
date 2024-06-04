import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import Label from 'src/components/label';
// ----------------------------------------------------------------------

export default function EventCard({ event }) {
  const convertTime = (time) => {
    const [timeString, dateString] = time.split(' '); // Tách chuỗi thời gian và ngày
    const [hours, minutes, seconds] = timeString.split(':'); // Tách giờ, phút và giây
    const [day, month, year] = dateString.split('-'); // Tách ngày, tháng và năm
    const resultTime = new Date(year, month - 1, day, hours, minutes, seconds);
    return resultTime;
  };

  const renderStatus = () => {
    const now = new Date(); // Get the current time
    const startTime = convertTime(event.startTime);
    const endTime = convertTime(event.endTime);
    let statusColor = '';
    let statusText = '';

    if (now < startTime) {
      statusColor = 'warning';
      statusText = 'Upcoming';
    } else if (now > endTime) {
      statusColor = 'error';
      statusText = 'Completed';
    } else {
      statusColor = 'info';
      statusText = 'Ongoing';
    }

    return (
      <Label
        variant="filled"
        color={statusColor}
        sx={{
          zIndex: 9,
          top: 16,
          right: 16,
          position: 'absolute',
          textTransform: 'uppercase',
        }}
      >
        {statusText}
      </Label>
    );
  };

  const renderImg = (
    <Box
      component="img"
      alt={event.name}
      src={event.imageUrls[0]}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  return (
    <Card>
      <Link
        to={`/event/${event.eventId}`}
        style={{
          color: 'inherit', // Màu sẽ được kế thừa từ phần tử cha
          textDecoration: 'none', // Loại bỏ gạch chân cho link
          fontSize: '1rem', // Cỡ chữ
          whiteSpace: 'nowrap', // Không ngắt dòng
        }}
      >
        <Box sx={{ pt: '100%', position: 'relative' }}>
          {renderStatus()}

          {renderImg}
        </Box>
      </Link>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="center">
          {/* <span style={{ color: 'darkblue', fontWeight: 'bold' }}>{event.eventName}</span> */}
          <Tooltip title={event.eventName}>
          <span 
            style={{ 
              color: 'darkblue', 
              fontWeight: 'bold', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              maxWidth: '200px', // Điều chỉnh kích thước theo yêu cầu
              display: 'inline-block'
            }}
          >
            {event.eventName}
          </span>
        </Tooltip>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="center">
          <div style={{ ...timeStyle, fontWeight: 'bold' }}>
            {format(convertTime(event.startTime), 'MMMM dd yyyy')}
          </div>
          <div style={{ padding: '4px' }} />
          <div style={timeStyle}>{format(convertTime(event.startTime), 'hh:mm')}</div>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="center">
          <div style={{ ...timeStyle, fontWeight: 'bold' }}>
            {format(convertTime(event.endTime), 'MMMM dd yyyy')}
          </div>
          <div style={{ padding: '4px' }} />
          <div style={timeStyle}>{format(convertTime(event.endTime), 'hh:mm')}</div>
        </Stack>
      </Stack>
    </Card>
  );
}

EventCard.propTypes = {
  event: PropTypes.object,
};

const timeStyle = {
  fontStyle: 'italic',
  fontSize: 'smaller',
};
