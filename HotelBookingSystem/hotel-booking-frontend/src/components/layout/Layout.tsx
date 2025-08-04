import React, { useState, ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { ToastProvider } from '../common/ToastProvider';
import { FloatingChatbot } from '../index';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <ToastProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header onMenuToggle={handleSidebarToggle} />
        <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
        
        <Box sx={{ flex: 1, bgcolor: 'background.default' }}>
          <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, minHeight: 'calc(100vh - 200px)' }}>
            {children}
          </Container>
        </Box>

        <Footer />
        
        {/* Global Floating Chatbot - Accessible on every page */}
        <FloatingChatbot />
      </Box>
    </ToastProvider>
  );
};

export default Layout;
