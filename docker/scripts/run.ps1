# PowerShell run script for draw.io Docker container
# Requires Docker Desktop for Windows

param(
    [switch]$Detached = $true,
    [switch]$OpenBrowser = $true,
    [int]$Port = 8080
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting draw.io" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "ERROR: Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

# Check if container already exists
$existingContainer = docker ps -a --format "{{.Names}}" | Where-Object { $_ -eq "drawio-app" }
if ($existingContainer) {
    Write-Host "Stopping existing container..." -ForegroundColor Yellow
    docker stop drawio-app | Out-Null
    docker rm drawio-app | Out-Null
}

# Start using docker-compose
Write-Host "Starting draw.io with docker-compose..." -ForegroundColor Yellow
docker-compose up -d drawio

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to start container!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "draw.io is starting..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access draw.io at: http://localhost:$Port" -ForegroundColor Green
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "  View logs:    docker-compose logs -f drawio" -ForegroundColor White
Write-Host "  Stop:         docker-compose down" -ForegroundColor White
Write-Host "  Restart:      docker-compose restart drawio" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

# Wait and open browser
if ($OpenBrowser) {
    Write-Host ""
    Write-Host "Waiting for application to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    Start-Process "http://localhost:$Port"
}
