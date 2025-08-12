import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  Card,
  CardContent,
  Container,
  alpha,
  useTheme,
  IconButton,
  InputAdornment,
  Fade,
  Stack,
} from '@mui/material';
import { 
  Hotel, 
  Visibility, 
  VisibilityOff, 
  Login,
  Security,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthService } from '../../services/authService';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mockEmail, setMockEmail] = useState('john.doe@example.com');
  const [mockName, setMockName] = useState('John Doe');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state?.from?.pathname && location.state.from.pathname !== '/login') 
        ? location.state.from.pathname 
        : '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleMockLogin = async () => {
    if (!mockEmail || !mockName) {
      setError('Please enter email and name for mock login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await AuthService.mockLogin(mockEmail, mockName);
      
      // Handle both upper and lower case response properties
      const responseAny = response as any;
      const token = response.Token || responseAny.token;
      const user = response.User || responseAny.user;
      
      if (!token || !user) {
        throw new Error('Invalid response: missing token or user data');
      }
      
      // Call login to update context
      login(token, user);
      
      // Wait a bit for state to update, then navigate
      setTimeout(() => {
        const from = (location.state?.from?.pathname && location.state.from.pathname !== '/login') 
          ? location.state.from.pathname 
          : '/dashboard';
        navigate(from, { replace: true });
      }, 100);
      
    } catch (err: any) {
      if (err.response) {
        setError(`Server error: ${err.response.status} - ${err.response.data?.error || err.response.statusText}`);
      } else if (err.request) {
        setError('Network error: Unable to connect to server. Please check your internet connection and try again.');
      } else {
        setError(err instanceof Error ? err.message : 'Mock login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Signing in..." fullScreen />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          zIndex: 1,
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr' },
            gap: { xs: 4, md: 8 },
            alignItems: 'center',
            minHeight: '80vh',
          }}
        >
          {/* Left Side - Branding */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4,
              color: 'white',
              textAlign: 'center'
            }}
          >
            <Fade in={true} timeout={1000}>
              <Box>
                <Hotel sx={{ fontSize: { xs: 80, md: 120 }, mb: 3, opacity: 0.9 }} />
                <Typography 
                  variant="h2" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    mb: 2,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Hotel Booking
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 400,
                    opacity: 0.9,
                    mb: 4,
                    maxWidth: 400,
                    fontSize: { xs: '1.2rem', md: '1.5rem' }
                  }}
                >
                  Professional Management System
                </Typography>
                
                <Stack direction="column" spacing={2} sx={{ maxWidth: 400 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircle sx={{ color: 'success.light' }} />
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Streamlined booking management
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircle sx={{ color: 'success.light' }} />
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Real-time analytics and reporting
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircle sx={{ color: 'success.light' }} />
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Customer relationship management
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Fade>
          </Box>

          {/* Right Side - Login Form */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4
            }}
          >
            <Fade in={true} timeout={1200}>
              <Paper
                elevation={24}
                sx={{
                  width: '100%',
                  maxWidth: 420,
                  p: 4,
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: alpha(theme.palette.common.white, 0.2),
                }}
              >
                <Box textAlign="center" mb={4}>
                  <Security 
                    sx={{ 
                      fontSize: 48, 
                      color: 'primary.main', 
                      mb: 2,
                      p: 1.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      borderRadius: '50%'
                    }} 
                  />
                  <Typography 
                    variant="h4" 
                    component="h2" 
                    sx={{ 
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 1
                    }}
                  >
                    Welcome Back
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign in to access your dashboard
                  </Typography>
                </Box>

                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        fontSize: 20
                      }
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <Card 
                  sx={{ 
                    mb: 3,
                    border: '1px solid',
                    borderColor: 'grey.200',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box
                        sx={{
                          p: 1,
                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                          borderRadius: 2,
                        }}
                      >
                        <Security sx={{ fontSize: 20, color: 'warning.main' }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Demo Access
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Development environment login
                        </Typography>
                      </Box>
                    </Box>
                    
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={mockEmail}
                      onChange={(e) => setMockEmail(e.target.value)}
                      sx={{ mb: 3 }}
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 2 }
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={mockName}
                      onChange={(e) => setMockName(e.target.value)}
                      sx={{ mb: 3 }}
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 2 },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleMockLogin}
                      disabled={loading || !mockEmail || !mockName}
                      startIcon={<Login />}
                      sx={{
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                        '&:hover': {
                          boxShadow: '0 6px 16px rgba(37, 99, 235, 0.4)',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      Sign In to Dashboard
                    </Button>
                  </CardContent>
                </Card>

                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  textAlign="center"
                  sx={{ 
                    opacity: 0.8,
                    fontSize: '0.875rem'
                  }}
                >
                  This is a demo authentication system for development purposes.
                </Typography>
              </Paper>
            </Fade>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;