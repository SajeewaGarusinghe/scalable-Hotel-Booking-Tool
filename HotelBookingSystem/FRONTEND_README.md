# Hotel Booking System - Frontend

A modern React TypeScript frontend application for the Hotel Booking System with Material-UI components and TanStack Query for state management.

## Features

- **Dashboard**: Overview of bookings, rooms, customers, and revenue
- **Room Management**: CRUD operations for hotel rooms
- **Booking Management**: Create, view, update, and cancel bookings
- **Customer Management**: Customer information and history
- **Analytics & Reports**: Weekly reports and pricing predictions
- **Authentication**: Mock authentication system integrated with API Gateway
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

- **React 19** with TypeScript
- **Material-UI (MUI)** for components and theming
- **TanStack Query** for data fetching and caching
- **React Router** for navigation
- **Axios** for HTTP requests
- **Formik** for form handling
- **Yup** for validation
- **Date-fns** for date manipulation

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- API Gateway running on `http://localhost:5000`

## Installation

1. Navigate to the frontend directory:
```bash
cd hotel-booking-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional):
```bash
cp .env.example .env
```

4. Update the API URL in `.env` if needed:
```
REACT_APP_API_URL=http://localhost:5000
```

## Running the Application

1. Start the development server:
```bash
npm start
```

2. Open your browser and navigate to `http://localhost:3000`

3. The application will automatically reload when you make changes.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Common/shared components
│   └── layout/         # Layout components (Header, Sidebar, etc.)
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── RoomsPage.tsx
│   ├── BookingsPage.tsx
│   ├── CustomersPage.tsx
│   └── AnalyticsPage.tsx
├── services/           # API services
│   ├── apiClient.ts
│   ├── authService.ts
│   ├── roomService.ts
│   ├── bookingService.ts
│   ├── customerService.ts
│   └── analyticsService.ts
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx            # Main application component
└── index.tsx          # Application entry point
```

## Available Pages

### Dashboard (`/dashboard`)
- Overview of key metrics
- Quick stats cards
- Recent bookings
- Quick action buttons

### Rooms (`/rooms`)
- View all rooms in a table
- Add new rooms
- Edit existing rooms
- Delete rooms
- Room amenities management

### Bookings (`/bookings`)
- View all bookings
- Create new bookings
- Edit existing bookings
- Cancel bookings
- Date range filters

### Customers (`/customers`)
- View all customers
- Add new customers
- Edit customer information
- Customer search and filtering

### Analytics (`/analytics`)
- Weekly reports
- Revenue analytics
- Price predictions
- Occupancy reports

## API Integration

The frontend communicates with the backend API Gateway at `http://localhost:5000`. The API client includes:

- **Automatic token management**: JWT tokens are automatically attached to requests
- **Error handling**: 401 errors redirect to login
- **Request/Response interceptors**: For logging and error handling

### Mock Authentication

The application uses a mock authentication system for development:

1. Click "Login" on the login page
2. Enter any email and name
3. The system will generate a mock JWT token
4. Token is stored in localStorage and used for API requests

## Development Guidelines

### Code Standards
- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Use Material-UI components consistently
- Implement proper error handling
- Write reusable components

### State Management
- Use TanStack Query for server state
- Use React hooks for local component state
- Use React Context for global app state (auth, theme, etc.)

### API Calls
- All API calls should go through the service layer
- Use TanStack Query for data fetching
- Handle loading and error states properly
- Implement proper cache invalidation

## Building for Production

1. Build the application:
```bash
npm run build
```

2. The build artifacts will be stored in the `build/` directory.

3. You can serve the build locally:
```bash
npm install -g serve
serve -s build
```

## Environment Variables

- `REACT_APP_API_URL`: API Gateway URL (default: http://localhost:5000)

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Quick Start Commands

### Start Frontend Only
```bash
npm start
```

### Start with Backend (Windows)
```bash
# In project root
start-frontend.bat
```

## Troubleshooting

### Common Issues

1. **API Connection Error**
   - Ensure the API Gateway is running on `http://localhost:5000`
   - Check the `REACT_APP_API_URL` environment variable

2. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check browser developer tools for API errors

3. **Build Issues**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

### Development Tips

1. **Hot Reloading**: The development server supports hot reloading
2. **Redux DevTools**: TanStack Query DevTools are enabled in development
3. **Error Boundaries**: Wrap components in error boundaries for better error handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

For backend API documentation, see the main project README.md
