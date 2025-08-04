import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import {
  Hotel,
  Email,
  Phone,
  LocationOn,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from '@mui/icons-material';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.dark',
        color: 'white',
        pt: 4,
        pb: 2,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
            mb: 3,
          }}
        >
          {/* Company Info */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Hotel sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" component="div" fontWeight="bold">
                Hotel Booking System
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Experience luxury and comfort with our world-class hotel booking platform. 
              We provide exceptional service and unforgettable stays.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                color="inherit"
                size="small"
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                color="inherit"
                size="small"
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                color="inherit"
                size="small"
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                color="inherit"
                size="small"
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                <LinkedIn />
              </IconButton>
            </Stack>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link
                href="/dashboard"
                color="inherit"
                underline="hover"
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Dashboard
              </Link>
              <Link
                href="/rooms"
                color="inherit"
                underline="hover"
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Rooms
              </Link>
              <Link
                href="/bookings"
                color="inherit"
                underline="hover"
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Bookings
              </Link>
              <Link
                href="/customers"
                color="inherit"
                underline="hover"
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Customers
              </Link>
              <Link
                href="/analytics"
                color="inherit"
                underline="hover"
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Analytics
              </Link>
            </Stack>
          </Box>

          {/* Contact Info */}
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contact Us
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  123 Hotel Street, City, State 12345
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  info@hotelbooking.com
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {currentYear} Hotel Booking System. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              variant="body2"
              sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              variant="body2"
              sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              variant="body2"
              sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
            >
              Support
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
