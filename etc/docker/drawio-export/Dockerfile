FROM tomcat:9-jre11-slim

LABEL maintainer="Florian JUDITH <florian.judith.b@gmail.com>"

ARG VERSION=11.3.0

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
        openjdk-11-jdk-headless ant git patch wget xmlstarlet certbot curl && \
    curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get install -y --no-install-recommends nodejs chromium libatk-bridge2.0-0 libgtk-3-0 && \
    cd /tmp && \
    wget https://github.com/jgraph/draw.io/archive/v${VERSION}.zip && \
    unzip v${VERSION}.zip && \
    cd /tmp/drawio-${VERSION} && \
    cd /tmp/drawio-${VERSION}/etc/build && \
    ant war && \
    cd /tmp/drawio-${VERSION}/build && \
    unzip /tmp/drawio-${VERSION}/build/draw.war -d $CATALINA_HOME/webapps/draw && \
    mkdir /usr/local/drawio && \
    cd /usr/local/drawio && \
    git clone https://github.com/jgraph/draw-image-export2.git && \
    cd draw-image-export2 && \
    npm install && \
    apt-get remove -y --purge openjdk-11-jdk-headless ant git patch wget && \
    apt-get autoremove -y --purge && \
    apt-get remove -y --purge chromium && \
    apt-get clean && \
    rm -r /var/lib/apt/lists/* && \
    rm -rf \
        /tmp/v${VERSION}.zip \
        /tmp/drawio-${VERSION}
    
COPY PreConfig.js PostConfig.js $CATALINA_HOME/webapps/draw/js/

# Update server.xml to set Draw.io webapp to root
RUN cd $CATALINA_HOME && \
    xmlstarlet ed \
    -P -S -L \
    -i '/Server/Service/Engine/Host/Valve' -t 'elem' -n 'Context' \
    -i '/Server/Service/Engine/Host/Context' -t 'attr' -n 'path' -v '/' \
    -i '/Server/Service/Engine/Host/Context[@path="/"]' -t 'attr' -n 'docBase' -v 'draw' \
    -s '/Server/Service/Engine/Host/Context[@path="/"]' -t 'elem' -n 'WatchedResource' -v 'WEB-INF/web.xml' \
    -i '/Server/Service/Engine/Host/Valve' -t 'elem' -n 'Context' \
    -i '/Server/Service/Engine/Host/Context[not(@path="/")]' -t 'attr' -n 'path' -v '/ROOT' \
    -s '/Server/Service/Engine/Host/Context[@path="/ROOT"]' -t 'attr' -n 'docBase' -v 'ROOT' \
    -s '/Server/Service/Engine/Host/Context[@path="/ROOT"]' -t 'elem' -n 'WatchedResource' -v 'WEB-INF/web.xml' \
    conf/server.xml


# Copy docker-entrypoint
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

WORKDIR $CATALINA_HOME

#If export server is not used outside draw.io, no need to expose port 8000
EXPOSE 8080 8443 8000

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["catalina.sh", "run"]
