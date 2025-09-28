# LegalBot India - Setup Script
# This script will install dependencies and start the development server

Write-Host "=== LegalBot India Setup ===" -ForegroundColor Green
Write-Host "Setting up your React frontend application..." -ForegroundColor Yellow

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not available" -ForegroundColor Red
    exit 1
}

Write-Host "`nInstalling project dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
    Write-Host "`nStarting the development server..." -ForegroundColor Yellow
    Write-Host "The application will open at http://localhost:3000" -ForegroundColor Cyan
    Write-Host "`nDemo Login Credentials:" -ForegroundColor Magenta
    Write-Host "Email: aditi.sharma@example.com" -ForegroundColor White
    Write-Host "Password: any password" -ForegroundColor White
    Write-Host "`nPress Ctrl+C to stop the server" -ForegroundColor Gray
    npm start
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    Write-Host "Please check your internet connection and try again" -ForegroundColor Yellow
}