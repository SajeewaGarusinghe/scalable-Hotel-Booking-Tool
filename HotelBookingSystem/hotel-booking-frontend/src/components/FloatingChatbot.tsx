import React, { useState, useEffect } from 'react';
import {
  Fab,
  Dialog,
  DialogContent,
  Slide,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Badge,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
  Zoom,
  Collapse,
} from '@mui/material';
import {
  SmartToy as ChatbotIcon,
  Close as CloseIcon,
  Help as HelpIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import PredictiveChatbot from './PredictiveChatbot';
import { useAuth } from '../contexts/AuthContext';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface FloatingChatbotProps {
  className?: string;
}

// Local interface definition to avoid import issues
interface PredictiveChatbotPropsLocal {
  expanded?: boolean;
  onClose?: () => void;
  quickActions?: Array<{
    icon: React.ReactElement;
    label: string;
    color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    query: string;
  }>;
}

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ className }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasNewSuggestions, setHasNewSuggestions] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  // Welcome message logic
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('chatbot-welcome-seen');
    if (!hasSeenWelcome && user) {
      const timer = setTimeout(() => {
        setShowWelcome(true);
        setPulseAnimation(true);
        localStorage.setItem('chatbot-welcome-seen', 'true');
      }, 3000); // Show welcome after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [user]);

  // Hide welcome message after 10 seconds
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  // Periodic pulse animation to attract attention
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOpen && !showWelcome) {
        setPulseAnimation(true);
        setTimeout(() => setPulseAnimation(false), 2000);
      }
    }, 30000); // Pulse every 30 seconds

    return () => clearInterval(interval);
  }, [isOpen, showWelcome]);

  const handleOpen = () => {
    setIsOpen(true);
    setShowWelcome(false);
    setPulseAnimation(false);
    setHasNewSuggestions(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsOpen(false);
  };

  const quickActions = [
    {
      icon: <TrendingIcon />,
      label: 'Price Trends',
      color: 'primary' as const,
      query: 'Show me pricing trends for this week'
    },
    {
      icon: <ScheduleIcon />,
      label: 'Availability',
      color: 'success' as const,
      query: 'Check room availability for tonight'
    },
    {
      icon: <PsychologyIcon />,
      label: 'AI Insights',
      color: 'secondary' as const,
      query: 'What insights do you have about booking patterns?'
    }
  ];

  return (
    <>
      {/* Welcome Tooltip */}
      <Collapse in={showWelcome} timeout={500}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: isMobile ? 100 : 120,
            right: isMobile ? 16 : 24,
            p: 2,
            maxWidth: 280,
            zIndex: 1300,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              right: 20,
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid #667eea',
            }
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <ChatbotIcon />
            <Typography variant="subtitle2" fontWeight="bold">
              Hi {user?.email?.split('@')[0] || 'there'}! 👋
            </Typography>
          </Box>
          <Typography variant="body2" mb={2}>
            I'm your AI hotel assistant. I can help you with pricing trends, availability forecasts, and booking insights!
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {quickActions.map((action, index) => (
              <Chip
                key={index}
                size="small"
                icon={action.icon}
                label={action.label}
                onClick={() => {
                  handleOpen();
                  // TODO: Send quick action query to chatbot
                }}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              />
            ))}
          </Box>
        </Paper>
      </Collapse>

      {/* Floating Action Button */}
      <Zoom in={!isOpen} timeout={300}>
        <Tooltip 
          title={showWelcome ? "" : "Chat with AI Assistant"} 
          placement="left"
          arrow
        >
          <Fab
            color="primary"
            aria-label="ai-chatbot"
            onClick={handleOpen}
            className={className}
            sx={{
              position: 'fixed',
              bottom: isMobile ? 24 : 32,
              right: isMobile ? 16 : 24,
              zIndex: 1200,
              background: pulseAnimation 
                ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              boxShadow: theme.shadows[6],
              animation: pulseAnimation ? 'pulse 1.5s infinite' : 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: theme.shadows[12],
                background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
              '@keyframes pulse': {
                '0%': {
                  transform: 'scale(1)',
                  boxShadow: theme.shadows[6],
                },
                '50%': {
                  transform: 'scale(1.05)',
                  boxShadow: `0 0 20px ${theme.palette.primary.main}50`,
                },
                '100%': {
                  transform: 'scale(1)',
                  boxShadow: theme.shadows[6],
                },
              },
            }}
          >
            <Badge 
              badgeContent={hasNewSuggestions ? '!' : 0} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  animation: hasNewSuggestions ? 'bounce 1s infinite' : 'none',
                  '@keyframes bounce': {
                    '0%, 20%, 53%, 80%, 100%': {
                      transform: 'translate3d(0,0,0)',
                    },
                    '40%, 43%': {
                      transform: 'translate3d(0, -8px, 0)',
                    },
                    '70%': {
                      transform: 'translate3d(0, -4px, 0)',
                    },
                    '90%': {
                      transform: 'translate3d(0, -2px, 0)',
                    },
                  },
                }
              }}
            >
              <ChatbotIcon 
                sx={{ 
                  fontSize: 28,
                  transition: 'transform 0.2s',
                  transform: pulseAnimation ? 'rotate(10deg)' : 'rotate(0deg)',
                }} 
              />
            </Badge>
          </Fab>
        </Tooltip>
      </Zoom>

      {/* Minimized Chat Indicator */}
      {isMinimized && (
        <Zoom in={isMinimized} timeout={300}>
          <Paper
            elevation={4}
            onClick={() => setIsOpen(true)}
            sx={{
              position: 'fixed',
              bottom: isMobile ? 24 : 32,
              right: isMobile ? 80 : 104,
              p: 1,
              zIndex: 1200,
              cursor: 'pointer',
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: theme.shadows[8],
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <ChatbotIcon sx={{ fontSize: 20 }} />
              <Typography variant="caption" fontWeight="bold">
                AI Assistant
              </Typography>
            </Box>
          </Paper>
        </Zoom>
      )}

      {/* Chat Dialog */}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            maxHeight: isMobile ? '100vh' : '80vh',
            background: 'linear-gradient(to bottom, #fafafa 0%, #ffffff 100%)',
            boxShadow: theme.shadows[24],
          }
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
          }
        }}
      >
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: isMobile ? 0 : '12px 12px 0 0',
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'glow 2s ease-in-out infinite alternate',
                '@keyframes glow': {
                  '0%': {
                    boxShadow: '0 0 5px rgba(255, 255, 255, 0.3)',
                  },
                  '100%': {
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.6)',
                  },
                },
              }}
            >
              <ChatbotIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                AI Hotel Assistant
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Your intelligent booking companion
              </Typography>
            </Box>
          </Box>
          <Box>
            {!isMobile && (
              <Tooltip title="Minimize">
                <IconButton 
                  size="small" 
                  onClick={handleMinimize}
                  sx={{ 
                    color: 'white', 
                    mr: 1,
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Close">
              <IconButton 
                size="small" 
                onClick={handleClose}
                sx={{ 
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 0, height: '100%' }}>
          {React.createElement(PredictiveChatbot as React.ComponentType<PredictiveChatbotPropsLocal>, {
            expanded: true,
            onClose: handleClose,
            quickActions: quickActions
          })}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingChatbot;
