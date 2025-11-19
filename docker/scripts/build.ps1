# PowerShell build script for draw.io Docker image
# Requires Docker Desktop for Windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Building draw.io Docker Image" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "ERROR: Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

# Build the main image
Write-Host ""
Write-Host "Building main application image..." -ForegroundColor Yellow
docker build -t drawio:latest .

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to build main image!" -ForegroundColor Red
    exit 1
}

# Optionally build test image
$buildTests = Read-Host "Build test image? (y/N)"
if ($buildTests -eq "y" -or $buildTests -eq "Y") {
    Write-Host ""
    Write-Host "Building test image..." -ForegroundColor Yellow
    docker build -t drawio-tests:latest -f Dockerfile.test .

    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to build test image!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "To run the application:" -ForegroundColor Cyan
Write-Host "  docker-compose up -d" -ForegroundColor White
Write-Host ""
Write-Host "Or run directly:" -ForegroundColor Cyan
Write-Host "  docker run -d -p 8080:8080 --name drawio drawio:latest" -ForegroundColor White
Write-Host ""
Write-Host "Access draw.io at: http://localhost:8080" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
