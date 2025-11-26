# Order Management System

A modern web application for restaurant order placement and kitchen monitoring with real-time updates.

## Features

### Order Placement Interface
- User-friendly order form
- Add multiple items with quantities
- Special instructions for each item
- Order notes for the kitchen
- Responsive design for all devices

### Kitchen Monitor Dashboard
- Real-time order updates via WebSocket
- Visual status tracking (Pending → Preparing → Ready → Completed)
- Order timer showing elapsed time
- Item-by-item breakdown with special instructions
- Dark theme optimized for kitchen displays

### Technical Features
- **Real-time updates** using Socket.io WebSockets
- **TypeScript** for type safety
- **React** with modern hooks
- **Tailwind CSS** for styling
- **Express.js** REST API
- **SQLite** database for persistence

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- Socket.io for WebSocket communication
- Better-SQLite3 for database
- CORS enabled

### Frontend
- React 18
- TypeScript
- Vite for fast development
- React Router for navigation
- Tailwind CSS for styling
- Socket.io client

## Project Structure

```
order-management-system/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── OrderPlacement.tsx
│   │   │   └── KitchenMonitor.tsx
│   │   ├── hooks/         # Custom React hooks
│   │   │   └── useSocket.ts
│   │   ├── App.tsx        # Main app component
│   │   ├── api.ts         # API client functions
│   │   ├── types.ts       # TypeScript types
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── server/                # Backend Express server
│   ├── src/
│   │   ├── database.ts    # Database schema and queries
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── package.json           # Root package.json
```

## Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd order-management-system
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (root, server, and client)
   npm run install:all
   ```

   Or install individually:
   ```bash
   # Root dependencies
   npm install

   # Server dependencies
   cd server && npm install && cd ..

   # Client dependencies
   cd client && npm install && cd ..
   ```

## Running the Application

### Development Mode (Recommended)

Run both server and client concurrently:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend dev server on `http://localhost:3000`

### Run Separately

**Backend only:**
```bash
npm run dev:server
```

**Frontend only:**
```bash
npm run dev:client
```

### Production Build

1. **Build both frontend and backend:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

   Note: In production, you'll need to serve the built frontend separately or configure Express to serve static files.

## Usage

### Order Placement

1. Navigate to `http://localhost:3000`
2. Fill in customer name (optional)
3. Add order items:
   - Item name (required)
   - Quantity (required)
   - Special instructions (optional)
4. Add multiple items using the "+ Add Item" button
5. Add order notes if needed
6. Click "Place Order"

### Kitchen Monitor

1. Navigate to `http://localhost:3000/kitchen`
2. View all active orders in real-time
3. Update order status:
   - **Pending** → Click "Start Preparing"
   - **Preparing** → Click "Mark Ready"
   - **Ready** → Click "Complete Order"
4. Orders automatically disappear when completed

## API Endpoints

### REST API

- `GET /api/health` - Health check
- `GET /api/orders` - Get all orders
- `GET /api/orders/active` - Get active orders (pending, preparing, ready)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

### WebSocket Events

**Server → Client:**
- `orders:initial` - Initial orders on connection
- `order:created` - New order created
- `order:updated` - Order status updated
- `order:deleted` - Order deleted

## Database

The application uses SQLite with a single `orders` table:

```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  items TEXT NOT NULL,           -- JSON array of items
  customer_name TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending', -- pending|preparing|ready|completed
  created_at INTEGER,
  updated_at INTEGER
)
```

Database file: `server/orders.db`

## Configuration

### Server Port
Default: `3001`

Change in `server/src/index.ts`:
```typescript
const PORT = process.env.PORT || 3001;
```

### Frontend Dev Port
Default: `3000`

Change in `client/vite.config.ts`:
```typescript
server: {
  port: 3000,
}
```

### WebSocket URL
Default: `http://localhost:3001`

Change in `client/src/hooks/useSocket.ts`:
```typescript
const SOCKET_URL = 'http://localhost:3001';
```

## Development

### Adding New Features

1. **Backend:** Add routes in `server/src/index.ts` and database queries in `server/src/database.ts`
2. **Frontend:** Create components in `client/src/pages/` or `client/src/components/`
3. **Types:** Update shared types in `client/src/types.ts` and `server/src/database.ts`

### Code Style

- TypeScript strict mode enabled
- ESLint and Prettier recommended
- Use functional components with hooks in React
- Follow RESTful API conventions

## Troubleshooting

### Port Already in Use
If port 3000 or 3001 is already in use:
- Change the port in configuration files
- Or kill the process using the port

### WebSocket Connection Issues
- Ensure backend server is running
- Check CORS settings in `server/src/index.ts`
- Verify WebSocket URL in `client/src/hooks/useSocket.ts`

### Database Errors
- Delete `server/orders.db` to reset the database
- Database will be recreated automatically on server start

## Future Enhancements

- [ ] User authentication
- [ ] Order history and analytics
- [ ] Print receipt functionality
- [ ] Multiple kitchen stations
- [ ] Order prioritization
- [ ] Sound notifications
- [ ] Mobile app
- [ ] Payment integration

## License

MIT

## Author

Built with Claude Code
