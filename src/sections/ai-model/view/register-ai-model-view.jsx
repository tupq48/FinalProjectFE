import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box, Modal } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularProgress from '@mui/material/CircularProgress'; // Thêm CircularProgress

import Iconify from 'src/components/iconify';

import CustomImageList from './CustomImageList';
import {
  testModel,
  trainModel,
  deleteImage,
  isModelExist,
  isTrainningModel,
  uploadImageTrain,
  getTrainningImage,
} from '../api/ai-model-api';

export default function RegisterAiModelView() {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isTrainning, setIsTrainning] = useState(false);
  const [hasModel, setHasModel] = useState(false);
  const [listImage, setListImage] = useState([]);
  const [isClicking, setIsClicking] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const trainningModel = await isTrainningModel();
      const isTrained = await isModelExist();
      setIsTrainning(trainningModel);
      setIsOpenPopup(trainningModel);
      setHasModel(isTrained);

      const listImageFetched = await getTrainningImage();
      setListImage(listImageFetched);
    } catch (error) {
      console.error('Error fetching data in ai model view:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (isClicking) return;

    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setIsClicking(true);
    toast
      .promise(uploadImageTrain(files), {
        pending: 'Đang xử lý...',
        success: 'Upload ảnh thành công!',
        error: 'Đã xảy ra lỗi khi upload hình ảnh!',
      })
      .then((newImages) => {
        setListImage((prevImages) => [...prevImages, ...newImages]);
      })
      .finally(() => {
        setIsClicking(false);
      });
  };

  const handleTestModel = (e) => {
    if (isClicking) return;

    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setIsClicking(true);
    toast
      .promise(testModel(files), {
        pending: 'Đang xử lý...',
        success: 'Model nhận diện thành công!',
        error: 'Model không thể nhận diện được bạn trong ảnh!',
      })
      .finally(() => {
        setIsClicking(false);
      });
  };

  const renderPopup = () => (
    <Modal
      open={isOpenPopup}
      onClose={() => {
        setIsOpenPopup(false);
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          minWidth: '400px',
          minHeight: '200px',
        }}
      >
        {isTrainningModel && 'đang trainning model cho mày, đợi đi'}
      </div>
    </Modal>
  );

  const renderButton = () => {
    if (isTrainning) {
      return renderButtonDetail('Your model is trainning', null, 'secondary');
    }
    if (!hasModel) {
      return renderButtonDetail('Start train model', handleStartTrainModel, 'secondary');
    }

    if (hasModel) {
      return renderButtonDetail('Retrain model', handleStartTrainModel, 'secondary');
    }
    return null;
  };

  const handleStartTrainModel = async () => {
    if (listImage.length < 5) {
      toast.error('You need at least 5 images to start training the model.');
      return;
    }
    if (isClicking) return;
    setIsClicking(true);
    toast
      .promise(trainModel(), {
        pending: 'Đang tiến hành xây dựng model...',
        success: 'Xây dựng model thành công!',
        error: 'Đã xảy ra lỗi trong quá trình xây dựng model!',
      })
      .then(() => {
        setHasModel(true);
      })
      .finally(() => {
        setIsClicking(false);
      });
  };

  const handleDeleteImage = async (imageUrls) => {
    if (isClicking) return;

    setIsClicking(true);
    toast
      .promise(deleteImage(imageUrls), {
        pending: 'Đang xử lý...',
        success: 'Xóa ảnh thành công!',
        error: 'Đã xảy ra lỗi khi xóa hình ảnh!',
      })
      .then(() => {
        setListImage((prevImages) => prevImages.filter((url) => !imageUrls.includes(url)));
      })
      .finally(() => {
        setIsClicking(false);
      });
  };

  const renderButtonDetail = (message, onClick, color) => (
    <Button variant="contained" color={color} startIcon={<Iconify icon="" />} onClick={onClick}>
      {message}
    </Button>
  );

  const renderListUploadedImages = () =>
    CustomImageList({ imageUrls: listImage, handleDeleteImage });

  const renderFormUploadImage = () => (
    <Box
      sx={{
        border: '2px dashed #90CAF9',
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center',
        width: '300px',
        margin: '20px auto',
      }}
    >
      <CloudUploadIcon sx={{ fontSize: '48px', color: '#90CAF9' }} />
      <Typography variant="h6" gutterBottom>
      Drag and drop the file here      
      </Typography>
      <Typography variant="body1" color="textSecondary">
        or
      </Typography>
      <Button
        variant="contained"
        component="label"
        sx={{ marginTop: '8px', marginBottom: '16px' }}
        disabled={isClicking}
      >
        Upload
        <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
      </Button>
    </Box>
  );

  const renderButtonCheckModel = () => {
    if (hasModel)
      return (
        <Button
          variant="contained"
          component="label"
          sx={{ marginTop: '8px', marginBottom: '16px' }}
          disabled={isClicking}
          style={{
            marginLeft: 'auto',
            marginRight: '0',
          }}
        >
          Test your detect face
          <input type="file" hidden accept="image/*" onChange={handleTestModel} />
        </Button>
      );
    return '';
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Identification</Typography>
        {renderButton()}
      </Stack>
      {loading ? (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '70vh' }}>
          <CircularProgress size={100} />
        </Grid>
      ) : (
        <>
          {renderPopup()}
          {renderFormUploadImage()}
          {renderListUploadedImages()}
          {renderButtonCheckModel()}
        </>
      )}

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
    </Container>
  );
}
