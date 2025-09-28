@echo off
echo ==========================================
echo   Indian Law Assistant - Frontend Setup
echo ==========================================
echo.

cd /d "%~dp0"

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH!
    echo Please install Node.js 16+ from https://nodejs.org/
    echo.
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
    echo Please ensure Node.js is properly installed.
    pause
    exit /b 1
)

echo npm found!
npm --version

echo.
echo Navigating to frontend directory...
cd frontend

if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Make sure you're in the correct directory.
    pause
    exit /b 1
)

echo.
echo Installing/updating Node.js dependencies...
npm install

if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    echo Check your internet connection and try again.
    echo.
    echo If you get PowerShell execution policy errors, run:
    echo Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
    echo.
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!

echo.
echo ==========================================
echo Starting React Development Server...
echo.
echo Frontend will be available at:
echo - Application: http://localhost:3000
echo - Make sure backend is running on http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo ==========================================
echo.

npm start

echo.
echo Frontend server stopped.
pause