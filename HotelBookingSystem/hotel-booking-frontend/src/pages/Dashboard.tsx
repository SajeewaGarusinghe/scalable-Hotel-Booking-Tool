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
  CircularProgress,
  Alert,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tooltip,
} from '@mui/material';
import {
  KingBed,
  EventAvailable,
  People,
  TrendingUp,
  ArrowForward,
  Notifications,
  Add,
  Refresh,
  AssessmentOutlined,
  DateRange,
  Person,
  AttachMoney,
  HotelOutlined,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const { dashboardStats, quickStats, revenueTrend, occupancyTrend, loading, error, refetch } = useDashboard();

  // Define dashboard stats with real data
  const stats = [
    {
      title: 'Total Rooms',
      value: quickStats?.totalRooms.toString() || '0',
      icon: <KingBed sx={{ fontSize: 32, color: 'primary.main' }} />,
      color: '#E3F2FD',
    },
    {
      title: 'Occupied Rooms',
      value: quickStats ? (quickStats.totalRooms - quickStats.availableRooms).toString() : '0',
      icon: <EventAvailable sx={{ fontSize: 32, color: 'success.main' }} />,
      color: '#E8F5E9',
    },
    {
      title: 'Total Guests',
      value: quickStats?.totalGuests.toString() || '0',
      icon: <People sx={{ fontSize: 32, color: 'secondary.main' }} />,
      color: '#F3E5F5',
    },
    {
      title: 'Revenue (Month)',
      value: quickStats ? `$${quickStats.totalRevenue.toLocaleString()}` : '$0',
      icon: <TrendingUp sx={{ fontSize: 32, color: 'warning.main' }} />,
      color: '#FFF3E0',
    },
  ];

  // Use real recent activities or fallback to empty array
  const recentActivities = dashboardStats?.recentActivities || [];
  
  // Use real upcoming bookings or fallback to empty array
  const upcomingBookings = dashboardStats?.upcomingBookings || [];

  // Format date for display
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
        <Box sx={{ 
          position: 'relative', 
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Welcome back, {user?.name || 'Admin'}!
            </Typography>
            <Typography variant="body1" color="rgba(255,255,255,0.85)">
              Here's a summary of your hotel's performance.
            </Typography>
          </Box>
          {!loading && (
            <Button 
              onClick={refetch} 
              startIcon={<Refresh />}
              variant="contained"
              color="secondary"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                }
              }}
            >
              Refresh Data
            </Button>
          )}
        </Box>
      </Paper>

      {/* Error Message */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={refetch}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {!loading && stats.map((stat, index) => (
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
      
      {/* Charts */}
      {!loading && (
        <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
          {/* Revenue Trend Chart */}
          <Paper 
            elevation={2}
            sx={{ 
              p: 3, 
              borderRadius: 4,
              flex: { xs: '1 1 100%', lg: '1 1 50%' },
              height: { xs: 300, md: 350 }
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Revenue Trend
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart 
                data={revenueTrend}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(value: number) => `$${value}`}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <RechartsTooltip 
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                  labelFormatter={(label: string) => `Date: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={theme.palette.primary.main}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>

          {/* Occupancy Rate Chart */}
          <Paper 
            elevation={2}
            sx={{ 
              p: 3, 
              borderRadius: 4,
              flex: { xs: '1 1 100%', lg: '1 1 50%' },
              height: { xs: 300, md: 350 }
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Occupancy Rate
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart 
                data={occupancyTrend.slice(-14)} // Show only last 14 days
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(value: number) => `${value}%`}
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                  tickLine={false}
                />
                <RechartsTooltip 
                  formatter={(value: any) => [`${value.toFixed(1)}%`, 'Occupancy']}
                  labelFormatter={(label: string) => `Date: ${label}`}
                />
                <Bar 
                  dataKey="value" 
                  fill={theme.palette.secondary.main}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      )}

      {/* Main Content Area - First Row */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 4 }}>
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
              onClick={() => window.open('http://localhost:3000/bookings', '_blank')}
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
            <Button 
              variant="outlined" 
              startIcon={<TrendingUp />} 
              onClick={() => navigate('/analytics')}
              sx={{ justifyContent: 'flex-start', py: 1.5 }}
            >
              Analytics
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<AssessmentOutlined />} 
              onClick={() => navigate('/reports')}
              sx={{ justifyContent: 'flex-start', py: 1.5 }}
            >
              Reports
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

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={30} />
            </Box>
          ) : recentActivities.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No recent activities to display.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {recentActivities.map((activity, index) => (
                <Box 
                  key={index} 
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
                      {activity.activityType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activity.description}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Paper>
      </Box>
      
      {/* Main Content Area - Second Row with Upcoming Bookings */}
      {!loading && upcomingBookings.length > 0 && (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            borderRadius: 4,
            mb: 4
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Upcoming Bookings
            </Typography>
            <Button 
              size="small" 
              endIcon={<ArrowForward />}
              onClick={() => navigate('/bookings')}
            >
              View All Bookings
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flexWrap: 'wrap', gap: 3 }}>
            {upcomingBookings.map((booking, index) => (
              <Paper
                key={booking.bookingId}
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  flex: { xs: '1 1 100%', md: '1 1 calc(50% - 1.5rem)', lg: '1 1 calc(33.333% - 2rem)' },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {booking.customerName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Room {booking.roomNumber}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DateRange fontSize="small" color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Check-in
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(booking.checkInDate)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DateRange fontSize="small" color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Check-out
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(booking.checkOutDate)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    icon={<Person sx={{ fontSize: '1rem !important' }} />} 
                    label={`${booking.numberOfGuests} Guest${booking.numberOfGuests > 1 ? 's' : ''}`}
                    size="small"
                    sx={{ borderRadius: 1 }}
                  />
                  
                  {booking.totalAmount > 0 && (
                    <Typography variant="body2" fontWeight="medium">
                      ${booking.totalAmount.toLocaleString()}
                    </Typography>
                  )}
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Dashboard;
