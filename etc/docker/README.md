This guide is based on fjudith/draw.io docker image [docker-draw.io repository](https://github.com/jgraph/docker-draw.io)

#HTTPS SSL Certificate via Let's Encrypt

###Prerequisites:

1. A Linux machine connected to the Internet with ports 443 and 80 open
1. A domain/subdomain name pointing to this machine's IP address. (e.g., drawio.example.com)

###Method:

1. Using fjudith/draw.io docker image, run the following command
`docker run -it -m1g -e LETS_ENCRYPT_ENABLED=true -e PUBLIC_DNS=drawio.example.com --rm --name="draw" -p 80:80 -p 443:8443 fjudith/draw.io`
Notice that mapping port 80 to container's port 80 allows certbot to work in stand-alone mode. Mapping port 443 to container's port 8443 allows the container tomcat to serve https requests directly.

#Updating draw.io in a running container

##Method 1 (Using the host machine to build draw.io):

###Prerequisites:

1. Host machine must have wget, unzip and ant installed
1. Assumptions: docker container is named 'draw' and $CATALINA_HOME in the container is '/usr/local/tomcat/'

###Method:

1. `wget https://github.com/jgraph/draw.io/archive/v{$version}.zip` For example, `wget https://github.com/jgraph/draw.io/archive/v11.2.9.zip`
1. `unzip v11.2.9.zip`
1. `cd drawio-11.2.9/etc/build/`
1. `ant war`
1. `cd ../../build/`
1. `unzip draw.war -d draw`
1. `docker cp draw draw:/usr/local/tomcat/webapps/`

##Method 2 (build a new docker image with the new version)

1. Download the VERSION file to get the latest draw.io version `wget https://raw.githubusercontent.com/jgraph/drawio/master/VERSION`
1. Build the new docker image `docker build --build-arg VERSION=&#96;cat VERSION&#96; -t fjudith/draw.io .`
1. Run the new image instead of the old one

#Changing draw.io configuration

##Method 1 (Build you custom image with setting pre-loaded)

1. Create you PreConfig.js & PostConfig.js files using templates found in ⁨src⁩/⁨main⁩/⁨webapp⁩/⁨js⁩/PreConfig.js & PostConfig.js
1. Add your configuration files (PreConfig.js & PostConfig.js) next to Dockerfile
1. Add the following line after line 7 in Dockerfile

```
COPY PreConfig.js PostConfig.js $CATALINA_HOME/webapps/draw/js/
```

##Method 2 (Using existing running docker container)

1. Create you PreConfig.js & PostConfig.js files using templates found in ⁨src⁩/⁨main⁩/⁨webapp⁩/⁨js⁩/PreConfig.js & PostConfig.js
1. Copy these files to docker container 

```
docker cp PreConfig.js draw:/usr/local/tomcat/webapps/draw/js/
docker cp PostConfig.js draw:/usr/local/tomcat/webapps/draw/js/
```

##Method 3 (Bind configuration files into the container when started)

1. This method allows changing the configuration files directly on the host without invoking any other docker commands. It can be used for testing
1. Create you PreConfig.js & PostConfig.js files using templates found in ⁨src⁩/⁨main⁩/⁨webapp⁩/⁨js⁩/PreConfig.js & PostConfig.js
1. From within the directory that contained the configuration files, run the following command to start docker container

```
docker run -it  --rm --name="draw" --mount type=bind,source="$(pwd)"/PreConfig.js,target=/usr/local/tomcat/webapps/draw/js/PreConfig.js --mount type=bind,source="$(pwd)"/PostConfig.js,target=/usr/local/tomcat/webapps/draw/js/PostConfig.js -p 8080:8080 -p 8443:8443 fjudith/draw.io
```

#draw.io with local export server

Use the docker image from `drawio-export` folder. This image is much larger since it requires Node.js in addition to Puppeteer (which requires many dependencies similar to Chromium)

