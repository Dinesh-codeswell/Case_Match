#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Case Competition Team Matching feature...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: Please run this script from the project root directory');
  process.exit(1);
}

// Install frontend dependencies
console.log('📦 Installing frontend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed\n');
} catch (error) {
  console.error('❌ Error installing frontend dependencies:', error.message);
  process.exit(1);
}

// Install backend dependencies
console.log('📦 Installing backend dependencies...');
try {
  process.chdir('backend');
  execSync('npm install', { stdio: 'inherit' });
  process.chdir('..');
  console.log('✅ Backend dependencies installed\n');
} catch (error) {
  console.error('❌ Error installing backend dependencies:', error.message);
  process.exit(1);
}

// Build backend
console.log('🔨 Building backend...');
try {
  process.chdir('backend');
  execSync('npm run build', { stdio: 'inherit' });
  process.chdir('..');
  console.log('✅ Backend built successfully\n');
} catch (error) {
  console.error('❌ Error building backend:', error.message);
  process.exit(1);
}

console.log('🎉 Setup complete!\n');
console.log('To start the application:');
console.log('  npm run dev:full    # Start both frontend and backend');
console.log('  npm run dev         # Start frontend only');
console.log('  npm run backend:dev # Start backend only');
console.log('\nThen visit: http://localhost:3000/case-match');