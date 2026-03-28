#!/bin/bash
# deploy.sh - Pull latest content and rebuild

set -e

echo "=========================================="
echo "  TerminalMind Deployment Script"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
CONTENT_DIR="$PROJECT_DIR/public/content"

echo -e "${CYAN}[1/4] Pulling latest from GitHub...${NC}"
cd "$PROJECT_DIR"
git pull origin main

echo -e "${CYAN}[2/4] Installing dependencies...${NC}"
npm install

echo -e "${CYAN}[3/4] Building Astro project...${NC}"
npm run build

echo -e "${CYAN}[4/4] Restarting Docker container...${NC}"
docker compose down
docker compose up -d --build

echo ""
echo -e "${GREEN}=========================================="
echo "  Deployment Complete!"
echo "==========================================${NC}"
echo ""
echo "Site should be running at: http://localhost:3000"
echo ""
