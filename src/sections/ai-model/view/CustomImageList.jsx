import * as React from 'react';
import PropTypes from 'prop-types';

import ImageList from '@mui/material/ImageList';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

function srcset(image, width, height, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${width * cols}&h=${height * rows
            }&fit=crop&auto=format&dpr=2 2x`,
    };
}

export default function CustomImageList({ imageUrls, handleDeleteImage }) {
    if (!Array.isArray(imageUrls)) {
        console.error("imageUrls is not an array:", imageUrls);
        return null;
    }

    if (imageUrls.length === 0)
        return null;
    return (
        <ImageList
            sx={{
                width: '80%',
                height: '80vh', 
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto',
                transform: 'translateZ(0)',
            }}
            gap={1}
            style={{marginTop: "20px"}}
        >
            {imageUrls.map((url) => {
                const a = [];
                a[0] = 1;
                return (
                    <ImageListItem key={url}>
                        <img
                            {...srcset(url, 250, 200, 1, 1)}
                            alt=''
                            loading="lazy"
                        />
                        <ImageListItemBar
                            sx={{
                                background:
                                    'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                    'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                            }}
                            position="top"
                            actionIcon={
                                <IconButton
                                    onClick={() => handleDeleteImage([url])}
                                    sx={{ color: 'white' }}
                                //   aria-label='star'
                                >
                                    <ClearIcon/>
                                </IconButton>
                            }
                            actionPosition="left"
                        />
                    </ImageListItem>
                );
            })}
        </ImageList>
    );
}

CustomImageList.propTypes = {
    imageUrls: PropTypes.object,
    handleDeleteImage: PropTypes.func
};

