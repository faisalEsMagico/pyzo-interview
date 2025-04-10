#!/bin/bash
#
# Navigate to the project directory
cd /home/azureuser/ai-interview-dashboard/apps/AIBot || { echo "Directory not found"; exit 1; }

# Ensure the working directory is clean
if [ -n "$(git status --porcelain)" ]; then
   echo "Uncommitted changes detected. Please commit or stash them before proceeding."
   exit 1
   fi
# Pull the latest changes from the 'feature/new-ui' branch
   if ! git pull origin feature/new-ui; then
   echo "Error: Merge conflicts detected. Please resolve them manually."
   exit 1
   fi

# Install dependencies
 echo "Installing dependencies..."
 if ! npm install; then
 echo "Error: npm install failed."
 exit 1
 fi
#
# Build the application
echo "Building the application..."
if ! npm run build; then
echo "Error: Build failed."
exit 1
fi
# Reload PM2 process

echo "Reloading PM2 process..."
if ! pm2 reload 0; then
echo "Error: PM2 reload failed."
exit 1
fi

echo "Deployment completed successfully."

