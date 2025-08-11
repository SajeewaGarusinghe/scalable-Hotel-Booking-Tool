import React, { useState, useMemo } from 'react';
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
  TableSortLabel,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookingService } from '../services/bookingService';
import { RoomService } from '../services/roomService';
import { CustomerService } from '../services/customerService';
import { Booking, CreateBookingDto, UpdateBookingDto } from '../types/booking';
import { Room } from '../types/room';
import { Customer } from '../types/customer';

const BookingsPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState<CreateBookingDto>({
    customerId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    isRecurring: false,
    recurrencePattern: '',
    bookingStatus: 'Confirmed',
    bookingReference: '',
  });
  const [error, setError] = useState<string>('');

  // Sorting state
  const [orderBy, setOrderBy] = useState<string>('checkInDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const queryClient = useQueryClient();

  // Fetch data
  const { data: bookings = [], isLoading: bookingsLoading, error: fetchError } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => BookingService.getBookings(),
  });

  const { data: rooms = [] } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => RoomService.getAllRooms(),
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => CustomerService.getCustomers(),
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: (bookingData: CreateBookingDto) => BookingService.createBooking(bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      handleCloseDialog();
      setError('');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to create booking');
    },
  });

  // Update booking mutation
  const updateBookingMutation = useMutation({
    mutationFn: ({ bookingId, bookingData }: { bookingId: string; bookingData: UpdateBookingDto }) =>
      BookingService.updateBooking(bookingId, bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      handleCloseDialog();
      setError('');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to update booking');
    },
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: string) => BookingService.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to cancel booking');
    },
  });

  const handleOpenDialog = (booking?: Booking) => {
    if (booking) {
      setSelectedBooking(booking);
      setFormData({
        customerId: booking.customerId,
        roomId: booking.roomId,
        checkInDate: booking.checkInDate.split('T')[0],
        checkOutDate: booking.checkOutDate.split('T')[0],
        numberOfGuests: booking.numberOfGuests,
        isRecurring: booking.isRecurring,
        recurrencePattern: booking.recurrencePattern || '',
        bookingStatus: booking.bookingStatus,
        bookingReference: booking.bookingReference,
      });
    } else {
      setSelectedBooking(null);
      setFormData({
        customerId: '',
        roomId: '',
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 1,
        isRecurring: false,
        recurrencePattern: '',
        bookingStatus: 'Confirmed',
        bookingReference: '',
      });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
    setError('');
  };

  const handleSubmit = () => {
    if (selectedBooking) {
      // For updates, only send the fields that can be updated
      const updateData: UpdateBookingDto = {
        customerId: formData.customerId,
        roomId: formData.roomId,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfGuests: formData.numberOfGuests,
        isRecurring: formData.isRecurring,
        recurrencePattern: formData.isRecurring ? 'Weekly' : '',
        bookingStatus: 'Confirmed' as const,
      };
      
      updateBookingMutation.mutate({
        bookingId: selectedBooking.bookingId,
        bookingData: updateData,
      });
    } else {
      // For creates, generate a booking reference
      const bookingReference = `BK${Date.now()}`;
      
      const submissionData = {
        ...formData,
        bookingStatus: 'Confirmed' as const,
        bookingReference,
        recurrencePattern: formData.isRecurring ? 'Weekly' : '',
      };
      
      createBookingMutation.mutate(submissionData);
    }
  };

  const handleCancel = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBookingMutation.mutate(bookingId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'checkedin':
        return 'info';
      case 'checkedout':
        return 'default';
      default:
        return 'default';
    }
  };

  const getRoomInfo = (roomId: string) => {
    const room = rooms.find((r: Room) => r.roomId === roomId);
    return room ? `${room.roomNumber} (${room.roomType})` : 'Unknown Room';
  };

  const getCustomerInfo = (customerId: string) => {
    const customer = customers.find((c: Customer) => c.customerId === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer';
  };

  if (bookingsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading bookings...</Typography>
      </Box>
    );
  }

  // Helper to get comparable values for sorting
  const getSortableValue = (b: Booking, key: string): any => {
    switch (key) {
      case 'bookingReference':
        return b.bookingReference || b.bookingId;
      case 'customer':
        return getCustomerInfo(b.customerId).toLowerCase();
      case 'room':
        return getRoomInfo(b.roomId).toLowerCase();
      case 'checkInDate':
        return new Date(b.checkInDate).getTime();
      case 'checkOutDate':
        return new Date(b.checkOutDate).getTime();
      case 'numberOfGuests':
        return b.numberOfGuests;
      case 'totalAmount':
        return b.totalAmount ?? -1; // put missing amounts at top/bottom depending on order
      case 'bookingStatus':
        return (b.bookingStatus || '').toLowerCase();
      default:
        return (b as any)[key] ?? '';
    }
  };

  const sortedBookings = useMemo(() => {
    const copy = [...bookings];
    copy.sort((a, b) => {
      const av = getSortableValue(a, orderBy);
      const bv = getSortableValue(b, orderBy);
      if (av < bv) return order === 'asc' ? -1 : 1;
      if (av > bv) return order === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [bookings, order, orderBy]);

  const paginatedBookings = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedBookings.slice(start, start + rowsPerPage);
  }, [sortedBookings, page, rowsPerPage]);

  const handleRequestSort = (property: string) => {
    if (orderBy === property) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(property);
      setOrder('asc');
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Booking Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            New Booking
          </Button>
        </Box>

        {(fetchError || error) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {fetchError?.message || error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sortDirection={orderBy === 'bookingReference' ? order : false}>
                      <TableSortLabel
                        active={orderBy === 'bookingReference'}
                        direction={orderBy === 'bookingReference' ? order : 'asc'}
                        onClick={() => handleRequestSort('bookingReference')}
                      >
                        Booking ID
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sortDirection={orderBy === 'customer' ? order : false}>
                      <TableSortLabel
                        active={orderBy === 'customer'}
                        direction={orderBy === 'customer' ? order : 'asc'}
                        onClick={() => handleRequestSort('customer')}
                      >
                        Customer
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sortDirection={orderBy === 'room' ? order : false}>
                      <TableSortLabel
                        active={orderBy === 'room'}
                        direction={orderBy === 'room' ? order : 'asc'}
                        onClick={() => handleRequestSort('room')}
                      >
                        Room
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sortDirection={orderBy === 'checkInDate' ? order : false}>
                      <TableSortLabel
                        active={orderBy === 'checkInDate'}
                        direction={orderBy === 'checkInDate' ? order : 'asc'}
                        onClick={() => handleRequestSort('checkInDate')}
                      >
                        Check-in
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sortDirection={orderBy === 'checkOutDate' ? order : false}>
                      <TableSortLabel
                        active={orderBy === 'checkOutDate'}
                        direction={orderBy === 'checkOutDate' ? order : 'asc'}
                        onClick={() => handleRequestSort('checkOutDate')}
                      >
                        Check-out
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sortDirection={orderBy === 'numberOfGuests' ? order : false}>
                      <TableSortLabel
                        active={orderBy === 'numberOfGuests'}
                        direction={orderBy === 'numberOfGuests' ? order : 'asc'}
                        onClick={() => handleRequestSort('numberOfGuests')}
                      >
                        Guests
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sortDirection={orderBy === 'totalAmount' ? order : false}>
                      <TableSortLabel
                        active={orderBy === 'totalAmount'}
                        direction={orderBy === 'totalAmount' ? order : 'asc'}
                        onClick={() => handleRequestSort('totalAmount')}
                      >
                        Total Amount
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sortDirection={orderBy === 'bookingStatus' ? order : false}>
                      <TableSortLabel
                        active={orderBy === 'bookingStatus'}
                        direction={orderBy === 'bookingStatus' ? order : 'asc'}
                        onClick={() => handleRequestSort('bookingStatus')}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedBookings.map((booking: Booking) => (
                    <TableRow key={booking.bookingId}>
                      <TableCell>{booking.bookingReference || booking.bookingId.slice(0, 8)}</TableCell>
                      <TableCell>{getCustomerInfo(booking.customerId)}</TableCell>
                      <TableCell>{getRoomInfo(booking.roomId)}</TableCell>
                      <TableCell>{new Date(booking.checkInDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(booking.checkOutDate).toLocaleDateString()}</TableCell>
                      <TableCell>{booking.numberOfGuests}</TableCell>
                      <TableCell>${booking.totalAmount?.toFixed(2) || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={booking.bookingStatus || 'Confirmed'}
                          color={getStatusColor(booking.bookingStatus || 'Confirmed') as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleOpenDialog(booking)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton 
                            size="small" 
                            onClick={() => handleCancel(booking.bookingId)}
                            disabled={booking.bookingStatus === 'Cancelled'}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {bookings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        No bookings found. Click "New Booking" to create your first booking.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={bookings.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </TableContainer>
          </CardContent>
        </Card>

        {/* Add/Edit Booking Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedBooking ? 'Edit Booking' : 'New Booking'}
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Stack spacing={2} mt={1}>
              <Box display="flex" gap={2}>
                <FormControl fullWidth required>
                  <InputLabel>Customer</InputLabel>
                  <Select
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    label="Customer"
                  >
                    {customers.map((customer: Customer) => (
                      <MenuItem key={customer.customerId} value={customer.customerId}>
                        {customer.firstName} {customer.lastName} - {customer.email}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth required>
                  <InputLabel>Room</InputLabel>
                  <Select
                    value={formData.roomId}
                    onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                    label="Room"
                  >
                    {rooms.map((room: Room) => (
                      <MenuItem key={room.roomId} value={room.roomId}>
                        {room.roomNumber} - {room.roomType} (${room.pricePerNight}/night)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box display="flex" gap={2}>
                <TextField
                  label="Check-in Date"
                  type="date"
                  value={formData.checkInDate}
                  onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                  required
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  label="Check-out Date"
                  type="date"
                  value={formData.checkOutDate}
                  onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                  required
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>

              <Box display="flex" gap={2}>
                <TextField
                  label="Number of Guests"
                  type="number"
                  value={formData.numberOfGuests}
                  onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) || 1 })}
                  required
                  fullWidth
                  inputProps={{ min: 1, max: 10 }}
                />

                <FormControl fullWidth>
                  <InputLabel>Recurring Booking</InputLabel>
                  <Select
                    value={formData.isRecurring ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.value === 'true' })}
                    label="Recurring Booking"
                  >
                    <MenuItem value="false">No</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={createBookingMutation.isPending || updateBookingMutation.isPending}
            >
              {createBookingMutation.isPending || updateBookingMutation.isPending 
                ? 'Saving...' 
                : selectedBooking ? 'Update' : 'Create'
              }
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default BookingsPage;
