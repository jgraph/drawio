# Docker Setup for draw.io

This guide explains how to run draw.io using Docker, with full support for Windows 11.

## Prerequisites

### Windows 11
1. Install [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
2. Enable WSL 2 backend (recommended) or Hyper-V
3. Ensure Docker Desktop is running before executing scripts

### Linux/macOS
1. Install Docker Engine
2. Install Docker Compose

## Quick Start

### Windows (PowerShell)

```powershell
# Build the image
.\docker\scripts\build.ps1

# Run the application
.\docker\scripts\run.ps1

# Run tests
.\docker\scripts\test.bat
```

### Windows (Command Prompt)

```batch
# Build the image
docker\scripts\build.bat

# Run the application
docker\scripts\run.bat

# Run tests
docker\scripts\test.bat
```

### Linux/macOS

```bash
# Build the image
docker build -t drawio:latest .

# Run the application
docker-compose up -d

# Run tests
docker-compose --profile test run drawio-tests
```

## Access the Application

Once running, access draw.io at: **http://localhost:8080**

## Docker Commands

### Build

```bash
# Build main application
docker build -t drawio:latest .

# Build test container
docker build -t drawio-tests:latest -f Dockerfile.test .
```

### Run

```bash
# Using docker-compose (recommended)
docker-compose up -d

# Direct Docker run
docker run -d -p 8080:8080 --name drawio drawio:latest
```

### Management

```bash
# View logs
docker-compose logs -f drawio

# Stop the application
docker-compose down

# Restart
docker-compose restart drawio

# Check status
docker-compose ps
```

### Testing

```bash
# Run tests with docker-compose
docker-compose --profile test run drawio-tests

# Run tests directly
docker run --rm drawio-tests:latest
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CATALINA_OPTS` | `-Xms512m -Xmx1024m` | JVM memory settings |

### Ports

| Port | Service | Description |
|------|---------|-------------|
| 8080 | Tomcat | Main application |
| 80 | Nginx | Reverse proxy (production profile) |
| 443 | Nginx | HTTPS (production profile) |

## Docker Compose Profiles

### Default (Development)
```bash
docker-compose up -d
```
Starts only the main draw.io application.

### Test
```bash
docker-compose --profile test run drawio-tests
```
Runs the test suite.

### Production
```bash
docker-compose --profile production up -d
```
Starts draw.io with Nginx reverse proxy (requires SSL configuration).

## Troubleshooting

### Windows 11 Common Issues

1. **Docker Desktop not starting**
   - Ensure WSL 2 is installed: `wsl --install`
   - Enable virtualization in BIOS

2. **Permission errors**
   - Run PowerShell as Administrator
   - Check Docker Desktop settings for shared drives

3. **Port 8080 already in use**
   - Change port: `docker run -d -p 8888:8080 drawio:latest`
   - Or find and stop the process using port 8080

4. **Slow performance**
   - Enable WSL 2 backend in Docker Desktop settings
   - Increase Docker memory allocation

### General Issues

1. **Container won't start**
   ```bash
   # Check logs
   docker logs drawio-app

   # Check health
   docker inspect drawio-app | grep -A 10 Health
   ```

2. **Build failures**
   ```bash
   # Clean build
   docker build --no-cache -t drawio:latest .
   ```

3. **Out of disk space**
   ```bash
   # Clean unused images and containers
   docker system prune -a
   ```

## Development

### Hot Reload (Development Mode)

Uncomment the volume mount in `docker-compose.yml` to enable hot reload:

```yaml
volumes:
  - ./src/main/webapp:/usr/local/tomcat/webapps/ROOT:ro
```

### Building for Production

```bash
# Build optimized image
docker build -t drawio:production --target builder .

# Create WAR file
docker run --rm -v $(pwd)/build:/output drawio:production \
  cp /build/src/main/webapp /output/draw.war
```

## Security Notes

- Default setup is for development/testing
- For production, configure SSL with the Nginx profile
- Store credentials securely (not in Docker images)
- Keep Docker and base images updated

## Support

For issues with:
- Docker setup: Check this README and troubleshooting section
- draw.io application: https://github.com/jgraph/drawio/issues
- Docker Desktop: https://docs.docker.com/desktop/

## License

Apache License 2.0 - See main repository LICENSE file.
