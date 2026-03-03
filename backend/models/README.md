# Multi-Service Business Platform - Data Models

## Architecture Overview
Each service has isolated models designed for microservices architecture with separate databases.

## Services

### 1. Food Service
- **Food**: Menu items with categories (baked, cooked, drink)
- **Customer**: Customer information with unique email
- **Order**: Order management with status tracking
- **OrderItem**: Line items linking orders to food
- **Payment**: Payment processing with external gateway integration

### 2. Hotel Service
- **Room**: Room inventory with unique room numbers
- **Guest**: Guest information with unique email
- **Booking**: Reservation management
- **HotelPayment**: Booking payment processing

### 3. Real Estate Service
- **Property**: Property listings with types and status
- **Inquiry**: Customer inquiries for properties
- **Agent**: Real estate agents with assigned properties

### 4. Portfolio Service (Gospel Singer)
- **Profile**: Artist profile and biography
- **Media**: Photos, videos, and audio content
- **Event**: Upcoming and past events

## Database Configuration

Each service should connect to its own database:

```javascript
// Food Service
mongoose.connect('mongodb://localhost:27017/food_service');

// Hotel Service
mongoose.connect('mongodb://localhost:27017/hotel_service');

// Real Estate Service
mongoose.connect('mongodb://localhost:27017/realestate_service');

// Portfolio Service
mongoose.connect('mongodb://localhost:27017/portfolio_service');
```

## Key Features
- Timestamps on all models for auditing
- Unique constraints on emails and identifiers
- Enum validations for status fields
- Foreign key references using ObjectId
- Transaction ID storage for payment reconciliation
