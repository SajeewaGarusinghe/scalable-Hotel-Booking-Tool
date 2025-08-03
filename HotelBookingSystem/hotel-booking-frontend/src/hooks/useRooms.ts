import { useState, useEffect } from 'react';
import { Room } from '../types/room';
import { RoomService } from '../services/roomService';

interface UseRoomsOptions {
  autoFetch?: boolean;
  filters?: {
    roomType?: string;
    activeOnly?: boolean;
  };
}

export const useRooms = (options: UseRoomsOptions = {}) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { autoFetch = true, filters } = options;

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let roomsData: Room[];
      
      if (filters?.activeOnly) {
        // Filter active rooms from all rooms since we don't have a separate endpoint
        const allRooms = await RoomService.getAllRooms();
        roomsData = allRooms.filter(room => room.isActive);
      } else if (filters?.roomType) {
        roomsData = await RoomService.getRoomsByType(filters.roomType);
      } else {
        roomsData = await RoomService.getAllRooms();
      }
      
      setRooms(roomsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const getRoomById = async (roomId: string): Promise<Room | null> => {
    try {
      const room = await RoomService.getRoomById(parseInt(roomId));
      return room;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch room');
      return null;
    }
  };

  const createRoom = async (roomData: any): Promise<Room | null> => {
    try {
      const newRoom = await RoomService.createRoom(roomData);
      setRooms(prev => [...prev, newRoom]);
      return newRoom;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room');
      return null;
    }
  };

  const updateRoom = async (roomId: string, roomData: any): Promise<Room | null> => {
    try {
      const updatedRoom = await RoomService.updateRoom(parseInt(roomId), roomData);
      setRooms(prev => prev.map(room => 
        room.roomId === roomId ? updatedRoom : room
      ));
      return updatedRoom;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update room');
      return null;
    }
  };

  const deleteRoom = async (roomId: string): Promise<boolean> => {
    try {
      await RoomService.deleteRoom(parseInt(roomId));
      setRooms(prev => prev.filter(room => room.roomId !== roomId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete room');
      return false;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchRooms();
    }
  }, [autoFetch, filters?.roomType, filters?.activeOnly]);

  return {
    rooms,
    loading,
    error,
    refetch: fetchRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
  };
};
