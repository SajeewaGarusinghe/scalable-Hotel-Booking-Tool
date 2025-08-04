import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  useTheme,
  alpha,
  Stack,
  Container,
} from '@mui/material';
import {
  KingBed,
  EventAvailable,
  People,
  TrendingUp,
  ArrowForward,
  Notifications,
  Add,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock data for demonstration
const stats = [
  {
    title: 'Total Rooms',
    value: '120',
    icon: <KingBed sx={{ fontSize: 32, color: 'primary.main' }} />,
    color: '#E3F2FD',
  },
  {
    title: 'Occupied Rooms',
    value: '85',
    icon: <EventAvailable sx={{ fontSize: 32, color: 'success.main' }} />,
    color: '#E8F5E9',
  },
  {
    title: 'Total Customers',
    value: '540',
    icon: <People sx={{ fontSize: 32, color: 'secondary.main' }} />,
    color: '#F3E5F5',
  },
  {
    title: 'Revenue (Month)',
    value: '$75,890',
    icon: <TrendingUp sx={{ fontSize: 32, color: 'warning.main' }} />,
    color: '#FFF3E0',
  },
];

const recentActivities = [
  {
    id: 1,
    type: 'New Booking',
    description: 'John Doe booked a Deluxe Room for 3 nights.',
    time: '15 mins ago',
  },
  {
    id: 2,
    type: 'Check-in',
    description: 'Jane Smith checked into Room 204.',
    time: '1 hour ago',
  },
  {
    id: 3,
    type: 'New Customer',
    description: 'Michael Johnson registered as a new customer.',
    time: '3 hours ago',
  },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.dark, 0.8)} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Welcome back, {user?.name || 'Admin'}!
          </Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.85)">
            Here's a summary of your hotel's performance.
          </Typography>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {stats.map((stat, index) => (
          <Paper 
            key={index}
            elevation={2} 
            sx={{ 
              p: 2.5, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              borderRadius: 4,
              flex: {
                xs: '1 1 100%',
                sm: '1 1 calc(50% - 1.5rem)',
                md: '1 1 calc(25% - 2.25rem)'
              },
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[6],
              }
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
              {stat.icon}
            </Avatar>
          </Paper>
        ))}
      </Box>

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Quick Actions */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            borderRadius: 4, 
            flex: { xs: '1 1 100%', md: '0 0 30%' },
            height: 'fit-content'
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Quick Actions
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              onClick={() => navigate('/bookings/new')}
              sx={{ justifyContent: 'flex-start', py: 1.5 }}
            >
              New Booking
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<People />} 
              onClick={() => navigate('/customers')}
              sx={{ justifyContent: 'flex-start', py: 1.5 }}
            >
              View Customers
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<KingBed />} 
              onClick={() => navigate('/rooms')}
              sx={{ justifyContent: 'flex-start', py: 1.5 }}
            >
              Manage Rooms
            </Button>
          </Stack>
        </Paper>

        {/* Recent Activity */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            borderRadius: 4, 
            flex: { xs: '1 1 100%', md: '1 1 70%' }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Recent Activity
            </Typography>
            <Button 
              size="small" 
              endIcon={<ArrowForward />}
              onClick={() => navigate('/bookings')}
            >
              View All
            </Button>
          </Box>
          <Stack spacing={2}>
            {recentActivities.map((activity) => (
              <Box 
                key={activity.id} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  py: 1.5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  '&:last-child': { borderBottom: 0 }
                }}
              >
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.light, 0.2) }}>
                  <Notifications fontSize="small" color="primary" />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {activity.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activity.description}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {activity.time}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
