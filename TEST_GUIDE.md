# Testing Guide for Order Management System

## Quick Test Procedure

### Test 1: Place an Order

1. Open http://localhost:3000 in your browser
2. Fill in the order form:
   - Customer Name: "John Doe"
   - Item 1: "Cheeseburger", Quantity: 2, Special Instructions: "No onions"
   - Click "+ Add Item"
   - Item 2: "French Fries", Quantity: 1
   - Notes: "Extra ketchup please"
3. Click "Place Order"
4. You should see a green success message

### Test 2: View Order in Kitchen Monitor

1. Open http://localhost:3000/kitchen in a NEW browser tab (keep the first tab open)
2. You should see the order you just placed appear automatically
3. The order should show:
   - Status: "Pending" (yellow)
   - All items listed
   - Special instructions highlighted
   - Timer counting up

### Test 3: Real-Time Updates

1. In the Kitchen Monitor tab, click "Start Preparing" on the order
2. The order status should change to "Preparing" (blue)
3. Click "Mark Ready"
4. Status changes to "Ready" (green)
5. Click "Complete Order"
6. Order should disappear from the active orders list

### Test 4: Real-Time Sync (Multiple Tabs)

1. Keep Kitchen Monitor open in one tab
2. Open http://localhost:3000 in another tab
3. Place a new order
4. Watch the Kitchen Monitor tab - the new order should appear INSTANTLY without refreshing

### Test 5: Multiple Orders

1. Place 3-4 different orders quickly
2. All should appear in the Kitchen Monitor
3. Update their statuses independently
4. Verify each order maintains its own state

### Test 6: API Endpoints (Optional)

Test the REST API directly using curl or a tool like Postman:

**Check server health:**
```bash
curl http://localhost:3001/api/health
```

**Get all orders:**
```bash
curl http://localhost:3001/api/orders
```

**Get active orders:**
```bash
curl http://localhost:3001/api/orders/active
```

**Create an order:**
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "name": "Pizza Margherita",
        "quantity": 1,
        "special_instructions": "Extra cheese"
      }
    ],
    "customer_name": "Test Customer",
    "notes": "Delivery order"
  }'
```

### Test 7: WebSocket Connection

1. Open Kitchen Monitor
2. Check the connection indicator (top right)
3. Should show green dot with "Connected"
4. Stop the backend server (Ctrl+C)
5. Indicator should change to red "Disconnected"
6. Restart the server
7. Should automatically reconnect (green again)

## Expected Results

✅ **Success Indicators:**
- Orders appear in real-time without page refresh
- Status updates sync across all open tabs instantly
- Timer counts up correctly
- All items and instructions display properly
- Connection indicator shows green when connected

❌ **Common Issues:**

**Issue 1: "Connection Refused" or "Failed to fetch"**
- Solution: Make sure backend server is running on port 3001
- Check: `npm run dev:server`

**Issue 2: Orders don't appear in real-time**
- Solution: Check WebSocket connection indicator
- Try refreshing the page
- Check browser console for errors (F12)

**Issue 3: Port already in use**
- Solution: Kill the process or change port in config files
- Find process: `lsof -i :3000` or `lsof -i :3001`

**Issue 4: Blank page or errors**
- Solution: Check browser console (F12)
- Make sure all dependencies are installed
- Try clearing browser cache

## Database Testing

The database file is created at `server/orders.db`

**View database contents:**
```bash
cd server
sqlite3 orders.db "SELECT * FROM orders;"
```

**Reset database (clear all orders):**
```bash
cd server
rm orders.db
# Database will be recreated on next server start
```

## Performance Testing

**Test with multiple simultaneous orders:**

1. Open 3-4 browser tabs with the order placement form
2. Submit orders from all tabs quickly
3. Watch Kitchen Monitor handle all orders smoothly

**Test with long-running session:**

1. Keep Kitchen Monitor open
2. Place orders periodically over 10-15 minutes
3. Verify timer accuracy
4. Check for memory leaks in browser DevTools

## Browser Compatibility

Test in multiple browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari

## Mobile Testing

1. Open http://localhost:3000 on your phone (same network)
2. Use your computer's IP: http://192.168.x.x:3000
3. Test responsive design on mobile devices

## Automated Testing (Future Enhancement)

This would require additional setup:
- Unit tests with Jest/Vitest
- E2E tests with Playwright/Cypress
- API tests with Supertest

## Logs to Monitor

**Backend logs show:**
- Server start message
- Client connections/disconnections
- API requests
- WebSocket events

**Browser console shows:**
- WebSocket connection status
- API calls
- Any errors or warnings
