#!/bin/bash

# Script to fix dependency issues in the P2P Energy Trading project

# Step 1: Clear npm cache and remove node_modules
echo "Clearing npm cache and removing node_modules..."
npm cache clean --force
rm -rf node_modules

# Step 2: Attempt standard npm install
echo "Attempting standard npm install..."
npm install

# Step 3: If standard install fails, use legacy-peer-deps
echo "Installing with legacy-peer-deps..."
npm install --legacy-peer-deps

# Step 4: Install specific version of ajv
echo "Installing ajv@6.12.6..."
npm install ajv@6.12.6

# Step 5: Update all Nivo packages to latest versions
echo "Updating Nivo packages..."
npm install @nivo/core@latest @nivo/bar@latest @nivo/tooltip@latest @nivo/line@latest @nivo/pie@latest @nivo/geo@latest --legacy-peer-deps

echo "Dependency fix attempt complete. Please check for any remaining errors."