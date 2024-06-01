import axios from 'axios';

import urlBEAPI from 'src/sections/urlAPI';

// ----------------------------------------------------------------------


const isTrainningModel = async () => {
  try {
    const url = `${urlBEAPI}/api/ai-model/isTraining`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    return response.data; 
  } catch (error) {
    console.error('Có lỗi xảy ra:', error);
    return false;
  }
};

const isModelExist = async () => {
  try {
    const url = `${urlBEAPI}/api/ai-model/isModelExist`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    return response.data; 
  } catch (error) {
    console.error('Có lỗi xảy ra:', error);
    return false;
  }
};

const getTrainningImage = async () => {
  try {
    const url = `${urlBEAPI}/api/ai-model/imagesTrain`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    const urls = response.data.map(item => item.urlImage);
    console.log(urls);
    return urls; 
  } catch (error) {
    console.error('Có lỗi xảy ra:', error);
    return false;
  }
};


const uploadImageTrain = async (files) => {
  console.log(files);

  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });

  try {
    const response = await axios.post(`${urlBEAPI}/api/ai-model/uploadImage`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (response.status === 200) {
      const uploadedUrls = response.data; 
      console.log(uploadedUrls);
      return uploadedUrls;
    }
    return [];
  } catch (error) {
    console.error('Có lỗi xảy ra:', error);
    return [];
  }
};

const deleteImage = async (imageUrls) => {
  try {
    const formData = new FormData();
    imageUrls.forEach((url, index) => {
        formData.append('images', url);
    });
    const response = await axios.post(`${urlBEAPI}/api/ai-model/deleteImage`, formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        }
    });

    if (response.status === 200) {
      return response.data;
    }
    return false;
  } catch (error) {
    console.error('Có lỗi xảy ra:', error);
    return false;
  }
};

const trainModel = async () => {
  try {
    const response = await axios.post(`${urlBEAPI}/api/ai-model/trainModel`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Có lỗi xảy ra:', error);
    return false;
  }
}
export { trainModel, deleteImage, isModelExist, uploadImageTrain, isTrainningModel, getTrainningImage };