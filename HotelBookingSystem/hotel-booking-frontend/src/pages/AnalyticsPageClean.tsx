import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  Divider,
  Container,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Assessment as ReportIcon,
  TrendingUp as TrendingIcon,
  ShowChart as ChartIcon,
  Speed as SpeedIcon,
  Hotel as HotelIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  EventAvailable as EventIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '../services/analyticsService';

const AnalyticsPageClean: React.FC = () => {
  const theme = useTheme();
  
  const [reportDateRange, setReportDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  
  const [predictionParams, setPredictionParams] = useState({
    roomType: 'Standard',
    checkInDate: new Date().toISOString().split('T')[0],
    numberOfNights: 1,
  });

  // Fetch quick statistics
  const { 
    data: quickStats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useQuery({
    queryKey: ['quickStats'],
    queryFn: () => AnalyticsService.getQuickStatistics(),
  });

  // Fetch weekly report
  const { 
    data: weeklyReport, 
    isLoading: reportLoading, 
    error: reportError,
    refetch: refetchReport 
  } = useQuery({
    queryKey: ['weeklyReport', reportDateRange],
    queryFn: () => AnalyticsService.getWeeklyReport(reportDateRange.startDate, reportDateRange.endDate),
    enabled: false,
  });

  // Fetch price predictions
  const { 
    data: pricePredictions = [], 
    isLoading: predictionsLoading, 
    error: predictionsError,
    refetch: refetchPredictions 
  } = useQuery({
    queryKey: ['pricePredictions', predictionParams],
    queryFn: () => AnalyticsService.getPricePredictions(
      predictionParams.roomType, 
      predictionParams.checkInDate, 
      predictionParams.numberOfNights.toString()
    ),
    enabled: false,
  });

  const handleGenerateReport = () => {
    refetchReport();
  };

  const handlePredictPricing = () => {
    refetchPredictions();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 1
          }}
        >
          Analytics Dashboard
        </Typography>
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Comprehensive insights and analytics for your hotel operations
        </Typography>
        <Divider sx={{ mb: 4 }} />
      </Box>

      <Stack spacing={4}>
        {/* Quick Statistics Section */}
        <Card 
          elevation={0}
          sx={{ 
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Box 
                sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              >
                <SpeedIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  Quick Statistics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Real-time performance metrics
                </Typography>
              </Box>
            </Box>

            {statsLoading && (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress size={40} thickness={4} />
              </Box>
            )}

            {statsError && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: 2,
                  '& .MuiAlert-message': { fontWeight: 500 }
                }}
              >
                Error loading statistics: {(statsError as Error).message}
              </Alert>
            )}

            {quickStats && (
              <Box display="flex" gap={3} flexWrap="wrap">
                {/* Total Bookings Card */}
                <Card 
                  variant="outlined" 
                  sx={{ 
                    flex: '1 1 250px', 
                    textAlign: 'center', 
                    p: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.info.light, 0.05)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 25px ${alpha(theme.palette.info.main, 0.15)}`,
                    }
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                    <EventIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />
                  </Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700,
                      color: theme.palette.info.main,
                      mb: 1
                    }}
                  >
                    {quickStats.totalBookings || 0}
                  </Typography>
                  <Typography variant="h6" color="text.primary" fontWeight={500}>
                    Total Bookings
                  </Typography>
                  <Chip 
                    label="Active" 
                    size="small" 
                    color="info" 
                    sx={{ mt: 1, fontWeight: 500 }}
                  />
                </Card>

                {/* Total Revenue Card */}
                <Card 
                  variant="outlined" 
                  sx={{ 
                    flex: '1 1 250px', 
                    textAlign: 'center', 
                    p: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.success.light, 0.05)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 25px ${alpha(theme.palette.success.main, 0.15)}`,
                    }
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                    <MoneyIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
                  </Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700,
                      color: theme.palette.success.main,
                      mb: 1
                    }}
                  >
                    {formatCurrency(quickStats.totalRevenue || 0)}
                  </Typography>
                  <Typography variant="h6" color="text.primary" fontWeight={500}>
                    Total Revenue
                  </Typography>
                  <Chip 
                    label="Growing" 
                    size="small" 
                    color="success" 
                    sx={{ mt: 1, fontWeight: 500 }}
                  />
                </Card>

                {/* Occupancy Rate Card */}
                <Card 
                  variant="outlined" 
                  sx={{ 
                    flex: '1 1 250px', 
                    textAlign: 'center', 
                    p: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 25px ${alpha(theme.palette.secondary.main, 0.15)}`,
                    }
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                    <HotelIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
                  </Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700,
                      color: theme.palette.secondary.main,
                      mb: 1
                    }}
                  >
                    {((quickStats.occupancyRate || 0) * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="h6" color="text.primary" fontWeight={500}>
                    Occupancy Rate
                  </Typography>
                  <Chip 
                    label="Optimal" 
                    size="small" 
                    color="secondary" 
                    sx={{ mt: 1, fontWeight: 500 }}
                  />
                </Card>

                {/* Available Rooms Card */}
                {quickStats.availableRooms !== undefined && (
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      flex: '1 1 250px', 
                      textAlign: 'center', 
                      p: 3,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
                      }
                    }}
                  >
                    <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                      <PeopleIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                    </Box>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        mb: 1
                      }}
                    >
                      {quickStats.availableRooms}
                    </Typography>
                    <Typography variant="h6" color="text.primary" fontWeight={500}>
                      Available Rooms
                    </Typography>
                    <Chip 
                      label="Available" 
                      size="small" 
                      color="primary" 
                      sx={{ mt: 1, fontWeight: 500 }}
                    />
                  </Card>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Weekly Reports Section */}
        <Card elevation={0}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Box 
                sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                  color: theme.palette.info.main,
                }}
              >
                <ReportIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  Weekly Reports
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Generate detailed weekly performance reports
                </Typography>
              </Box>
            </Box>

            <Stack spacing={3}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  backgroundColor: alpha(theme.palette.grey[50], 0.5),
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                }}
              >
                <Box display="flex" gap={2} alignItems="end" flexWrap="wrap">
                  <TextField
                    label="Start Date"
                    type="date"
                    value={reportDateRange.startDate}
                    onChange={(e) => setReportDateRange(prev => ({
                      ...prev,
                      startDate: e.target.value
                    }))}
                    InputLabelProps={{ shrink: true }}
                    sx={{ minWidth: 160 }}
                  />
                  <TextField
                    label="End Date"
                    type="date"
                    value={reportDateRange.endDate}
                    onChange={(e) => setReportDateRange(prev => ({
                      ...prev,
                      endDate: e.target.value
                    }))}
                    InputLabelProps={{ shrink: true }}
                    sx={{ minWidth: 160 }}
                  />
                  <Button 
                    variant="contained"
                    size="large"
                    onClick={handleGenerateReport}
                    disabled={reportLoading}
                    startIcon={reportLoading ? <CircularProgress size={16} /> : <ReportIcon />}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                    }}
                  >
                    Generate Report
                  </Button>
                </Box>
              </Paper>

              {reportError && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  Error generating report: {(reportError as Error).message}
                </Alert>
              )}

              {weeklyReport && (
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.02)} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h6" fontWeight={600} mb={3}>
                    📊 Weekly Report ({new Date(weeklyReport.weekStartDate).toLocaleDateString()} - {new Date(weeklyReport.weekEndDate).toLocaleDateString()})
                  </Typography>
                  
                  <Box display="flex" gap={2} mb={2} flexWrap="wrap">
                    <Card variant="outlined" sx={{ flex: '1 1 200px', textAlign: 'center', p: 3, borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight={700} color="info.main">
                        {weeklyReport.totalBookings}
                      </Typography>
                      <Typography color="text.secondary" fontWeight={500}>
                        Total Bookings
                      </Typography>
                    </Card>
                    <Card variant="outlined" sx={{ flex: '1 1 200px', textAlign: 'center', p: 3, borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight={700} color="success.main">
                        {formatCurrency(weeklyReport.totalRevenue)}
                      </Typography>
                      <Typography color="text.secondary" fontWeight={500}>
                        Total Revenue
                      </Typography>
                    </Card>
                    <Card variant="outlined" sx={{ flex: '1 1 200px', textAlign: 'center', p: 3, borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight={700} color="secondary.main">
                        {((weeklyReport.occupancyRate || 0) * 100).toFixed(1)}%
                      </Typography>
                      <Typography color="text.secondary" fontWeight={500}>
                        Occupancy Rate
                      </Typography>
                    </Card>
                    <Card variant="outlined" sx={{ flex: '1 1 200px', textAlign: 'center', p: 3, borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight={700} color="primary.main">
                        {weeklyReport.totalGuests}
                      </Typography>
                      <Typography color="text.secondary" fontWeight={500}>
                        Total Guests
                      </Typography>
                    </Card>
                  </Box>
                </Paper>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Price Predictions Section */}
        <Card elevation={0}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Box 
                sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  backgroundColor: alpha(theme.palette.warning.main, 0.1),
                  color: theme.palette.warning.main,
                }}
              >
                <TrendingIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  Price Predictions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  AI-powered dynamic pricing recommendations
                </Typography>
              </Box>
            </Box>

            <Stack spacing={3}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  backgroundColor: alpha(theme.palette.grey[50], 0.5),
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                }}
              >
                <Box display="flex" gap={2} alignItems="end" flexWrap="wrap">
                  <FormControl sx={{ minWidth: 160 }}>
                    <InputLabel>Room Type</InputLabel>
                    <Select
                      value={predictionParams.roomType}
                      label="Room Type"
                      onChange={(e) => setPredictionParams(prev => ({
                        ...prev,
                        roomType: e.target.value
                      }))}
                    >
                      <MenuItem value="Standard">🏨 Standard</MenuItem>
                      <MenuItem value="Deluxe">⭐ Deluxe</MenuItem>
                      <MenuItem value="Suite">👑 Suite</MenuItem>
                      <MenuItem value="Executive">💼 Executive</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Check-in Date"
                    type="date"
                    value={predictionParams.checkInDate}
                    onChange={(e) => setPredictionParams(prev => ({
                      ...prev,
                      checkInDate: e.target.value
                    }))}
                    InputLabelProps={{ shrink: true }}
                    sx={{ minWidth: 160 }}
                  />
                  <TextField
                    label="Number of Nights"
                    type="number"
                    value={predictionParams.numberOfNights}
                    onChange={(e) => setPredictionParams(prev => ({
                      ...prev,
                      numberOfNights: parseInt(e.target.value) || 1
                    }))}
                    inputProps={{ min: 1, max: 30 }}
                    sx={{ minWidth: 140 }}
                  />
                  <Button 
                    variant="contained"
                    size="large"
                    onClick={handlePredictPricing}
                    disabled={predictionsLoading}
                    startIcon={predictionsLoading ? <CircularProgress size={16} /> : <ChartIcon />}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
                    }}
                  >
                    Predict Pricing
                  </Button>
                </Box>
              </Paper>

              {predictionsError && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  Error fetching predictions: {(predictionsError as Error).message}
                </Alert>
              )}

              {pricePredictions && (
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    🎯 Pricing Prediction Results
                  </Typography>
                  <Stack spacing={2}>
                    <Box display="flex" gap={4} flexWrap="wrap">
                      <Box>
                        <Typography variant="body2" color="text.secondary">Room Type</Typography>
                        <Chip 
                          label={predictionParams.roomType} 
                          color="primary" 
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Check-in Date</Typography>
                        <Typography fontWeight={500}>
                          {new Date(predictionParams.checkInDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Duration</Typography>
                        <Typography fontWeight={500}>
                          {predictionParams.numberOfNights} nights
                        </Typography>
                      </Box>
                    </Box>
                    
                    {pricePredictions.length > 0 && (
                      <Box 
                        sx={{ 
                          p: 3, 
                          backgroundColor: alpha(theme.palette.success.main, 0.05),
                          borderRadius: 2,
                          border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                        }}
                      >
                        <Typography variant="h4" fontWeight={700} color="success.main" gutterBottom>
                          {formatCurrency(pricePredictions[0].predictedPrice || 0)} 
                          <Typography component="span" variant="body1" color="text.secondary">
                            {" "}per night
                          </Typography>
                        </Typography>
                        <Typography variant="h5" fontWeight={600} color="secondary.main" mb={2}>
                          Total: {formatCurrency((pricePredictions[0].predictedPrice || 0) * predictionParams.numberOfNights)}
                        </Typography>
                        {pricePredictions[0].confidenceLevel && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <ChartIcon color="action" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              Confidence Level: {((pricePredictions[0].confidenceLevel || 0) * 100).toFixed(1)}%
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                    
                    {pricePredictions.length === 0 && !predictionsLoading && (
                      <Alert severity="info" sx={{ borderRadius: 2 }}>
                        No price predictions available for the selected criteria. Please try different parameters.
                      </Alert>
                    )}
                  </Stack>
                </Paper>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default AnalyticsPageClean;
