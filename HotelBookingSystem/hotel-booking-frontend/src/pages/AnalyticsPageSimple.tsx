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
  As                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Predicted Price</TableCell>
                      <TableCell align="right">Confidence</TableCell>
                      <TableCell align="right">Model Version</TableCell>
                      <TableCell>Factors</TableCell>
                    </TableRow> as ReportIcon,
  TrendingUp as TrendingIcon,
  ShowChart as ChartIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '../services/analyticsService';
import { WeeklyReport, PricePrediction, QuickStats } from '../types/analytics';

const AnalyticsPageSimple: React.FC = () => {
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
    error: statsError 
  } = useQuery<QuickStats>({
    queryKey: ['quickStats'],
    queryFn: AnalyticsService.getQuickStatistics,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch weekly report
  const { 
    data: weeklyReport, 
    isLoading: reportLoading, 
    error: reportError,
    refetch: refetchReport
  } = useQuery<WeeklyReport>({
    queryKey: ['weeklyReport', reportDateRange],
    queryFn: () => AnalyticsService.getWeeklyReport(
      reportDateRange.startDate, 
      reportDateRange.endDate
    ),
    enabled: !!reportDateRange.startDate && !!reportDateRange.endDate,
  });

  // Fetch price predictions
  const { 
    data: predictions, 
    isLoading: predictionsLoading, 
    error: predictionsError,
    refetch: refetchPredictions
  } = useQuery<PricePrediction[]>({
    queryKey: ['pricePredictions', predictionParams],
    queryFn: () => AnalyticsService.getPricePredictions(
      predictionParams.roomType,
      predictionParams.startDate,
      predictionParams.endDate
    ),
    enabled: !!predictionParams.roomType && !!predictionParams.startDate && !!predictionParams.endDate,
  });

  const handleReportGenerate = () => {
    refetchReport();
  };

  const handlePredictionGenerate = () => {
    refetchPredictions();
  };

  if (statsError || reportError || predictionsError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Error loading analytics data. Please try again later.
          {(statsError as Error)?.message || (reportError as Error)?.message || (predictionsError as Error)?.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Hotel Analytics Dashboard
      </Typography>

      {/* Quick Statistics Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <SpeedIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h5" component="h2">
              Quick Statistics
            </Typography>
          </Box>

          {statsLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : quickStats ? (
            <Box>
              {/* Statistics Cards in horizontal layout */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                <Card sx={{ minWidth: 200, flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6" color="primary">Total Rooms</Typography>
                    <Typography variant="h4">{quickStats.totalRooms}</Typography>
                  </CardContent>
                </Card>
                <Card sx={{ minWidth: 200, flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6" color="warning.main">Available Rooms</Typography>
                    <Typography variant="h4">{quickStats.availableRooms}</Typography>
                  </CardContent>
                </Card>
                <Card sx={{ minWidth: 200, flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6" color="info.main">Occupancy Rate</Typography>
                    <Typography variant="h4">{quickStats.occupancyRate.toFixed(1)}%</Typography>
                  </CardContent>
                </Card>
                <Card sx={{ minWidth: 200, flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6" color="success.main">Total Revenue</Typography>
                    <Typography variant="h4">${quickStats.totalRevenue.toFixed(2)}</Typography>
                  </CardContent>
                </Card>
              </Stack>

              {/* Revenue and Bookings */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                <Card sx={{ minWidth: 200, flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6" color="primary">Total Bookings</Typography>
                    <Typography variant="h4">{quickStats.totalBookings}</Typography>
                  </CardContent>
                </Card>
                <Card sx={{ minWidth: 200, flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6" color="warning.main">Total Guests</Typography>
                    <Typography variant="h4">{quickStats.totalGuests}</Typography>
                  </CardContent>
                </Card>
                <Card sx={{ minWidth: 200, flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6" color="info.main">Last Updated</Typography>
                    <Typography variant="body1">{new Date(quickStats.lastUpdated).toLocaleString()}</Typography>
                  </CardContent>
                </Card>
              </Stack>

              {/* Room Type Breakdown */}
              {quickStats.roomTypeStats && quickStats.roomTypeStats.length > 0 && (
                <Box>
                  <Typography variant="h6" mb={2}>Room Type Breakdown</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {quickStats.roomTypeStats.map((room, index) => (
                      <Chip 
                        key={index}
                        label={`${room.roomType}: ${room.occupiedRooms}/${room.totalRooms} ($${room.averageRate.toFixed(2)})`}
                        color={room.occupiedRooms === room.totalRooms ? "error" : "default"}
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          ) : (
            <Alert severity="info">No statistics available</Alert>
          )}
        </CardContent>
      </Card>

      {/* Weekly Reports Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <ReportIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h5" component="h2">
              Weekly Reports
            </Typography>
          </Box>

          <Box mb={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
              <TextField
                label="Start Date"
                type="date"
                value={reportDateRange.startDate}
                onChange={(e) => setReportDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
              />
              <TextField
                label="End Date"
                type="date"
                value={reportDateRange.endDate}
                onChange={(e) => setReportDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
              />
              <Button 
                variant="contained" 
                onClick={handleReportGenerate}
                disabled={reportLoading}
                sx={{ minWidth: 120 }}
              >
                {reportLoading ? <CircularProgress size={24} /> : 'Generate Report'}
              </Button>
            </Stack>
          </Box>

          {reportLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : weeklyReport ? (
            <Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6">Total Revenue</Typography>
                    <Typography variant="h4" color="success.main">
                      ${weeklyReport.totalRevenue.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6">Total Bookings</Typography>
                    <Typography variant="h4" color="primary">
                      {weeklyReport.totalBookings}
                    </Typography>
                  </CardContent>
                </Card>
                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6">Occupancy Rate</Typography>
                    <Typography variant="h4" color="info.main">
                      {weeklyReport.occupancyRate.toFixed(1)}%
                    </Typography>
                  </CardContent>
                </Card>
                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6">Total Guests</Typography>
                    <Typography variant="h4" color="warning.main">
                      {weeklyReport.totalGuests}
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>

              {/* Room Type Statistics */}
              {weeklyReport.roomTypeStats && weeklyReport.roomTypeStats.length > 0 && (
                <Box mb={3}>
                  <Typography variant="h6" mb={2}>Room Type Performance</Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Room Type</TableCell>
                          <TableCell align="right">Bookings</TableCell>
                          <TableCell align="right">Revenue</TableCell>
                          <TableCell align="right">Occupancy %</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {weeklyReport.roomTypeStats.map((stat, index) => (
                          <TableRow key={index}>
                            <TableCell>{stat.roomType}</TableCell>
                            <TableCell align="right">{stat.bookingCount}</TableCell>
                            <TableCell align="right">${stat.revenue.toFixed(2)}</TableCell>
                            <TableCell align="right">{stat.occupancyRate.toFixed(1)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          ) : (
            <Alert severity="info">No report data available for the selected date range</Alert>
          )}
        </CardContent>
      </Card>

      {/* Price Predictions Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <ChartIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h5" component="h2">
              Price Predictions
            </Typography>
          </Box>

          <Box mb={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Room Type</InputLabel>
                <Select
                  value={predictionParams.roomType}
                  label="Room Type"
                  onChange={(e) => setPredictionParams(prev => ({ ...prev, roomType: e.target.value }))}
                >
                  <MenuItem value="Standard">Standard</MenuItem>
                  <MenuItem value="Deluxe">Deluxe</MenuItem>
                  <MenuItem value="Suite">Suite</MenuItem>
                  <MenuItem value="Presidential">Presidential</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Start Date"
                type="date"
                value={predictionParams.startDate}
                onChange={(e) => setPredictionParams(prev => ({ ...prev, startDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
              />
              <TextField
                label="End Date"
                type="date"
                value={predictionParams.endDate}
                onChange={(e) => setPredictionParams(prev => ({ ...prev, endDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
              />
              <Button 
                variant="contained" 
                onClick={handlePredictionGenerate}
                disabled={predictionsLoading}
                sx={{ minWidth: 120 }}
              >
                {predictionsLoading ? <CircularProgress size={24} /> : 'Get Predictions'}
              </Button>
            </Stack>
          </Box>

          {predictionsLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : predictions && predictions.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Predicted Price</TableCell>
                    <TableCell align="right">Base Price</TableCell>
                    <TableCell align="right">Confidence</TableCell>
                    <TableCell align="right">Demand Level</TableCell>
                    <TableCell>Factors</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {predictions.map((prediction, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(prediction.date).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" color="primary">
                          ${prediction.predictedPrice.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">${prediction.basePrice.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={`${(prediction.confidence * 100).toFixed(0)}%`}
                          color={prediction.confidence > 0.7 ? "success" : prediction.confidence > 0.5 ? "warning" : "error"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={prediction.demandLevel}
                          color={prediction.demandLevel === "High" ? "error" : prediction.demandLevel === "Medium" ? "warning" : "success"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {prediction.factors.slice(0, 3).map((factor, factorIndex) => (
                            <Chip 
                              key={factorIndex}
                              label={factor}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">No prediction data available for the selected parameters</Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default AnalyticsPageSimple;
