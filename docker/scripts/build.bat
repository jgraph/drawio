@echo off
REM Build script for draw.io Docker image on Windows
REM Requires Docker Desktop for Windows

echo ========================================
echo Building draw.io Docker Image
echo ========================================

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    exit /b 1
)

REM Build the main image
echo.
echo Building main application image...
docker build -t drawio:latest .

if errorlevel 1 (
    echo ERROR: Failed to build main image!
    exit /b 1
)

echo.
echo Build completed successfully!
echo.
echo To run the application:
echo   docker-compose up -d
echo.
echo Or run directly:
echo   docker run -d -p 8080:8080 --name drawio drawio:latest
echo.
echo Access draw.io at: http://localhost:8080
echo ========================================
