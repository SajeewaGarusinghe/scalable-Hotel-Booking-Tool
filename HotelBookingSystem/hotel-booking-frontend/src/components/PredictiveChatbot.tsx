import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  IconButton,
  Typography,
  Paper,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Tooltip,
  Stack
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  TrendingUp as TrendingIcon,
  AccessTime as TimeIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon
} from '@mui/icons-material';

import { EnhancedAnalyticsService } from '../services/enhancedAnalyticsService';
import { 
  ChatbotMessage, 
  ChatbotSuggestion, 
  PredictiveChatbotData,
  ChatbotQuery
} from '../types/chatbot';
import { useAuth } from '../contexts/AuthContext';

interface PredictiveChatbotProps {
  onClose?: () => void;
  expanded?: boolean;
}

export const PredictiveChatbot: React.FC<PredictiveChatbotProps> = ({ 
  onClose, 
  expanded = false 
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `chatbot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [suggestions, setSuggestions] = useState<ChatbotSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with welcome message and suggestions
    const welcomeMessage: ChatbotMessage = {
      id: 'welcome',
      type: 'bot',
      content: `Hello${user?.email ? ` ${user.email.split('@')[0]}` : ''}! 👋 I'm your AI hotel assistant. I can help you with:\n\n• Predicting room availability for specific dates\n• Analyzing pricing trends\n• Forecasting demand patterns\n• Providing booking recommendations\n\nWhat would you like to know about?`,
      timestamp: new Date()
    };

    const initialSuggestions: ChatbotSuggestion[] = [
      {
        text: 'Check availability for next weekend',
        type: 'quick_question'
      },
      {
        text: 'Show me pricing trends for the next 30 days',
        type: 'quick_question'
      },
      {
        text: 'What is the demand forecast for luxury rooms?',
        type: 'quick_question'
      }
    ];

    setMessages([welcomeMessage]);
    setSuggestions(initialSuggestions);
  }, [user]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatbotMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const query: ChatbotQuery = {
        query: inputValue.trim(),
        sessionId,
        customerId: user?.id || undefined
      };

      const response = await EnhancedAnalyticsService.queryChatbot(query);

      const botMessage: ChatbotMessage = {
        id: `bot_${Date.now()}`,
        type: 'bot',
        content: response.response,
        timestamp: new Date(),
        data: response.data,
        suggestions: response.suggestions,
        processingTimeMs: response.processingTimeMs
      };

      setMessages(prev => [...prev, botMessage]);
      
      if (response.suggestions && response.suggestions.length > 0) {
        const chatbotSuggestions: ChatbotSuggestion[] = response.suggestions.map((suggestion, index) => ({
          text: suggestion,
          type: 'follow_up' as const
        }));
        setSuggestions(chatbotSuggestions);
      }
    } catch (error) {
      console.error('Chatbot query failed:', error);
      setError('Sorry, I encountered an error. Please try again.');
      
      const errorMessage: ChatbotMessage = {
        id: `error_${Date.now()}`,
        type: 'bot',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: ChatbotSuggestion) => {
    setInputValue(suggestion.text);
    // Automatically send the suggestion
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleFeedback = async (messageId: string, isPositive: boolean) => {
    try {
      await EnhancedAnalyticsService.submitChatbotFeedback(
        messageId,
        isPositive ? 5 : 1
      );
      
      // Update message to show feedback was submitted
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, feedbackSubmitted: true }
          : msg
      ));
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const handleRefresh = () => {
    setMessages([]);
    setSuggestions([]);
    setError(null);
    
    // Re-initialize
    const welcomeMessage: ChatbotMessage = {
      id: 'welcome_refresh',
      type: 'bot',
      content: `Hello! 👋 I'm your AI hotel assistant. What would you like to know about?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const renderPriceData = (data: PredictiveChatbotData) => {
    if (!data.pricePredictions || data.pricePredictions.length === 0) return null;

    return (
      <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Price Prediction Analysis
        </Typography>
        <Stack spacing={2}>
          {data.pricePredictions.slice(0, 3).map((prediction, index) => (
            <Paper key={index} sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {new Date(prediction.predictionDate).toLocaleDateString()}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${prediction.predictedPrice.toFixed(2)}
                </Typography>
                {prediction.confidenceLevel && (
                  <Typography variant="caption" color="text.secondary">
                    {(prediction.confidenceLevel * 100).toFixed(1)}% confidence
                  </Typography>
                )}
              </Box>
            </Paper>
          ))}
        </Stack>
      </Box>
    );
  };

  const renderAvailabilityData = (data: PredictiveChatbotData) => {
    if (!data.availabilityForecasts || data.availabilityForecasts.length === 0) return null;

    return (
      <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Availability Forecast for {data.roomType} Rooms
        </Typography>
        <Stack spacing={2}>
          {data.availabilityForecasts.slice(0, 4).map((forecast, index) => (
            <Paper key={index} sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {new Date(forecast.forecastDate).toLocaleDateString()}
                </Typography>
                <Box display="flex" gap={2}>
                  <Chip 
                    label={`${forecast.predictedAvailableRooms} Available`} 
                    color="success" 
                    variant="outlined" 
                  />
                  <Chip 
                    label={`${forecast.totalRooms - forecast.predictedAvailableRooms} Occupied`} 
                    color="error" 
                    variant="outlined" 
                  />
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      </Box>
    );
  };

  const renderTrendData = (data: PredictiveChatbotData) => {
    if (!data.trendAnalysis) return null;

    return (
      <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Trend Analysis for {data.trendAnalysis.roomType} Rooms
        </Typography>
        <Stack spacing={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <TrendingIcon color="primary" />
            <Typography>
              Trend Direction: <strong>{data.trendAnalysis.trendDirection}</strong>
            </Typography>
          </Box>
          {data.trendAnalysis.insights.map((insight, index) => (
            <Typography key={index} variant="body2" color="text.secondary">
              • {insight}
            </Typography>
          ))}
        </Stack>
      </Box>
    );
  };

  return (
    <Card sx={{ height: expanded ? '80vh' : '600px', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 2, pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <BotIcon color="primary" />
            <Typography variant="h6">AI Hotel Assistant</Typography>
          </Box>
          <Box>
            <Tooltip title="Refresh chat">
              <IconButton size="small" onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            {onClose && (
              <Tooltip title="Close chat">
                <IconButton size="small" onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>

      <Divider />

      {error && (
        <Alert severity="error" sx={{ m: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Messages Area */}
      <Box 
        sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column',
          gap: 2
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.type === 'bot' ? 'flex-start' : 'flex-end',
              alignItems: 'flex-start',
              gap: 1
            }}
          >
            {message.type === 'bot' && (
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                <BotIcon fontSize="small" />
              </Avatar>
            )}
            
            <Box sx={{ maxWidth: '70%' }}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: message.type === 'bot' ? 'grey.100' : 'primary.main',
                  color: message.type === 'bot' ? 'text.primary' : 'primary.contrastText'
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.content}
                </Typography>
                
                {message.processingTimeMs && (
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Response time: {message.processingTimeMs}ms
                    </Typography>
                  </Box>
                )}
              </Paper>

              {/* Render data visualizations */}
              {message.data && (
                <>
                  {renderPriceData(message.data)}
                  {renderAvailabilityData(message.data)}
                  {renderTrendData(message.data)}
                </>
              )}

              {/* Feedback buttons for bot messages */}
              {message.type === 'bot' && !((message as any).feedbackSubmitted) && (
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Tooltip title="Helpful">
                    <IconButton 
                      size="small" 
                      onClick={() => handleFeedback(message.id, true)}
                    >
                      <ThumbUpIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Not helpful">
                    <IconButton 
                      size="small" 
                      onClick={() => handleFeedback(message.id, false)}
                    >
                      <ThumbDownIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                <TimeIcon fontSize="inherit" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>

            {message.type === 'user' && (
              <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                <PersonIcon fontSize="small" />
              </Avatar>
            )}
          </Box>
        ))}

        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
              <BotIcon fontSize="small" />
            </Avatar>
            <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  Analyzing your request...
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Box sx={{ p: 2, pt: 0 }}>
          <Typography variant="subtitle2" gutterBottom>
            Suggested queries:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion.text}
                onClick={() => handleSuggestionClick(suggestion)}
                variant="outlined"
                size="small"
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Stack>
        </Box>
      )}

      <Divider />

      {/* Input Area */}
      <CardContent sx={{ pt: 2 }}>
        <Box display="flex" gap={1}>
          <TextField
            fullWidth
            placeholder="Ask about room availability, pricing trends, or get booking recommendations..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            size="small"
            multiline
            maxRows={3}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            color="primary"
            sx={{ alignSelf: 'flex-end' }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PredictiveChatbot;
