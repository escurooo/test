#!/bin/bash

echo "=========================================="
echo "Testing Order Management System API"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if server is running
echo "1. Checking server health..."
HEALTH=$(curl -s http://localhost:3001/api/health)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Server is running${NC}"
    echo "   Response: $HEALTH"
else
    echo -e "${RED}✗ Server is not running${NC}"
    echo "   Please start the server first: npm run dev:server"
    exit 1
fi

echo ""
echo "2. Creating a test order..."
ORDER=$(curl -s -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "name": "Test Burger",
        "quantity": 2,
        "special_instructions": "Well done"
      },
      {
        "name": "Fries",
        "quantity": 1
      }
    ],
    "customer_name": "API Test Customer",
    "notes": "This is a test order"
  }')

ORDER_ID=$(echo $ORDER | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$ORDER_ID" ]; then
    echo -e "${GREEN}✓ Order created successfully${NC}"
    echo "   Order ID: $ORDER_ID"
else
    echo -e "${RED}✗ Failed to create order${NC}"
    exit 1
fi

echo ""
echo "3. Fetching the created order..."
SINGLE_ORDER=$(curl -s http://localhost:3001/api/orders/$ORDER_ID)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Order retrieved successfully${NC}"
    echo "   $SINGLE_ORDER" | head -c 200
    echo "..."
else
    echo -e "${RED}✗ Failed to fetch order${NC}"
fi

echo ""
echo "4. Getting all orders..."
ALL_ORDERS=$(curl -s http://localhost:3001/api/orders)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ All orders retrieved${NC}"
    ORDER_COUNT=$(echo $ALL_ORDERS | grep -o '"id"' | wc -l)
    echo "   Total orders: $ORDER_COUNT"
else
    echo -e "${RED}✗ Failed to fetch orders${NC}"
fi

echo ""
echo "5. Updating order status to 'preparing'..."
UPDATE=$(curl -s -X PATCH http://localhost:3001/api/orders/$ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "preparing"}')
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Order status updated${NC}"
else
    echo -e "${RED}✗ Failed to update order${NC}"
fi

echo ""
echo "6. Updating order status to 'ready'..."
curl -s -X PATCH http://localhost:3001/api/orders/$ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "ready"}' > /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Order marked as ready${NC}"
else
    echo -e "${RED}✗ Failed to update order${NC}"
fi

echo ""
echo "7. Getting active orders..."
ACTIVE=$(curl -s http://localhost:3001/api/orders/active)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Active orders retrieved${NC}"
    ACTIVE_COUNT=$(echo $ACTIVE | grep -o '"id"' | wc -l)
    echo "   Active orders: $ACTIVE_COUNT"
else
    echo -e "${RED}✗ Failed to fetch active orders${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}API Testing Complete!${NC}"
echo "=========================================="
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Open http://localhost:3000 to place orders"
echo "  2. Open http://localhost:3000/kitchen to view kitchen monitor"
echo "  3. Try placing orders and watch them appear in real-time!"
echo ""
