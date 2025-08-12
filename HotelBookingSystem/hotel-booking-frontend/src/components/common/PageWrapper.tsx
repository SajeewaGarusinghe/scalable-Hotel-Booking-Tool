import React, { ReactNode } from 'react';
import { Box, Typography, Breadcrumbs, Link, Paper, Fade } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { NavigateNext } from '@mui/icons-material';

interface PageWrapperProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  showBreadcrumbs?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  subtitle,
  action,
  children,
  showBreadcrumbs = true,
  maxWidth = 'xl'
}) => {
  const location = useLocation();

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    return (
      <Breadcrumbs 
        separator={<NavigateNext fontSize="small" />}
        sx={{ mb: 2 }}
      >
        <Link
          component={RouterLink}
          to="/dashboard"
          color="text.secondary"
          sx={{ 
            textDecoration: 'none',
            '&:hover': { color: 'primary.main' },
            fontSize: '0.875rem',
            fontWeight: 500
          }}
        >
          Dashboard
        </Link>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = name.charAt(0).toUpperCase() + name.slice(1);

          return isLast ? (
            <Typography 
              key={name} 
              color="text.primary" 
              sx={{ 
                fontSize: '0.875rem',
                fontWeight: 600 
              }}
            >
              {displayName}
            </Typography>
          ) : (
            <Link
              key={name}
              component={RouterLink}
              to={routeTo}
              color="text.secondary"
              sx={{ 
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              {displayName}
            </Link>
          );
        })}
      </Breadcrumbs>
    );
  };

  return (
    <Fade in={true} timeout={300}>
      <Box sx={{ width: '100%' }}>
        {/* Page Header */}
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, sm: 4 },
            mb: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          {showBreadcrumbs && generateBreadcrumbs()}
          
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}
          >
            <Box>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: { xs: '1.75rem', sm: '2.125rem' },
                  mb: subtitle ? 1 : 0
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                  sx={{ 
                    fontWeight: 400,
                    fontSize: { xs: '1rem', sm: '1.125rem' }
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
            
            {action && (
              <Box sx={{ flexShrink: 0 }}>
                {action}
              </Box>
            )}
          </Box>
        </Paper>

        {/* Page Content */}
        <Box sx={{ ...(maxWidth && { maxWidth: `${maxWidth}` }) }}>
          {children}
        </Box>
      </Box>
    </Fade>
  );
};

export default PageWrapper;
