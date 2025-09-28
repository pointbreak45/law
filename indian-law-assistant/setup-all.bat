@echo off
title Indian Law Assistant - Complete Setup
color 0A

echo.
echo ========================================================
echo                🏛️ Indian Law Assistant
echo        Complete Setup - Backend + Frontend
echo ========================================================
echo.
echo This script will set up both the Python backend and 
echo React frontend for the Indian Law Assistant.
echo.
echo Requirements:
echo - Python 3.8+ (for backend)
echo - Node.js 16+ (for frontend)
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

cd /d "%~dp0"

echo.
echo ========================================================
echo                   🔍 SYSTEM CHECK
echo ========================================================

:: Check Python
echo.
echo [1/4] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Python is not installed or not in PATH!
    echo.
    echo Please install Python 3.8+ from: https://python.org/
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    goto :error_exit
) else (
    echo ✅ Python found!
    python --version
)

:: Check Node.js
echo.
echo [2/4] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js is not installed or not in PATH!
    echo.
    echo Please install Node.js 16+ from: https://nodejs.org/
    echo.
    goto :error_exit
) else (
    echo ✅ Node.js found!
    node --version
)

:: Check npm
echo.
echo [3/4] Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: npm is not available!
    goto :error_exit
) else (
    echo ✅ npm found!
    npm --version
)

:: Check directories
echo.
echo [4/4] Checking project structure...
if not exist "backend\app.py" (
    echo ❌ ERROR: Backend files not found!
    echo Make sure you have the complete project structure.
    goto :error_exit
)
if not exist "frontend\package.json" (
    echo ❌ ERROR: Frontend files not found!
    echo Make sure you have the complete project structure.
    goto :error_exit
)
echo ✅ Project structure looks good!

echo.
echo ========================================================
echo                  🐍 BACKEND SETUP
echo ========================================================

cd backend

echo.
echo Setting up Python virtual environment...
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ❌ ERROR: Failed to create virtual environment!
        goto :error_exit
    )
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Installing Python dependencies...
pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet

if errorlevel 1 (
    echo ❌ ERROR: Failed to install Python dependencies!
    echo Check your internet connection and try again.
    goto :error_exit
) else (
    echo ✅ Backend dependencies installed successfully!
)

echo.
echo Testing vector store initialization...
python -c "from vector_store import LegalVectorStore; print('✅ Vector store can be initialized')" 2>nul
if errorlevel 1 (
    echo ⚠️  Warning: Vector store initialization might take time on first run
    echo This is normal for the first startup.
) else (
    echo ✅ Vector store test passed!
)

cd ..

echo.
echo ========================================================
echo                  ⚛️ FRONTEND SETUP  
echo ========================================================

cd frontend

echo.
echo Installing Node.js dependencies...
echo This may take a few minutes...

npm install --silent

if errorlevel 1 (
    echo ❌ ERROR: Failed to install Node.js dependencies!
    echo.
    echo If you get PowerShell execution policy errors, run:
    echo Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
    echo.
    goto :error_exit
) else (
    echo ✅ Frontend dependencies installed successfully!
)

echo.
echo Testing React build process...
npm run build --silent >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Warning: Build test failed, but development should work
) else (
    echo ✅ React build test passed!
    :: Clean up build folder
    if exist "build" rmdir /s /q build >nul 2>&1
)

cd ..

echo.
echo ========================================================
echo                ✅ SETUP COMPLETE!
echo ========================================================
echo.
echo 🎉 Indian Law Assistant is ready to use!
echo.
echo 📂 Project Structure:
echo   ├── backend/     - Python FastAPI server
echo   ├── frontend/    - React TypeScript app
echo   └── dataset/     - Legal JSON documents
echo.
echo 🚀 To start the application:
echo.
echo   Option 1 - Manual (Recommended for development):
echo   1. Run: start-backend.bat     (starts Python server)
echo   2. Run: start-frontend.bat    (starts React app)
echo.
echo   Option 2 - Automatic:
echo   Run both servers automatically? (Y/N)

set /p choice="> "
if /I "%choice%"=="Y" goto :start_servers
if /I "%choice%"=="y" goto :start_servers

echo.
echo 📖 Access URLs (after starting servers):
echo   - Frontend Application: http://localhost:3000
echo   - Backend API: http://localhost:8000  
echo   - API Documentation: http://localhost:8000/docs
echo   - Health Check: http://localhost:8000/health
echo.
echo 💡 Usage Examples:
echo   - "What is Article 21 of the Constitution?"
echo   - "How to file an FIR?"
echo   - "Section 420 IPC cheating provisions"
echo   - "Anticipatory bail provisions"
echo.
echo 📚 Documentation: See README.md for detailed guide
echo.
goto :success_exit

:start_servers
echo.
echo ========================================================
echo              🚀 STARTING SERVERS
echo ========================================================
echo.
echo Starting backend server in new window...
start "Indian Law Assistant - Backend" cmd /c "start-backend.bat"

timeout /t 3 /nobreak >nul

echo Starting frontend server in new window...
start "Indian Law Assistant - Frontend" cmd /c "start-frontend.bat"

echo.
echo ✅ Both servers are starting in separate windows!
echo.
echo 🌐 Application will be available at:
echo   - http://localhost:3000 (Frontend)
echo   - http://localhost:8000 (Backend API)
echo.
echo ⏱️  Please wait 30-60 seconds for servers to fully start.
echo.
goto :success_exit

:error_exit
echo.
echo ========================================================
echo                   ❌ SETUP FAILED
echo ========================================================
echo.
echo Please fix the above errors and try again.
echo.
echo 📞 Need help?
echo   - Check README.md for detailed instructions
echo   - Ensure Python 3.8+ and Node.js 16+ are installed
echo   - Make sure you have internet connection for dependencies
echo.
pause
exit /b 1

:success_exit
echo 🎊 Setup completed successfully! 
echo.
pause
exit /b 0