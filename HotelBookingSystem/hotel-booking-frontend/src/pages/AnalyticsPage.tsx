import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '../services/analyticsService';
import { WeeklyReport, PricePrediction } from '../types/analytics';

const AnalyticsPage: React.FC = () => {
  const [reportDateRange, setReportDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [predictionParams, setPredictionParams] = useState({
    roomType: 'Standard',
    checkInDate: new Date().toISOString().split('T')[0],
    numberOfNights: 3,
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
    enabled: !!reportDateRange.startDate && !!reportDateRange.endDate,
  });

  // Fetch price predictions
  const { 
    data: pricePredictions, 
    isLoading: predictionsLoading, 
    error: predictionsError,
    refetch: refetchPredictions 
  } = useQuery({
    queryKey: ['pricePredictions', predictionParams],
    queryFn: () => AnalyticsService.getPricePredictions(
      predictionParams.roomType,
      predictionParams.checkInDate,
      predictionParams.numberOfNights
    ),
    enabled: !!predictionParams.roomType && !!predictionParams.checkInDate,
  });

  const handleGenerateReport = () => {
    refetchReport();
  };

  const handlePredictPricing = () => {
    refetchPredictions();
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={3}>
        Analytics & Reports
      </Typography>

      <Stack spacing={3}>
        {/* Weekly Reports Section */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <ReportIcon color="primary" />
              <Typography variant="h6">Weekly Reports</Typography>
            </Box>

            <Stack spacing={2}>
              <Box display="flex" gap={2} alignItems="end">
                <TextField
                  label="Start Date"
                  type="date"
                  value={reportDateRange.startDate}
                  onChange={(e) => setReportDateRange({ 
                    ...reportDateRange, 
                    startDate: e.target.value 
                  })}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={reportDateRange.endDate}
                  onChange={(e) => setReportDateRange({ 
                    ...reportDateRange, 
                    endDate: e.target.value 
                  })}
                  InputLabelProps={{ shrink: true }}
                />
                <Button
                  variant="contained"
                  startIcon={<ReportIcon />}
                  onClick={handleGenerateReport}
                  disabled={reportLoading}
                >
                  {reportLoading ? 'Generating...' : 'Generate Report'}
                </Button>
              </Box>

              {reportError && (
                <Alert severity="error">
                  {reportError?.message || 'Failed to generate report'}
                </Alert>
              )}

              {reportLoading && (
                <Box display="flex" justifyContent="center" p={2}>
                  <CircularProgress />
                </Box>
              )}

              {weeklyReport && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Metric</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Bookings</TableCell>
                        <TableCell>{weeklyReport.totalBookings || 0}</TableCell>
                        <TableCell>Number of bookings in the selected period</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Revenue</TableCell>
                        <TableCell>${weeklyReport.totalRevenue?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>Total revenue generated</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Average Booking Value</TableCell>
                        <TableCell>${weeklyReport.averageBookingValue?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>Average value per booking</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Occupancy Rate</TableCell>
                        <TableCell>{weeklyReport.occupancyRate?.toFixed(1) || '0.0'}%</TableCell>
                        <TableCell>Percentage of rooms occupied</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
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
              <Box display="flex" gap={2} alignItems="end">
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Room Type</InputLabel>
                  <Select
                    value={predictionParams.roomType}
                    onChange={(e) => setPredictionParams({ 
                      ...predictionParams, 
                      roomType: e.target.value 
                    })}
                    label="Room Type"
                  >
                    <MenuItem value="Standard">Standard</MenuItem>
                    <MenuItem value="Deluxe">Deluxe</MenuItem>
                    <MenuItem value="Suite">Suite</MenuItem>
                    <MenuItem value="Presidential Suite">Presidential Suite</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Check-in Date"
                  type="date"
                  value={predictionParams.checkInDate}
                  onChange={(e) => setPredictionParams({ 
                    ...predictionParams, 
                    checkInDate: e.target.value 
                  })}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  label="Number of Nights"
                  type="number"
                  value={predictionParams.numberOfNights}
                  onChange={(e) => setPredictionParams({ 
                    ...predictionParams, 
                    numberOfNights: parseInt(e.target.value) || 1 
                  })}
                  inputProps={{ min: 1, max: 30 }}
                />

                <Button
                  variant="contained"
                  startIcon={<TrendingIcon />}
                  onClick={handlePredictPricing}
                  disabled={predictionsLoading}
                >
                  {predictionsLoading ? 'Predicting...' : 'Predict Pricing'}
                </Button>
              </Box>

              {predictionsError && (
                <Alert severity="error">
                  {predictionsError?.message || 'Failed to get price predictions'}
                </Alert>
              )}

              {predictionsLoading && (
                <Box display="flex" justifyContent="center" p={2}>
                  <CircularProgress />
                </Box>
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
                      <Typography variant="h6" color="primary">
                        <strong>Predicted Price:</strong> ${pricePredictions.predictedPrice?.toFixed(2) || 'N/A'} per night
                      </Typography>
                      <Typography variant="h6" color="secondary">
                        <strong>Total Estimated Cost:</strong> ${((pricePredictions.predictedPrice || 0) * predictionParams.numberOfNights).toFixed(2)}
                      </Typography>
                      {pricePredictions.confidenceLevel && (
                        <Typography variant="body2" color="text.secondary">
                          Confidence Level: {(pricePredictions.confidenceLevel * 100).toFixed(1)}%
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Quick Stats Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Statistics
            </Typography>
            <Box display="flex" gap={3}>
              <Card variant="outlined" sx={{ flex: 1, textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary">
                  {weeklyReport?.totalBookings || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Bookings (This Period)
                </Typography>
              </Card>
              <Card variant="outlined" sx={{ flex: 1, textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="success.main">
                  ${weeklyReport?.totalRevenue?.toFixed(0) || '0'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Revenue (This Period)
                </Typography>
              </Card>
              <Card variant="outlined" sx={{ flex: 1, textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="info.main">
                  {weeklyReport?.occupancyRate?.toFixed(0) || '0'}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Occupancy Rate
                </Typography>
              </Card>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default AnalyticsPage;
