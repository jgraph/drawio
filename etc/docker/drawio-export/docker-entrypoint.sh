#!/bin/bash
#set -e

LETS_ENCRYPT_ENABLED=${LETS_ENCRYPT_ENABLED:-false}
PUBLIC_DNS=${PUBLIC_DNS:-'draw.example.com'}
ORGANISATION_UNIT=${ORGANIZATION_UNIT:-'Cloud Native Application'}
ORGANISATION=${ORGANISATION:-'example inc'}
CITY=${CITY:-'Paris'}
STATE=${STATE:-'Paris'}
COUNTRY_CODE=${COUNTRY:-'FR'}
KEYSTORE_PASS=${KEYSTORE_PASS:-'V3ry1nS3cur3P4ssw0rd'}
KEY_PASS=${KEY_PASS:-$KEYSTORE_PASS}


if ! [ -f $CATALINA_HOME/.keystore ] && [ "$LETS_ENCRYPT_ENABLED" == "true" ]; then
    echo "Generating Let's Encrypt certificate"
    
    keytool -genkey -noprompt -alias tomcat -dname "CN=${PUBLIC_DNS}, OU=${ORGANISATION_UNIT}, O=${ORGANISATION}, L=${CITY}, S=${STATE}, C=${COUNTRY_CODE}" -keystore $CATALINA_HOME/.keystore -storepass "${KEYSTORE_PASS}" -KeySize 2048 -keypass "${KEY_PASS}" -keyalg RSA -storetype pkcs12

    keytool -list -keystore $CATALINA_HOME/.keystore -v -storepass "${KEYSTORE_PASS}"

    keytool -certreq -alias tomcat -file request.csr -keystore $CATALINA_HOME/.keystore -storepass "${KEYSTORE_PASS}"

    certbot certonly --csr $CATALINA_HOME/request.csr --standalone --register-unsafely-without-email --agree-tos

    keytool -import -trustcacerts -alias tomcat -file 0001_chain.pem -keystore $CATALINA_HOME/.keystore -storepass "${KEYSTORE_PASS}"
fi

if ! [ -f $CATALINA_HOME/.keystore ] && [ "$LETS_ENCRYPT_ENABLED" == "false" ]; then
    echo "Generating Self-Signed certificate"

    keytool -genkey -noprompt -alias selfsigned -dname "CN=${PUBLIC_DNS}, OU=${ORGANISATION_UNIT}, O=${ORGANISATION}, L=${CITY}, S=${STATE}, C=${COUNTRY_CODE}" -keystore $CATALINA_HOME/.keystore -storepass "${KEYSTORE_PASS}" -KeySize 2048 -keypass "${KEY_PASS}" -keyalg RSA -validity 3600 -storetype pkcs12
    
    keytool -list -keystore $CATALINA_HOME/.keystore -v -storepass "${KEYSTORE_PASS}"
fi

# Update SSL port configuration if it does'nt exists
#
UUID="$(cat /dev/urandom | tr -dc 'a-zA-Z' | fold -w 1 | head -n 1)$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 7 | head -n 1)"
VAR=$(cat conf/server.xml | grep "$CATALINA_HOME/.keystore")

if [ -f $CATALINA_HOME/.keystore ] && [ -z $VAR ]; then
     echo "Append https connector to server.xml"

    xmlstarlet ed \
        -P -S -L \
        -s '/Server/Service' -t 'elem' -n "${UUID}" \
        -i "/Server/Service/${UUID}" -t 'attr' -n 'port' -v '8443' \
        -i "/Server/Service/${UUID}" -t 'attr' -n 'protocol' -v 'org.apache.coyote.http11.Http11NioProtocol' \
        -i "/Server/Service/${UUID}" -t 'attr' -n 'SSLEnabled' -v 'true' \
        -i "/Server/Service/${UUID}" -t 'attr' -n 'maxThreads' -v '150' \
        -i "/Server/Service/${UUID}" -t 'attr' -n 'scheme' -v 'https' \
        -i "/Server/Service/${UUID}" -t 'attr' -n 'secure' -v 'true' \
        -i "/Server/Service/${UUID}" -t 'attr' -n 'clientAuth' -v 'false' \
        -i "/Server/Service/${UUID}" -t 'attr' -n 'sslProtocol' -v 'TLS' \
        -i "/Server/Service/${UUID}" -t 'attr' -n 'KeystoreFile' -v "$CATALINA_HOME/.keystore" \
        -i "/Server/Service/${UUID}" -t 'attr' -n 'KeystorePass' -v "${KEY_PASS}" \
        -r "/Server/Service/${UUID}" -v 'Connector' \
    conf/server.xml
fi

#Run the export server
cd /usr/local/drawio/draw-image-export2
npm start &
cd $CATALINA_HOME

exec "$@"