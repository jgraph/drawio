@echo off
REM Run script for draw.io Docker container on Windows
REM Requires Docker Desktop for Windows

echo ========================================
echo Starting draw.io
echo ========================================

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    exit /b 1
)

REM Check if container already exists
docker ps -a --format "{{.Names}}" | findstr /x "drawio-app" >nul 2>&1
if not errorlevel 1 (
    echo Stopping existing container...
    docker stop drawio-app >nul 2>&1
    docker rm drawio-app >nul 2>&1
)

REM Start using docker-compose
echo Starting draw.io with docker-compose...
docker-compose up -d drawio

if errorlevel 1 (
    echo ERROR: Failed to start container!
    exit /b 1
)

echo.
echo ========================================
echo draw.io is starting...
echo ========================================
echo.
echo Access draw.io at: http://localhost:8080
echo.
echo To view logs:
echo   docker-compose logs -f drawio
echo.
echo To stop:
echo   docker-compose down
echo ========================================

REM Wait for container to be healthy
echo.
echo Waiting for application to start...
timeout /t 10 /nobreak >nul
start http://localhost:8080
