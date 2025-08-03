import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RoomService } from '../services/roomService';
import { Room, CreateRoomDto, UpdateRoomDto } from '../types/room';

const RoomsPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<CreateRoomDto>({
    roomNumber: '',
    roomType: '',
    maxOccupancy: 1,
    pricePerNight: 0,
    description: '',
    amenities: [],
    isActive: true,
  });
  const [error, setError] = useState<string>('');

  const queryClient = useQueryClient();

  // Fetch rooms
  const { data: rooms = [], isLoading, error: fetchError } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => RoomService.getAllRooms(),
  });

  // Create room mutation
  const createRoomMutation = useMutation({
    mutationFn: (roomData: CreateRoomDto) => RoomService.createRoom(roomData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      handleCloseDialog();
      setError('');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to create room');
    },
  });

  // Update room mutation
  const updateRoomMutation = useMutation({
    mutationFn: ({ roomId, roomData }: { roomId: string; roomData: UpdateRoomDto }) =>
      RoomService.updateRoom(parseInt(roomId), roomData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      handleCloseDialog();
      setError('');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to update room');
    },
  });

  // Delete room mutation
  const deleteRoomMutation = useMutation({
    mutationFn: (roomId: string) => RoomService.deleteRoom(parseInt(roomId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to delete room');
    },
  });

  const handleOpenDialog = (room?: Room) => {
    if (room) {
      setSelectedRoom(room);
      setFormData({
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        maxOccupancy: room.maxOccupancy,
        pricePerNight: room.pricePerNight,
        description: room.description || '',
        amenities: parseAmenities(room.amenities),
        isActive: room.isActive,
      });
    } else {
      setSelectedRoom(null);
      setFormData({
        roomNumber: '',
        roomType: '',
        maxOccupancy: 1,
        pricePerNight: 0,
        description: '',
        amenities: [],
        isActive: true,
      });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoom(null);
    setError('');
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.roomNumber.trim()) {
      setError('Room number is required');
      return;
    }
    if (!formData.roomType.trim()) {
      setError('Room type is required');
      return;
    }
    if (formData.maxOccupancy < 1) {
      setError('Max occupancy must be at least 1');
      return;
    }
    if (formData.pricePerNight <= 0) {
      setError('Price per night must be greater than 0');
      return;
    }

    if (selectedRoom) {
      // For updates, create UpdateRoomDto without roomId
      const updateData: UpdateRoomDto = {
        roomNumber: formData.roomNumber,
        roomType: formData.roomType,
        maxOccupancy: formData.maxOccupancy,
        pricePerNight: formData.pricePerNight,
        description: formData.description,
        amenities: formData.amenities,
        isActive: formData.isActive,
      };
      
      updateRoomMutation.mutate({
        roomId: selectedRoom.roomId,
        roomData: updateData,
      });
    } else {
      createRoomMutation.mutate(formData);
    }
  };

  const handleDelete = (roomId: string) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      deleteRoomMutation.mutate(roomId);
    }
  };

  const parseAmenities = (amenities: string[] | string | null | undefined): string[] => {
    if (!amenities) return [];
    if (Array.isArray(amenities)) return amenities;
    if (typeof amenities === 'string') {
      try {
        // Try to parse as JSON first
        const parsed = JSON.parse(amenities);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // If JSON parsing fails, split by comma
        return amenities.split(',').map(a => a.trim()).filter(a => a);
      }
    }
    return [];
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading rooms...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Room Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Room
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
                  <TableCell>Room Number</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Max Occupancy</TableCell>
                  <TableCell>Price/Night</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Amenities</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms.map((room: Room) => (
                  <TableRow key={room.roomId}>
                    <TableCell>{room.roomNumber}</TableCell>
                    <TableCell>{room.roomType}</TableCell>
                    <TableCell>{room.maxOccupancy}</TableCell>
                    <TableCell>${room.pricePerNight.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={room.isActive ? 'Active' : 'Inactive'}
                        color={room.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {parseAmenities(room.amenities).slice(0, 3).map((amenity, index) => (
                          <Chip key={index} label={amenity} size="small" variant="outlined" />
                        ))}
                        {parseAmenities(room.amenities).length > 3 && (
                          <Chip label={`+${parseAmenities(room.amenities).length - 3}`} size="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleOpenDialog(room)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDelete(room.roomId)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {rooms.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No rooms found. Click "Add Room" to create your first room.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Room Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRoom ? 'Edit Room' : 'Add New Room'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Room Number"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              required
              fullWidth
            />
            
            <FormControl fullWidth required>
              <InputLabel>Room Type</InputLabel>
              <Select
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                label="Room Type"
              >
                <MenuItem value="Standard">Standard</MenuItem>
                <MenuItem value="Deluxe">Deluxe</MenuItem>
                <MenuItem value="Suite">Suite</MenuItem>
                <MenuItem value="Presidential Suite">Presidential Suite</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Max Occupancy"
              type="number"
              value={formData.maxOccupancy}
              onChange={(e) => setFormData({ ...formData, maxOccupancy: parseInt(e.target.value) || 1 })}
              required
              fullWidth
              inputProps={{ min: 1, max: 10 }}
            />

            <TextField
              label="Price per Night"
              type="number"
              value={formData.pricePerNight}
              onChange={(e) => setFormData({ ...formData, pricePerNight: parseFloat(e.target.value) || 0 })}
              required
              fullWidth
              inputProps={{ step: '0.01', min: '0' }}
            />

            <TextField
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
            />

            <TextField
              label="Amenities (comma-separated)"
              value={Array.isArray(formData.amenities) ? formData.amenities.join(', ') : ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                amenities: e.target.value.split(',').map(a => a.trim()).filter(a => a) 
              })}
              fullWidth
              placeholder="WiFi, Air Conditioning, TV"
              helperText="Enter amenities separated by commas"
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.isActive ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                label="Status"
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={createRoomMutation.isPending || updateRoomMutation.isPending}
          >
            {createRoomMutation.isPending || updateRoomMutation.isPending 
              ? 'Saving...' 
              : selectedRoom ? 'Update' : 'Create'
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomsPage;
