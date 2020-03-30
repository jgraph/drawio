Our collection of docker images and docker-compose files are in [jgraph/docker-drawio repository](https://github.com/jgraph/docker-drawio)

In that repository:

* draw.io docker image that is always up-to-date with draw.io releases
* draw.io export server image which allow exporting draw.io diagrams to pdf and images
* docker-compose to run draw.io with the export server
* docker-compose to run draw.io integrated within nextcloud
* docker-compose to run draw.io with PlantUML support
* docker-compose to run draw.io self-contained without any dependency on draw.io website (with the export server, plantUml, Google Drive support, OneDrive support, and EMF conversion support (for VSDX export)


# HTTPS SSL Certificate via Let's Encrypt

### Prerequisites:

1. A Linux machine connected to the Internet with ports 443 and 80 open
1. A domain/subdomain name pointing to this machine's IP address. (e.g., drawio.example.com)

### Method:

1. Using jgraph/drawio docker image, run the following command
`docker run -it -m1g -e LETS_ENCRYPT_ENABLED=true -e PUBLIC_DNS=drawio.example.com --rm --name="draw" -p 80:80 -p 443:8443 jgraph/drawio`
Notice that mapping port 80 to container's port 80 allows certbot to work in stand-alone mode. Mapping port 443 to container's port 8443 allows the container tomcat to serve https requests directly.

# Changing draw.io configuration

## Method 1 (Build you custom image with setting pre-loaded)

1. Edit PreConfig.js & PostConfig.js files (next to Dockerfile in debian or alpine folders)
1. Build the docker image

## Method 2 (Using existing running docker container)

1. Edit PreConfig.js & PostConfig.js files (next to Dockerfile in debian or alpine folders)
1. Copy these files to docker container 

```
docker cp PreConfig.js draw:/usr/local/tomcat/webapps/draw/js/
docker cp PostConfig.js draw:/usr/local/tomcat/webapps/draw/js/
```

## Method 3 (Bind configuration files into the container when started)

1. This method allows changing the configuration files directly on the host without invoking any other docker commands. It can be used for testing
1. Edit PreConfig.js & PostConfig.js files (next to Dockerfile in debian or alpine folders)
1. From within the directory that contained the configuration files, run the following command to start docker container
1. Note: self-contained docker-compose file already mount the configuration files into the container

```
docker run -it  --rm --name="draw" --mount type=bind,source="$(pwd)"/PreConfig.js,target=/usr/local/tomcat/webapps/draw/js/PreConfig.js --mount type=bind,source="$(pwd)"/PostConfig.js,target=/usr/local/tomcat/webapps/draw/js/PostConfig.js -p 8080:8080 -p 8443:8443 fjudith/draw.io
```

