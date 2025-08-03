import React from 'react';
import { 
  Alert, 
  AlertTitle, 
  Box, 
  Button, 
  Paper 
} from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface ErrorMessageProps {
  message: string;
  title?: string;
  onRetry?: () => void;
  variant?: 'filled' | 'outlined' | 'standard';
  severity?: 'error' | 'warning' | 'info' | 'success';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  title = 'Error',
  onRetry,
  variant = 'outlined',
  severity = 'error'
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Alert 
        severity={severity} 
        variant={variant}
        action={
          onRetry && (
            <Button
              color="inherit"
              size="small"
              onClick={onRetry}
              startIcon={<Refresh />}
            >
              Retry
            </Button>
          )
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;
