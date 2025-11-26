#!/bin/bash

echo "=========================================="
echo "Order Management System - Starting..."
echo "=========================================="
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd client && npm install && cd ..
fi

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "🚀 Starting application..."
echo ""
echo "Backend will run on: http://localhost:3001"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "=========================================="
echo "Access the application:"
echo "  Order Placement: http://localhost:3000"
echo "  Kitchen Monitor: http://localhost:3000/kitchen"
echo "=========================================="
echo ""

# Start the application
npm run dev
