# Build stage - compile Java servlets
FROM eclipse-temurin:21-jdk AS builder

# Install Ant for building
RUN apt-get update && apt-get install -y ant && rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Copy source files
COPY src/main/java src/main/java
COPY src/main/webapp src/main/webapp
COPY etc/build etc/build

# Compile Java servlets
RUN mkdir -p src/main/webapp/WEB-INF/classes && \
    javac -d src/main/webapp/WEB-INF/classes \
    -cp "src/main/webapp/WEB-INF/lib/*" \
    src/main/java/com/mxgraph/online/*.java

# Runtime stage - Tomcat server
FROM tomcat:10.1-jdk21-temurin

LABEL maintainer="draw.io"
LABEL description="draw.io - Free online diagram software"
LABEL version="28.0.7"

# Remove default Tomcat webapps
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy compiled webapp
COPY --from=builder /build/src/main/webapp /usr/local/tomcat/webapps/ROOT

# Set environment variables
ENV CATALINA_OPTS="-Xms512m -Xmx1024m"

# Expose HTTP port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Start Tomcat
CMD ["catalina.sh", "run"]
