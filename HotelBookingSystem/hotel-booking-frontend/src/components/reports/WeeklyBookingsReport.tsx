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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Print as PrintIcon,
  Download as DownloadIcon,
  GetApp as GetAppIcon,
  ExpandMore as ExpandMoreIcon,
  Assessment as ReportIcon,
  Event as EventIcon,
  Group as GroupIcon,
  AttachMoney as MoneyIcon,
  Hotel as HotelIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '../../services/analyticsService';
import { WeeklyBookingsReport, DailyBookingsDetail } from '../../types/analytics';
import { ReportExportService } from '../../utils/reportExport';

const WeeklyBookingsReportComponent: React.FC = () => {
  const [reportDateRange, setReportDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { 
    data: reportData, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['weeklyBookingsReport', reportDateRange],
    queryFn: () => AnalyticsService.getDetailedWeeklyBookingsReport(reportDateRange.startDate, reportDateRange.endDate),
    enabled: false,
  });

  const handleGenerateReport = () => {
    refetch();
  };

  const handlePrintReport = () => {
    ReportExportService.printReport('weekly-bookings-report-content');
  };

  const handleExportCSV = () => {
    if (reportData) {
      ReportExportService.exportToCSV(reportData);
    }
  };

  const handleExportPDF = async () => {
    if (reportData) {
      await ReportExportService.exportToPDF(reportData);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusChipColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'fulfilled':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <ReportIcon color="primary" />
          <Typography variant="h6">Weekly Bookings and Special Requests Report</Typography>
        </Box>

        <Stack spacing={2}>
          {/* Report Generation Controls */}
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
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} /> : <ReportIcon />}
            >
              Generate Report
            </Button>
          </Box>

          {error && (
            <Alert severity="error">
              Error generating report: {(error as Error).message}
            </Alert>
          )}

          {/* Export Controls */}
          {reportData && (
            <Box display="flex" gap={1} justifyContent="flex-end" className="no-print">
              <Tooltip title="Print Report">
                <IconButton onClick={handlePrintReport} color="primary">
                  <PrintIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export as CSV">
                <IconButton onClick={handleExportCSV} color="primary">
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export as PDF">
                <IconButton onClick={handleExportPDF} color="primary">
                  <GetAppIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Report Content */}
          {reportData && (
            <Box id="weekly-bookings-report-content">
              {/* Report Header */}
              <Box mb={3} textAlign="center">
                <Typography variant="h4" gutterBottom>
                  Weekly Bookings and Special Requests Report
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {formatDate(reportData.weekStartDate)} - {formatDate(reportData.weekEndDate)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Generated: {new Date(reportData.generatedAt).toLocaleString()}
                </Typography>
              </Box>

              {/* Summary Cards */}
              <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
                <Card variant="outlined" sx={{ flex: '1 1 250px', textAlign: 'center', p: 2 }}>
                  <EventIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" color="primary">
                    {reportData.totalBookings}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Bookings
                  </Typography>
                </Card>
                <Card variant="outlined" sx={{ flex: '1 1 250px', textAlign: 'center', p: 2 }}>
                  <MoneyIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" color="success.main">
                    {formatCurrency(reportData.totalRevenue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </Card>
                <Card variant="outlined" sx={{ flex: '1 1 250px', textAlign: 'center', p: 2 }}>
                  <HotelIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" color="info.main">
                    {((reportData.occupancyRate || 0) * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Occupancy Rate
                  </Typography>
                </Card>
                <Card variant="outlined" sx={{ flex: '1 1 250px', textAlign: 'center', p: 2 }}>
                  <GroupIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" color="secondary.main">
                    {reportData.totalGuests}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Guests
                  </Typography>
                </Card>
              </Box>

              {/* Daily Breakdown */}
              <Typography variant="h5" gutterBottom>
                Daily Breakdown
              </Typography>
              
              {reportData.dailyDetails.map((day: DailyBookingsDetail, index: number) => (
                <Accordion key={index} sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                      <Typography variant="h6">
                        {day.dayOfWeek}, {formatDate(day.date)}
                      </Typography>
                      <Box display="flex" gap={2} onClick={(e) => e.stopPropagation()}>
                        <Chip 
                          label={`${day.totalBookings} Bookings`} 
                          color="primary" 
                          size="small" 
                        />
                        <Chip 
                          label={formatCurrency(day.dayRevenue)} 
                          color="success" 
                          size="small" 
                        />
                        <Chip 
                          label={`${(day.dayOccupancyRate * 100).toFixed(1)}% Occupancy`} 
                          color="info" 
                          size="small" 
                        />
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      {/* Daily Statistics */}
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Daily Statistics
                        </Typography>
                        <Box display="flex" gap={3} flexWrap="wrap">
                          <Box>
                            <Typography variant="body2">
                              <strong>Bookings:</strong> {day.totalBookings}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2">
                              <strong>Revenue:</strong> {formatCurrency(day.dayRevenue)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2">
                              <strong>Occupancy:</strong> {(day.dayOccupancyRate * 100).toFixed(1)}%
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2">
                              <strong>Guests:</strong> {day.totalGuests}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Bookings Table */}
                      {day.bookings.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Bookings ({day.bookings.length})
                          </Typography>
                          <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Guest Name</TableCell>
                                  <TableCell>Room</TableCell>
                                  <TableCell>Type</TableCell>
                                  <TableCell align="center">Guests</TableCell>
                                  <TableCell align="right">Amount</TableCell>
                                  <TableCell align="center">Status</TableCell>
                                  <TableCell>Check-out</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {day.bookings.map((booking: any, bookingIndex: number) => (
                                  <TableRow key={bookingIndex}>
                                    <TableCell>{booking.customerName}</TableCell>
                                    <TableCell>{booking.roomNumber}</TableCell>
                                    <TableCell>{booking.roomType}</TableCell>
                                    <TableCell align="center">{booking.numberOfGuests}</TableCell>
                                    <TableCell align="right">{formatCurrency(booking.totalAmount)}</TableCell>
                                    <TableCell align="center">
                                      <Chip 
                                        label={booking.status} 
                                        color={getStatusChipColor(booking.status) as any}
                                        size="small" 
                                      />
                                    </TableCell>
                                    <TableCell>{formatDate(booking.checkOutDate)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      )}

                      {/* Special Requests Table */}
                      {day.specialRequests.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Special Requests ({day.specialRequests.length})
                          </Typography>
                          <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Guest Name</TableCell>
                                  <TableCell>Booking Ref</TableCell>
                                  <TableCell>Request Type</TableCell>
                                  <TableCell>Description</TableCell>
                                  <TableCell align="center">Status</TableCell>
                                  <TableCell>Fulfilled Date</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {day.specialRequests.map((request: any, requestIndex: number) => (
                                  <TableRow key={requestIndex}>
                                    <TableCell>{request.customerName}</TableCell>
                                    <TableCell>{request.bookingReference}</TableCell>
                                    <TableCell>{request.requestType}</TableCell>
                                    <TableCell>{request.description || 'N/A'}</TableCell>
                                    <TableCell align="center">
                                      <Chip 
                                        label={request.status} 
                                        color={getStatusChipColor(request.status) as any}
                                        size="small" 
                                      />
                                    </TableCell>
                                    <TableCell>
                                      {request.fulfilledDate ? formatDate(request.fulfilledDate) : 'N/A'}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      )}

                      {day.bookings.length === 0 && day.specialRequests.length === 0 && (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                          No bookings or special requests for this day
                        </Typography>
                      )}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}

              {/* Room Type Statistics */}
              {reportData.roomTypeStats.length > 0 && (
                <Box mt={3}>
                  <Typography variant="h5" gutterBottom>
                    Room Type Statistics
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Room Type</TableCell>
                          <TableCell align="center">Booking Count</TableCell>
                          <TableCell align="right">Revenue</TableCell>
                          <TableCell align="center">Occupancy Rate</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reportData.roomTypeStats.map((stat: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              <strong>{stat.roomType}</strong>
                            </TableCell>
                            <TableCell align="center">{stat.bookingCount}</TableCell>
                            <TableCell align="right">{formatCurrency(stat.revenue)}</TableCell>
                            <TableCell align="center">
                              {((stat.occupancyRate || 0) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WeeklyBookingsReportComponent;
