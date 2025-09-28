@echo off
echo ==========================================
echo    Indian Law Assistant - Backend Setup
echo ==========================================
echo.

cd /d "%~dp0"

echo Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH!
    echo Please install Python 3.8+ from https://python.org/
    echo.
    pause
    exit /b 1
)

echo Python found!
python --version

echo.
echo Navigating to backend directory...
cd backend

if not exist "requirements.txt" (
    echo ERROR: requirements.txt not found!
    echo Make sure you're in the correct directory.
    pause
    exit /b 1
)

echo.
echo Checking virtual environment...
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment!
        pause
        exit /b 1
    )
)

echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Installing/updating dependencies...
pip install --upgrade pip
pip install -r requirements.txt

if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    echo Check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo Starting FastAPI Backend Server...
echo.
echo Backend will be available at:
echo - API: http://localhost:8000
echo - Documentation: http://localhost:8000/docs
echo - Health Check: http://localhost:8000/health
echo.
echo Press Ctrl+C to stop the server
echo ==========================================
echo.

uvicorn app:app --reload --host 0.0.0.0 --port 8000

echo.
echo Backend server stopped.
pause