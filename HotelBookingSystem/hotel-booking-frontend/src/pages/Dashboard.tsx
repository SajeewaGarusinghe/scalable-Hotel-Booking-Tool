import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import {
  Hotel as HotelIcon,
  BookOnline as BookingIcon,
  People as PeopleIcon,
  Assessment as AnalyticsIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { RoomService } from '../services/roomService';
import { BookingService } from '../services/bookingService';
import { CustomerService } from '../services/customerService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Fetch summary data
  const { data: rooms = [] } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => RoomService.getAllRooms(),
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => BookingService.getBookings(),
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => CustomerService.getCustomers(),
  });

  const activeRooms = rooms.filter((room: any) => room.isActive).length;
  const totalRevenue = bookings.reduce((sum: number, booking: any) => 
    sum + (booking.totalAmount || 0), 0
  );
  const recentBookings = bookings.slice(0, 5);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, mt: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Welcome to Hotel Booking System
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your hotel operations efficiently with our comprehensive booking system.
        </Typography>
      </Paper>

      {/* Quick Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 3 }}>
        <Card sx={{ cursor: 'pointer' }} onClick={() => navigate('/rooms')}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <HotelIcon color="primary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {activeRooms}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Rooms
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ cursor: 'pointer' }} onClick={() => navigate('/bookings')}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <BookingIcon color="success" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {bookings.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Bookings
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ cursor: 'pointer' }} onClick={() => navigate('/customers')}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <PeopleIcon color="info" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {customers.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Customers
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ cursor: 'pointer' }} onClick={() => navigate('/analytics')}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <AnalyticsIcon color="warning" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  ${totalRevenue.toFixed(0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Revenue
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Recent Bookings */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" gutterBottom>
                Recent Bookings
              </Typography>
              <Button size="small" onClick={() => navigate('/bookings')}>
                View All
              </Button>
            </Box>
            <Stack spacing={1}>
              {recentBookings.length > 0 ? (
                recentBookings.map((booking: any, index) => (
                  <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Booking #{booking.bookingReference || booking.bookingId?.slice(0, 8)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip 
                      label={booking.bookingStatus || 'Confirmed'} 
                      size="small" 
                      color="success"
                    />
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recent bookings
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Stack spacing={2}>
              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<BookingIcon />}
                onClick={() => navigate('/bookings')}
              >
                New Booking
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<HotelIcon />}
                onClick={() => navigate('/rooms')}
              >
                Manage Rooms
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<PeopleIcon />}
                onClick={() => navigate('/customers')}
              >
                Add Customer
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<AnalyticsIcon />}
                onClick={() => navigate('/analytics')}
              >
                View Reports
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
