FROM tomcat:9-jre8-alpine

RUN apk add openjdk8 apache-ant xmlstarlet certbot curl \
    && mkdir -p $CATALINA_HOME/webapps/draw

RUN mkdir /usr/build
COPY src /usr/build/src
COPY etc /usr/build/etc
COPY VERSION /usr/build
RUN cd /usr/build/etc/build/ \
    && ant war \
    && mv /usr/build/build/draw.war $CATALINA_HOME/webapps/ \
    && mv /usr/build/src/main/webapp/* $CATALINA_HOME/webapps/draw \
    && apk del --purge openjdk8 apache-ant \
    && rm -rf /usr/build \
    # Update server.xml to set Draw.io webapp to root \
    && cd $CATALINA_HOME && \
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

EXPOSE 8080 8443

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["catalina.sh", "run"]
