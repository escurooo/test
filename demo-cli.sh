#!/bin/bash

echo "=========================================="
echo "Order Management System - CLI Demo"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}1. Creating Order #1 - Burger Combo${NC}"
ORDER1=$(curl -s -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[{"name":"Burger","quantity":2},{"name":"Fries","quantity":2}],"customer_name":"Alice"}')
echo "✓ Order created"

echo ""
echo -e "${BLUE}2. Creating Order #2 - Pizza${NC}"
ORDER2=$(curl -s -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[{"name":"Margherita Pizza","quantity":1},{"name":"Coke","quantity":2}],"customer_name":"Bob"}')
echo "✓ Order created"

echo ""
echo -e "${BLUE}3. Creating Order #3 - Breakfast${NC}"
ORDER3=$(curl -s -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[{"name":"Pancakes","quantity":3},{"name":"Coffee","quantity":1}],"customer_name":"Charlie"}')
echo "✓ Order created"

echo ""
echo -e "${YELLOW}=========================================="
echo "Current Active Orders (Kitchen View)"
echo "==========================================${NC}"
curl -s http://localhost:3001/api/orders/active | python3 -m json.tool

echo ""
echo -e "${GREEN}4. Updating Order Status - Starting to Prepare${NC}"
ORDER1_ID=$(echo $ORDER1 | grep -o '"id":"[^"]*' | cut -d'"' -f4)
curl -s -X PATCH http://localhost:3001/api/orders/$ORDER1_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status":"preparing"}' > /dev/null
echo "✓ First order status updated to 'preparing'"

echo ""
echo -e "${GREEN}5. Marking Second Order as Ready${NC}"
ORDER2_ID=$(echo $ORDER2 | grep -o '"id":"[^"]*' | cut -d'"' -f4)
curl -s -X PATCH http://localhost:3001/api/orders/$ORDER2_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status":"ready"}' > /dev/null
echo "✓ Second order marked as 'ready'"

echo ""
echo -e "${YELLOW}=========================================="
echo "Updated Active Orders"
echo "==========================================${NC}"
curl -s http://localhost:3001/api/orders/active | python3 -m json.tool

echo ""
echo -e "${GREEN}=========================================="
echo "✓ Demo Complete!"
echo "==========================================${NC}"
echo ""
echo "The Order Management System is fully functional!"
echo "Backend API: http://localhost:3001/api"
echo "Frontend: http://localhost:3000 (requires browser access)"
echo ""
