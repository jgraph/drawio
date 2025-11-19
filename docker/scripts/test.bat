@echo off
REM Test runner script for draw.io on Windows
REM Runs the LLM integration test suite in Docker

echo ========================================
echo Running draw.io Tests
echo ========================================

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    exit /b 1
)

REM Build test image if needed
echo Building test image...
docker build -t drawio-tests:latest -f Dockerfile.test .

if errorlevel 1 (
    echo ERROR: Failed to build test image!
    exit /b 1
)

REM Run tests
echo.
echo Running tests...
echo.
docker run --rm -v "%cd%\tests:/app/tests" drawio-tests:latest

if errorlevel 1 (
    echo.
    echo ========================================
    echo Tests FAILED
    echo ========================================
    exit /b 1
)

echo.
echo ========================================
echo All tests PASSED
echo ========================================
