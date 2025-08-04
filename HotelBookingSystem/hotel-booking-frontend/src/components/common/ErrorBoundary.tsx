import React, { Component, ReactNode } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper, 
  Stack,
  Alert,
  Collapse,
} from '@mui/material';
import { 
  ErrorOutline, 
  Refresh, 
  Home,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      showDetails: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="md">
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: 'center',
                maxWidth: 600,
                width: '100%',
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <ErrorOutline
                  sx={{
                    fontSize: 64,
                    color: 'error.main',
                    mr: 2,
                  }}
                />
              </Box>

              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 2,
                }}
              >
                Oops! Something went wrong
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                We apologize for the inconvenience. An unexpected error has occurred. 
                Please try refreshing the page or contact support if the problem persists.
              </Typography>

              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={this.handleRetry}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                  }}
                >
                  Try Again
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Home />}
                  onClick={this.handleGoHome}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                  }}
                >
                  Go to Dashboard
                </Button>
              </Stack>

              {(this.state.error || this.state.errorInfo) && (
                <Box sx={{ textAlign: 'left' }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={this.toggleDetails}
                    endIcon={this.state.showDetails ? <ExpandLess /> : <ExpandMore />}
                    sx={{
                      mb: 2,
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                    }}
                  >
                    {this.state.showDetails ? 'Hide' : 'Show'} Error Details
                  </Button>

                  <Collapse in={this.state.showDetails}>
                    <Alert
                      severity="error"
                      sx={{
                        textAlign: 'left',
                        borderRadius: 2,
                        '& .MuiAlert-message': {
                          width: '100%',
                        },
                      }}
                    >
                      <Typography variant="body2" component="div" sx={{ mb: 1 }}>
                        <strong>Error:</strong>
                      </Typography>
                      <Typography
                        variant="body2"
                        component="pre"
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          mb: 2,
                        }}
                      >
                        {this.state.error?.toString()}
                      </Typography>

                      {this.state.errorInfo && (
                        <>
                          <Typography variant="body2" component="div" sx={{ mb: 1 }}>
                            <strong>Stack Trace:</strong>
                          </Typography>
                          <Typography
                            variant="body2"
                            component="pre"
                            sx={{
                              fontFamily: 'monospace',
                              fontSize: '0.75rem',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                            }}
                          >
                            {this.state.errorInfo.componentStack}
                          </Typography>
                        </>
                      )}
                    </Alert>
                  </Collapse>
                </Box>
              )}

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 3, fontSize: '0.875rem' }}
              >
                Error ID: {Date.now().toString(36).toUpperCase()}
              </Typography>
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
