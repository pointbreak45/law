@echo off
echo ===========================================
echo    LegalBot India - Frontend Application
echo ===========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!
node --version

echo.
echo Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not available!
    pause
    exit /b 1
)

echo npm found!
npm --version

echo.
echo Installing dependencies...
call npm install

if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    echo Please check your internet connection.
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.
echo ===========================================
echo Starting the development server...
echo.
echo The application will open at: http://localhost:3000
echo.
echo Demo Login Credentials:
echo Email: aditi.sharma@example.com
echo Password: any password
echo.
echo Press Ctrl+C to stop the server
echo ===========================================
echo.

call npm start

pause