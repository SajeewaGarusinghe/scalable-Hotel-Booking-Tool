import React from 'react';
import { 
  Box, 
  Chip, 
  Tooltip, 
  useTheme, 
  alpha,
  keyframes,
} from '@mui/material';
import { 
  Circle, 
  Wifi, 
  WifiOff,
  Cloud,
  CloudOff,
} from '@mui/icons-material';

type StatusType = 'online' | 'offline' | 'connecting' | 'error';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  size?: 'small' | 'medium';
  showIcon?: boolean;
  showLabel?: boolean;
  animated?: boolean;
}

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
`;

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  size = 'small',
  showIcon = true,
  showLabel = true,
  animated = true,
}) => {
  const theme = useTheme();

  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          color: theme.palette.success.main,
          bgColor: alpha(theme.palette.success.main, 0.1),
          icon: <Wifi sx={{ fontSize: 16 }} />,
          text: label || 'Online',
          tooltip: 'System is online and functioning normally',
        };
      case 'offline':
        return {
          color: theme.palette.error.main,
          bgColor: alpha(theme.palette.error.main, 0.1),
          icon: <WifiOff sx={{ fontSize: 16 }} />,
          text: label || 'Offline',
          tooltip: 'System is currently offline',
        };
      case 'connecting':
        return {
          color: theme.palette.warning.main,
          bgColor: alpha(theme.palette.warning.main, 0.1),
          icon: <Cloud sx={{ fontSize: 16 }} />,
          text: label || 'Connecting',
          tooltip: 'Attempting to connect to the system',
        };
      case 'error':
        return {
          color: theme.palette.error.main,
          bgColor: alpha(theme.palette.error.main, 0.1),
          icon: <CloudOff sx={{ fontSize: 16 }} />,
          text: label || 'Error',
          tooltip: 'System error detected',
        };
      default:
        return {
          color: theme.palette.grey[500],
          bgColor: alpha(theme.palette.grey[500], 0.1),
          icon: <Circle sx={{ fontSize: 16 }} />,
          text: 'Unknown',
          tooltip: 'Unknown status',
        };
    }
  };

  const config = getStatusConfig();

  const StatusDot = (
    <Box
      sx={{
        width: size === 'small' ? 8 : 12,
        height: size === 'small' ? 8 : 12,
        borderRadius: '50%',
        bgcolor: config.color,
        animation: 
          animated && status === 'online' 
            ? `${pulse} 2s infinite` 
            : status === 'connecting' 
            ? `${pulse} 1s infinite` 
            : 'none',
      }}
    />
  );

  if (!showIcon && !showLabel) {
    return (
      <Tooltip title={config.tooltip} arrow>
        {StatusDot}
      </Tooltip>
    );
  }

  return (
    <Tooltip title={config.tooltip} arrow>
      <Chip
        icon={showIcon ? config.icon : undefined}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {StatusDot}
            {showLabel && (
              <Box component="span" sx={{ ml: 0.5 }}>
                {config.text}
              </Box>
            )}
          </Box>
        }
        size={size}
        variant="outlined"
        sx={{
          bgcolor: config.bgColor,
          borderColor: config.color,
          color: config.color,
          fontWeight: 500,
          '& .MuiChip-icon': {
            color: config.color,
          },
          '&:hover': {
            bgcolor: alpha(config.color, 0.15),
          },
        }}
      />
    </Tooltip>
  );
};

export default StatusIndicator;
