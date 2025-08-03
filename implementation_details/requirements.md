# Coursework: Enterprise Hotel Booking System

### Problem Context

You're scaling the monolithic hotel booking prototype from earlier coursework  to an enterprise-level application. The original system included booking management, special requests, weekly reports, and a chatbot for availability/pricing predictions.

### Functional Requirements

1. **Booking Management**
    - Add, view, update, delete bookings
    - Support one-off and recurring bookings
    - Track check-in/check-out dates, room types
    - Handle special requests per booking
2. **Room Management**
    - CRUD operations for room inventory
    - Room type categorization
    - Availability tracking
3. **Special Requests Management**
    - Link requests to specific bookings
    - Track request status and fulfillment
4. **Reporting System**
    - Weekly view of bookings and requests
    - Generate availability reports
    - Historical booking analysis
    - **Availability and pricing trend prediction** based on booking patterns
    - **Chatbot functionality** for predicting future room availability and pricing
5. **Predictive Analytics (Chatbot)**
    - Predict room availability trends
    - Forecast pricing patterns
    - Based on historical booking data
6. **Web Services** 
    - RESTful endpoints
    - Complete CRUD operations via APIs
    - Service-oriented architecture

### Non-Functional Requirements

1. **Scalability** - Handle enterprise-level load with Horizontal scaling capabilities
2. Microservices architecture for independent scaling
3. **Performance** - Sub-second response times
4. **Reliability** - 99.9% uptime
5. **Security** - Secure API endpoints,(use google auth)
6. **Maintainability** - Modular, decomposed architecture

**Architecture Quality**

- Loose coupling between components
- Service independence
- Fault tolerance and resilience

### Coursework Specific Implementation Requirements

### Task 1 - Architecture Design (40%)

1. **Decomposition Analysis** (1000 words max)
    - Identify 2 functionalities to decompose from the monolithic CW1 application
    - Provide critical review with background research
    - Suggested decomposition candidates:
        - **Booking Service**: Core booking CRUD operations
        - **Analytics/Prediction Service**: Chatbot and reporting functionality
2. **Class Diagram Design**
    - Design classes for enterprise architecture
    - Include service layers, data access layers, DTOs
    - Show relationships between decomposed services
3. **Deployment Diagram**
    - Show component deployment strategy
    - Include web services, databases, client applications
    - Justify deployment decisions

### Task 2 - Architecture Implementation (60%)

1. **Web Services Implementation**
    - Implement REST and/or SOAP endpoints
    - Provide complete CRUD operations for:
        - Bookings
        - Rooms
        - Special Requests
        - Reports
2. **Data Storage Strategy**
    - **Minimum**: XML-based storage
    - Microsoft SQL Server databases ((local or Azure)) ,use a shared database with proper service boundaries for different microservice
    - **Constraint**: No direct database connections from client
    - All data access via web services
3. **Client Application**
    - Modify CW1 desktop/web prototype as needed
    - Maintain all original functionality
    - Integrate with web services instead of direct data access

### Recommended Architecture Components

1. **API Gateway** - Route requests to appropriate services
2. **Booking and room Service** - Handle booking operations and Manage room inventory
3. **Analytics Service** - Reports and predictions
4. **Data Access Layer** - Abstract storage operations
5. **Client Application** - User interface 

### **Technology Stack**

- **Backend**: [ASP.NET](http://asp.net/) Web Services (REST)
- **Data Storage**: Microsoft SQL Server databases ,use a shared database with proper service boundaries for different microservice
- **Frontend**: React.js
- **Communication**: REST APIs with JSON
- **Deployment**: Azure Free tier services (optional)
- **Documentation**: Comprehensive technical documentation

### Key Deliverables

1. Architecture documentation with decomposition analysis
2. Class and deployment diagrams
3. Working enterprise application with web service
4. Comprehensive documentation