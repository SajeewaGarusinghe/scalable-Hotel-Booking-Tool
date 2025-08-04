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
} from '@mui/material';
import {
  Assessment as ReportIcon,
  TrendingUp as TrendingIcon,
  ShowChart as ChartIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '../services/analyticsService';

const AnalyticsPageClean: React.FC = () => {
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>

      <Stack spacing={3}>
        {/* Quick Statistics Section */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <SpeedIcon color="primary" />
              <Typography variant="h6">Quick Statistics</Typography>
            </Box>

            {statsLoading && (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress />
              </Box>
            )}

            {statsError && (
              <Alert severity="error">
                Error loading statistics: {(statsError as Error).message}
              </Alert>
            )}

            {quickStats && (
              <Box display="flex" gap={3} flexWrap="wrap">
                <Card variant="outlined" sx={{ flex: '1 1 250px', textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary">
                    {quickStats.totalBookings || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Bookings
                  </Typography>
                </Card>
                <Card variant="outlined" sx={{ flex: '1 1 250px', textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="success.main">
                    {formatCurrency(quickStats.totalRevenue || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </Card>
                <Card variant="outlined" sx={{ flex: '1 1 250px', textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="info.main">
                    {((quickStats.occupancyRate || 0) * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Occupancy Rate
                  </Typography>
                </Card>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Weekly Reports Section */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <ReportIcon color="primary" />
              <Typography variant="h6">Weekly Reports</Typography>
            </Box>

            <Stack spacing={2}>
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
                />
                <Button 
                  variant="contained"
                  onClick={handleGenerateReport}
                  disabled={reportLoading}
                  startIcon={reportLoading ? <CircularProgress size={16} /> : <ReportIcon />}
                >
                  Generate Report
                </Button>
              </Box>

              {reportError && (
                <Alert severity="error">
                  Error generating report: {(reportError as Error).message}
                </Alert>
              )}

              {weeklyReport && (
                <Box>
                  <Typography variant="h6" mb={2}>
                    Weekly Report ({new Date(weeklyReport.weekStartDate).toLocaleDateString()} - {new Date(weeklyReport.weekEndDate).toLocaleDateString()})
                  </Typography>
                  
                  <Box display="flex" gap={2} mb={2} flexWrap="wrap">
                    <Card variant="outlined" sx={{ flex: '1 1 200px', textAlign: 'center', p: 2 }}>
                      <Typography variant="h4">{weeklyReport.totalBookings}</Typography>
                      <Typography color="textSecondary">Total Bookings</Typography>
                    </Card>
                    <Card variant="outlined" sx={{ flex: '1 1 200px', textAlign: 'center', p: 2 }}>
                      <Typography variant="h4">{formatCurrency(weeklyReport.totalRevenue)}</Typography>
                      <Typography color="textSecondary">Total Revenue</Typography>
                    </Card>
                    <Card variant="outlined" sx={{ flex: '1 1 200px', textAlign: 'center', p: 2 }}>
                      <Typography variant="h4">{((weeklyReport.occupancyRate || 0) * 100).toFixed(1)}%</Typography>
                      <Typography color="textSecondary">Occupancy Rate</Typography>
                    </Card>
                    <Card variant="outlined" sx={{ flex: '1 1 200px', textAlign: 'center', p: 2 }}>
                      <Typography variant="h4">{weeklyReport.totalGuests}</Typography>
                      <Typography color="textSecondary">Total Guests</Typography>
                    </Card>
                  </Box>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Price Predictions Section */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <TrendingIcon color="primary" />
              <Typography variant="h6">Price Predictions</Typography>
            </Box>

            <Stack spacing={2}>
              <Box display="flex" gap={2} alignItems="end" flexWrap="wrap">
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Room Type</InputLabel>
                  <Select
                    value={predictionParams.roomType}
                    label="Room Type"
                    onChange={(e) => setPredictionParams(prev => ({
                      ...prev,
                      roomType: e.target.value
                    }))}
                  >
                    <MenuItem value="Standard">Standard</MenuItem>
                    <MenuItem value="Deluxe">Deluxe</MenuItem>
                    <MenuItem value="Suite">Suite</MenuItem>
                    <MenuItem value="Executive">Executive</MenuItem>
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
                />
                <Button 
                  variant="contained"
                  onClick={handlePredictPricing}
                  disabled={predictionsLoading}
                  startIcon={predictionsLoading ? <CircularProgress size={16} /> : <ChartIcon />}
                >
                  Predict Pricing
                </Button>
              </Box>

              {predictionsError && (
                <Alert severity="error">
                  Error fetching predictions: {(predictionsError as Error).message}
                </Alert>
              )}

              {pricePredictions && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Pricing Prediction Results
                    </Typography>
                    <Stack spacing={1}>
                      <Typography>
                        <strong>Room Type:</strong> {predictionParams.roomType}
                      </Typography>
                      <Typography>
                        <strong>Check-in Date:</strong> {new Date(predictionParams.checkInDate).toLocaleDateString()}
                      </Typography>
                      <Typography>
                        <strong>Number of Nights:</strong> {predictionParams.numberOfNights}
                      </Typography>
                      {pricePredictions.length > 0 && (
                        <>
                          <Typography variant="h6" color="primary">
                            <strong>Predicted Price:</strong> {formatCurrency(pricePredictions[0].predictedPrice || 0)} per night
                          </Typography>
                          <Typography variant="h6" color="secondary">
                            <strong>Total Estimated Cost:</strong> {formatCurrency((pricePredictions[0].predictedPrice || 0) * predictionParams.numberOfNights)}
                          </Typography>
                          {pricePredictions[0].confidenceLevel && (
                            <Typography variant="body2" color="text.secondary">
                              Confidence Level: {((pricePredictions[0].confidenceLevel || 0) * 100).toFixed(1)}%
                            </Typography>
                          )}
                        </>
                      )}
                      {pricePredictions.length === 0 && !predictionsLoading && (
                        <Typography color="text.secondary">
                          No price predictions available for the selected criteria.
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default AnalyticsPageClean;
