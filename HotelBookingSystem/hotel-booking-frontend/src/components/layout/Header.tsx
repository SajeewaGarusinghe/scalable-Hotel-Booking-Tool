import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Hotel,
  Notifications,
  Settings,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../utils/formatters';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'grey.200',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, height: 70 }}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuToggle}
          sx={{ 
            mr: 2,
            '&:hover': {
              bgcolor: 'grey.100',
            }
          }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Hotel sx={{ mr: 1.5, fontSize: 32, color: 'primary.main' }} />
          <Box>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                color: 'primary.main',
                fontSize: '1.3rem',
                letterSpacing: '-0.02em'
              }}
            >
              Hotel Booking
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                lineHeight: 1
              }}
            >
              Management System
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label="Online"
              size="small"
              color="success"
              variant="outlined"
              sx={{ 
                display: { xs: 'none', sm: 'flex' },
                borderRadius: 6,
                height: 24,
                fontSize: '0.75rem',
                fontWeight: 500
              }}
            />

            <IconButton
              size="large"
              color="inherit"
              sx={{ 
                display: { xs: 'none', sm: 'flex' },
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              <Notifications />
            </IconButton>

            <Box 
              sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                alignItems: 'center', 
                gap: 1,
                mr: 1
              }}
            >
              <Box sx={{ textAlign: 'right' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                    lineHeight: 1.2
                  }}
                >
                  {user.name.split(' ')[0]} {user.name.split(' ')[1]?.[0]}.
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.75rem'
                  }}
                >
                  Administrator
                </Typography>
              </Box>
            </Box>
            
            <Tooltip title="Account settings">
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{
                  p: 0.5,
                  '&:hover': {
                    bgcolor: 'transparent',
                    '& .MuiAvatar-root': {
                      boxShadow: '0 0 0 2px #60a5fa',
                    }
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 44, 
                    height: 44, 
                    fontSize: 16,
                    fontWeight: 600,
                    bgcolor: 'primary.main',
                    transition: 'all 0.2s ease-in-out',
                    border: '2px solid',
                    borderColor: 'grey.200'
                  }}
                  src={undefined}
                >
                  {getInitials(user.name)}
                </Avatar>
              </IconButton>
            </Tooltip>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: 2,
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  border: '1px solid',
                  borderColor: 'grey.200',
                }
              }}
            >
              <MenuItem 
                onClick={handleClose}
                sx={{ 
                  gap: 1.5, 
                  py: 1.5,
                  '&:hover': { bgcolor: 'grey.50' }
                }}
              >
                <AccountCircle sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" fontWeight={500}>Profile</Typography>
                  <Typography variant="caption" color="text.secondary">
                    View and edit profile
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem 
                onClick={handleClose}
                sx={{ 
                  gap: 1.5, 
                  py: 1.5,
                  '&:hover': { bgcolor: 'grey.50' }
                }}
              >
                <Settings sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" fontWeight={500}>Settings</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Preferences & privacy
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem 
                onClick={handleLogout}
                sx={{ 
                  gap: 1.5, 
                  py: 1.5,
                  color: 'error.main',
                  '&:hover': { bgcolor: 'error.50' }
                }}
              >
                <Logout sx={{ fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" fontWeight={500}>Logout</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Sign out of your account
                  </Typography>
                </Box>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
