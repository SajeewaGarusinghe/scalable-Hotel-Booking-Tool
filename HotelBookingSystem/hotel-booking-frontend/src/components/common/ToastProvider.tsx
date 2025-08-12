import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Snackbar, 
  Alert, 
  AlertTitle, 
  Slide, 
  IconButton,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  maxToasts = 3 
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = generateId();
    const newToast: Toast = {
      id,
      duration: 6000,
      ...toast,
    };

    setToasts(prev => {
      const updated = [...prev, newToast];
      return updated.slice(-maxToasts);
    });

    // Auto-dismiss non-persistent toasts
    if (!newToast.persistent && newToast.duration) {
      setTimeout(() => {
        dismissToast(id);
      }, newToast.duration);
    }
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message: string, title?: string) => {
    addToast({ type: 'success', message, title });
  };

  const showError = (message: string, title?: string) => {
    addToast({ type: 'error', message, title, persistent: true });
  };

  const showWarning = (message: string, title?: string) => {
    addToast({ type: 'warning', message, title });
  };

  const showInfo = (message: string, title?: string) => {
    addToast({ type: 'info', message, title });
  };

  const contextValue: ToastContextType = {
    showToast: addToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Toast Container */}
      <Box
        sx={{
          position: 'fixed',
          top: 88,
          right: 16,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxWidth: 400,
        }}
      >
        {toasts.map((toast, index) => (
          <Slide
            key={toast.id}
            direction="left"
            in={true}
            timeout={300}
            style={{
              transitionDelay: `${index * 100}ms`,
            }}
          >
            <Alert
              severity={toast.type}
              variant="filled"
              onClose={() => dismissToast(toast.id)}
              action={
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={() => dismissToast(toast.id)}
                >
                  <Close fontSize="small" />
                </IconButton>
              }
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                backdropFilter: 'blur(10px)',
                '& .MuiAlert-icon': {
                  fontSize: 20,
                },
                '& .MuiAlert-action': {
                  padding: 0,
                  marginRight: -1,
                },
              }}
            >
              {toast.title && (
                <AlertTitle sx={{ fontWeight: 600 }}>
                  {toast.title}
                </AlertTitle>
              )}
              {toast.message}
            </Alert>
          </Slide>
        ))}
      </Box>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
