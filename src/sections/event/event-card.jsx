import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';

// import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
// import { ColorPreview } from 'src/components/color-utils';

import { format } from 'date-fns';
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
      console.log(`${event.startTime} - ${now}`);
    } else if (now > endTime) {
      statusColor = 'error';
      statusText = 'Completed';
      console.log(`${event.startTime} - ${statusText}`);
    } else {
      statusColor = 'info';
      statusText = 'Ongoing';
      console.log(`${event.startTime} - ${statusText}`);
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
        href={`/event/${event.eventId}`}
        color="inherit"
        underline="none"
        variant="subtitle2"
        noWrap
      >
        <Box sx={{ pt: '100%', position: 'relative' }}>
          {renderStatus()}

          {renderImg}
        </Box>

        <Stack spacing={2} sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="center">
            {event.eventName}
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
      </Link>
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
