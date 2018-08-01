FROM frekele/ant:1.10.3-jdk8 as BUILD
RUN mkdir /usr/build
COPY src /usr/build/src
COPY etc /usr/build/etc
COPY VERSION /usr/build
RUN cd /usr/build/etc/build/ && ant war

FROM tomcat:9.0 as TARGET
COPY --from=BUILD /usr/build/build/draw.war /usr/local/tomcat/webapps/
EXPOSE 8080
CMD ["catalina.sh", "run"]
