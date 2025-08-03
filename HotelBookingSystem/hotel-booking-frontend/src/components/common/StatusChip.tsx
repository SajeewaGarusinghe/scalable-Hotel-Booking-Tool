import React from 'react';
import { 
  Chip, 
  ChipProps 
} from '@mui/material';
import { getStatusColor } from '../../utils/formatters';

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, ...props }) => {
  const color = getStatusColor(status);
  
  return (
    <Chip
      label={status}
      sx={{
        backgroundColor: color,
        color: 'white',
        fontWeight: 'bold',
        ...props.sx,
      }}
      {...props}
    />
  );
};

export default StatusChip;
