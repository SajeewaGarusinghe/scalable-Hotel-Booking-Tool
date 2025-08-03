import React from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Paper 
} from '@mui/material';

interface LoadingProps {
  message?: string;
  size?: number;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  size = 40,
  fullScreen = false 
}) => {
  const containerStyles = fullScreen 
    ? {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999,
      }
    : {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
      };

  return (
    <Box sx={containerStyles}>
      <CircularProgress size={size} />
      <Typography variant="body1" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
