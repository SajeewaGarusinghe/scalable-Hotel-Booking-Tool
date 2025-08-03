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
} from '@mui/material';
import { Hotel } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthService } from '../../services/authService';
import { Loading } from '../common/Loading';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mockEmail, setMockEmail] = useState('john.doe@example.com');
  const [mockName, setMockName] = useState('John Doe');

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
    return <Loading message="Signing in..." fullScreen />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          maxWidth: 400,
          width: '100%',
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box textAlign="center" mb={3}>
          <Hotel sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Hotel Booking
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome! Please sign in to continue.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Mock Login
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter any email and name to simulate authentication
            </Typography>
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={mockEmail}
              onChange={(e) => setMockEmail(e.target.value)}
              sx={{ mb: 2 }}
              variant="outlined"
            />
            
            <TextField
              fullWidth
              label="Name"
              value={mockName}
              onChange={(e) => setMockName(e.target.value)}
              sx={{ mb: 2 }}
              variant="outlined"
            />
            
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleMockLogin}
              disabled={loading || !mockEmail || !mockName}
              sx={{
                py: 1.5,
                textTransform: 'none',
                fontSize: '1.1rem',
              }}
            >
              Sign In
            </Button>
          </CardContent>
        </Card>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          This is a mock authentication system for development purposes.
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;