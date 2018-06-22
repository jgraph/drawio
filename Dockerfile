# Build stage
From frekele/ant:1.9.9-jdk8 as BUILD
ENV JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF8
COPY etc/ ./etc/ 
COPY src/ ./src/
COPY VERSION ./
WORKDIR ./etc/build
RUN ant war

# Final Stage
From tomcat:alpine
RUN rm -rf /usr/local/tomcat/webapps/*
COPY --from=BUILD /root/build/draw.war /usr/local/tomcat/webapps/ROOT.war
EXPOSE 8080
CMD ["catalina.sh", "run"]
