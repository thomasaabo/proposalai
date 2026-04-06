#!/bin/bash
# ProposalAI — Double-click to launch
cd "$(dirname "$0")"

echo ""
echo "========================================="
echo "  ProposalAI — RFP Response Engine"
echo "========================================="
echo ""

# Check for node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "   Install it from: https://nodejs.org"
    echo ""
    read -p "Press Enter to close..."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies (first run only)..."
    npm install
    echo ""
fi

# Check for .env
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "⚠️  No .env file found. Creating from .env.example..."
        echo "   Please edit .env and add your ANTHROPIC_API_KEY"
        cp .env.example .env
        open -a TextEdit .env
        echo ""
        read -p "After adding your API key, press Enter to continue..."
    fi
fi

echo "🚀 Starting ProposalAI..."
echo "   Backend:  http://localhost:3001"
echo "   Frontend: http://localhost:3001"
echo ""
echo "   Opening Safari..."
echo "   (Press Ctrl+C to stop the server)"
echo ""

# Build frontend if dist doesn't exist
if [ ! -d "dist" ]; then
    echo "🔨 Building frontend..."
    npx vite build
fi

# Open Safari after a short delay
(sleep 2 && open -a Safari http://localhost:3001) &

# Start the server (serves both API + built frontend)
NODE_ENV=production node server.js
