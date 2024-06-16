import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import { Modal, Button } from '@mui/material';

function DeleteEventPopup({ isOpen, onClose, onDeleteEvent, label }) {
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
          borderRadius: '10px',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>{label}</h2>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button variant="contained" color="error" onClick={onDeleteEvent}>
              Yes
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={onClose}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
}

DeleteEventPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDeleteEvent: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default DeleteEventPopup;
