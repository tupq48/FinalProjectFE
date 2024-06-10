import PropTypes from 'prop-types';
import 'react-medium-image-zoom/dist/styles.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Carousel from 'react-material-ui-carousel';
import { React, useState, useEffect } from 'react';

import { Grid, Container, CircularProgress } from '@mui/material';

import { getImagesUser } from 'src/_mock/events';

export default function ImageGallery({ eventId, UserId }) {
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImagesUser = async () => {
      try {
        setLoading(true)
        const fetchedImages = await getImagesUser(UserId, eventId);
        let urls;
        if (fetchedImages) {
          urls= [fetchedImages[0].uploadImageUrl, fetchedImages[0].trainImageUrl];
      } else {
          console.log("Không có hình ảnh được trả về từ API.");
      }
        setImageUrls(urls);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
         setLoading(false);
      }
    };
    fetchImagesUser();
  }, [eventId, UserId]);

  return (
    <Container>
      {loading && (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '70vh' }}>
          <CircularProgress size={100} />
        </Grid>
      )}
      <Carousel
        // autoPlay
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
        {imageUrls.map((url, index) => (
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
    </Container>


  );
};
ImageGallery.propTypes = {
  eventId: PropTypes.any,
  UserId: PropTypes.any,
}


