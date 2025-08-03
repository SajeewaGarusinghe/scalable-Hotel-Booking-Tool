import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
} from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Welcome to Hotel Booking System
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This is your dashboard where you can manage rooms, bookings, customers, and view analytics.
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Typography variant="body2">
              Statistics will be displayed here once data is loaded.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2">
              Recent bookings and activities will be shown here.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
