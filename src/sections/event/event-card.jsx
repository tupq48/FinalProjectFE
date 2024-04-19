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
  const renderStatus = (
    <Label
      variant="filled"
      color={
        (event.status === 'completed' && 'error') ||
        (event.status === 'ongoing' && 'info') ||
        (event.status === 'upcoming' && 'warning') // Bổ sung trạng thái 'upcoming' với màu 'warning'
      }
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {event.status}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={event.name}
      src={event.cover}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  //   const renderPrice = (
  //     <Typography variant="subtitle1">
  //       <Typography
  //         component="span"
  //         variant="body1"
  //         sx={{
  //           color: 'text.disabled',
  //           textDecoration: 'line-through',
  //         }}
  //       >
  //         {product.priceSale && fCurrency(product.priceSale)}
  //       </Typography>
  //       &nbsp;
  //       {fCurrency(product.price)}
  //     </Typography>
  //   );

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {event.status && renderStatus}

        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link
          href={`/event/${event.id}`}
          color="inherit"
          underline="hover"
          variant="subtitle2"
          noWrap
        >
          {event.name}
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <div style={italicTextStyle}>{format(event.startTime, 'dd/MM/yyyy')}</div>
          <div style={italicTextStyle}>to</div>
          <div style={italicTextStyle}>{format(event.endTime, 'dd/MM/yyyy')}</div>
        </Stack>
      </Stack>
    </Card>
  );
}

EventCard.propTypes = {
  event: PropTypes.object,
};

const italicTextStyle = {
  fontStyle: 'italic',
};
