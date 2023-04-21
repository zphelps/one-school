import React, {FC, useState} from "react";
import { Box, IconButton, Typography, Paper } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface ImageCarouselProps {
    images: string[];
}
const ImageCarousel: FC<ImageCarouselProps> = ( props ) => {
    const { images } = props;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: '400px',
                margin: '0 auto',
                px:1.5,
                mt: 2,
            }}
        >
            <Paper
                variant="outlined"
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '400px',
                }}
            >
                <img
                    src={images[currentImageIndex]}
                    alt={`carousel-image-${currentImageIndex}`}
                    style={{ width: '100%', height: '400px', maxHeight: '100%', objectFit: 'cover', borderRadius: '10px' }}
                />
            </Paper>
            {currentImageIndex !== 0 && <IconButton
                onClick={handlePrevImage}
                sx={{
                    position: "absolute",
                    left: 20,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0, 0, 0, 0.4)",
                    color: "white",
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                    },
                }}
            >
                <ChevronLeft/>
            </IconButton>}
            {currentImageIndex !== images.length - 1 && <IconButton
                onClick={handleNextImage}
                sx={{
                    position: "absolute",
                    right: 20,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0, 0, 0, 0.4)",
                    color: "white",
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                    },
                }}
            >
                <ChevronRight/>
            </IconButton>}
        </Box>
    );
};

export default ImageCarousel;
