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
  Chip,
  Container,
} from '@mui/material';
import {
  Assessment as ReportIcon,
  TrendingUp as TrendingIcon,
  ShowChart as ChartIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '../services/analyticsService';
import { WeeklyReport, PricePrediction, QuickStats } from '../types/analytics';

const AnalyticsPage: React.FC = () => {
  const [reportDateRange, setReportDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [predictionParams, setPredictionParams] = useState({
    roomType: 'Standard',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  // Fetch quick statistics
  const { 
    data: quickStats, 
    isLoading: statsLoading, 
    error: statsError,
    refetch: refetchStats 
  } = useQuery({
    queryKey: ['quickStats'],
    queryFn: () => AnalyticsService.getQuickStatistics(),
    refetchInterval: 30000, // Refresh every 30 seconds
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
      predictionParams.startDate,
      predictionParams.endDate
    ),
    enabled: !!predictionParams.roomType && !!predictionParams.startDate && !!predictionParams.endDate,
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
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={3}>
        Analytics & Reports
      </Typography>

      <Stack spacing={3}>
        {/* Quick Statistics Section */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <SpeedIcon color="primary" />
              <Typography variant="h6">Quick Statistics</Typography>
              <Button 
                size="small" 
                onClick={() => refetchStats()}
                disabled={statsLoading}
              >
                Refresh
              </Button>
            </Box>

            {statsLoading && <CircularProgress size={24} />}
            {statsError && (
              <Alert severity="error">
                Error loading statistics: {(statsError as Error).message}
              </Alert>
            )}
            {quickStats && (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          Total Bookings
                        </Typography>
                        <Typography variant="h4">
                          {quickStats.totalBookings}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          Total Revenue
                        </Typography>
                        <Typography variant="h4">
                          {formatCurrency(quickStats.totalRevenue)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          Occupancy Rate
                        </Typography>
                        <Typography variant="h4">
                          {formatPercentage(quickStats.occupancyRate)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          Available Rooms
                        </Typography>
                        <Typography variant="h4">
                          {quickStats.availableRooms} / {quickStats.totalRooms}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {quickStats.roomTypeStats && quickStats.roomTypeStats.length > 0 && (
                  <Box mt={3}>
                    <Typography variant="h6" mb={2}>Room Type Statistics</Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Room Type</TableCell>
                            <TableCell align="right">Total Rooms</TableCell>
                            <TableCell align="right">Occupied</TableCell>
                            <TableCell align="right">Available</TableCell>
                            <TableCell align="right">Occupancy Rate</TableCell>
                            <TableCell align="right">Average Rate</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {quickStats.roomTypeStats.map((stat) => (
                            <TableRow key={stat.roomType}>
                              <TableCell>{stat.roomType}</TableCell>
                              <TableCell align="right">{stat.totalRooms}</TableCell>
                              <TableCell align="right">{stat.occupiedRooms}</TableCell>
                              <TableCell align="right">{stat.availableRooms}</TableCell>
                              <TableCell align="right">
                                <Chip 
                                  label={formatPercentage(stat.occupancyRate)}
                                  color={stat.occupancyRate > 0.8 ? 'error' : stat.occupancyRate > 0.6 ? 'warning' : 'success'}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell align="right">{formatCurrency(stat.averageRate)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
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
              <Box display="flex" gap={2} alignItems="end">
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
                  {reportLoading ? 'Generating...' : 'Generate Report'}
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
                  
                  <Grid container spacing={2} mb={2}>
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4">{weeklyReport.totalBookings}</Typography>
                        <Typography color="textSecondary">Total Bookings</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4">{formatCurrency(weeklyReport.totalRevenue)}</Typography>
                        <Typography color="textSecondary">Total Revenue</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4">{formatPercentage(weeklyReport.occupancyRate)}</Typography>
                        <Typography color="textSecondary">Occupancy Rate</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4">{weeklyReport.totalGuests}</Typography>
                        <Typography color="textSecondary">Total Guests</Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {weeklyReport.roomTypeStats && weeklyReport.roomTypeStats.length > 0 && (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Room Type</TableCell>
                            <TableCell align="right">Bookings</TableCell>
                            <TableCell align="right">Revenue</TableCell>
                            <TableCell align="right">Occupancy Rate</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {weeklyReport.roomTypeStats.map((stat) => (
                            <TableRow key={stat.roomType}>
                              <TableCell>{stat.roomType}</TableCell>
                              <TableCell align="right">{stat.bookingCount}</TableCell>
                              <TableCell align="right">{formatCurrency(stat.revenue)}</TableCell>
                              <TableCell align="right">{formatPercentage(stat.occupancyRate)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
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
              <Box display="flex" gap={2} alignItems="end">
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
                  label="Start Date"
                  type="date"
                  value={predictionParams.startDate}
                  onChange={(e) => setPredictionParams(prev => ({
                    ...prev,
                    startDate: e.target.value
                  }))}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={predictionParams.endDate}
                  onChange={(e) => setPredictionParams(prev => ({
                    ...prev,
                    endDate: e.target.value
                  }))}
                  InputLabelProps={{ shrink: true }}
                />
                <Button 
                  variant="contained"
                  onClick={handlePredictPricing}
                  disabled={predictionsLoading}
                  startIcon={predictionsLoading ? <CircularProgress size={16} /> : <ChartIcon />}
                >
                  {predictionsLoading ? 'Predicting...' : 'Predict Pricing'}
                </Button>
              </Box>

              {predictionsError && (
                <Alert severity="error">
                  Error fetching predictions: {(predictionsError as Error).message}
                </Alert>
              )}

              {pricePredictions && pricePredictions.length > 0 && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Predicted Price</TableCell>
                        <TableCell align="right">Confidence Level</TableCell>
                        <TableCell>Key Factors</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pricePredictions.map((prediction) => (
                        <TableRow key={prediction.predictionId}>
                          <TableCell>
                            {new Date(prediction.predictionDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(prediction.predictedPrice)}
                          </TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={formatPercentage(prediction.confidenceLevel)}
                              color={prediction.confidenceLevel > 0.8 ? 'success' : prediction.confidenceLevel > 0.6 ? 'warning' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box display="flex" gap={1} flexWrap="wrap">
                              {prediction.priceFactors.slice(0, 3).map((factor, index) => (
                                <Chip 
                                  key={index}
                                  label={factor.factorName}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default AnalyticsPage;
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
                  Error generating report: {reportError.message}
                </Alert>
              )}

              {weeklyReport && (
                <Box>
                  <Typography variant="h6" mb={2}>
                    Weekly Report ({new Date(weeklyReport.weekStartDate).toLocaleDateString()} - {new Date(weeklyReport.weekEndDate).toLocaleDateString()})
                  </Typography>
                  
                  <Grid container spacing={2} mb={2}>
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4">{weeklyReport.totalBookings}</Typography>
                        <Typography color="textSecondary">Total Bookings</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4">{formatCurrency(weeklyReport.totalRevenue)}</Typography>
                        <Typography color="textSecondary">Total Revenue</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4">{formatPercentage(weeklyReport.occupancyRate)}</Typography>
                        <Typography color="textSecondary">Occupancy Rate</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4">{weeklyReport.totalGuests}</Typography>
                        <Typography color="textSecondary">Total Guests</Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {weeklyReport.roomTypeStats && weeklyReport.roomTypeStats.length > 0 && (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Room Type</TableCell>
                            <TableCell align="right">Bookings</TableCell>
                            <TableCell align="right">Revenue</TableCell>
                            <TableCell align="right">Occupancy Rate</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {weeklyReport.roomTypeStats.map((stat) => (
                            <TableRow key={stat.roomType}>
                              <TableCell>{stat.roomType}</TableCell>
                              <TableCell align="right">{stat.bookingCount}</TableCell>
                              <TableCell align="right">{formatCurrency(stat.revenue)}</TableCell>
                              <TableCell align="right">{formatPercentage(stat.occupancyRate)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
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
              <Box display="flex" gap={2} alignItems="end">
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
                  label="Start Date"
                  type="date"
                  value={predictionParams.startDate}
                  onChange={(e) => setPredictionParams(prev => ({
                    ...prev,
                    startDate: e.target.value
                  }))}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={predictionParams.endDate}
                  onChange={(e) => setPredictionParams(prev => ({
                    ...prev,
                    endDate: e.target.value
                  }))}
                  InputLabelProps={{ shrink: true }}
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
                  Error fetching predictions: {predictionsError.message}
                </Alert>
              )}

              {pricePredictions && pricePredictions.length > 0 && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Predicted Price</TableCell>
                        <TableCell align="right">Confidence Level</TableCell>
                        <TableCell>Key Factors</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pricePredictions.map((prediction) => (
                        <TableRow key={prediction.predictionId}>
                          <TableCell>
                            {new Date(prediction.predictionDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(prediction.predictedPrice)}
                          </TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={formatPercentage(prediction.confidenceLevel)}
                              color={prediction.confidenceLevel > 0.8 ? 'success' : prediction.confidenceLevel > 0.6 ? 'warning' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box display="flex" gap={1} flexWrap="wrap">
                              {prediction.priceFactors.slice(0, 3).map((factor, index) => (
                                <Chip 
                                  key={index}
                                  label={factor.factorName}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default AnalyticsPage;
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
