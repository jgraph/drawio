#! /bin/bash
#
# Copyright (c) 2016, JGraph Ltd

# https://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in
mkdir -p build/.sandstorm/client
cp -v ssindex.html build/.sandstorm/client
cp -v sandstorm-pkgdef.capnp build/.sandstorm
cp -v ChangeLog build/.sandstorm
cp -v pgp-keyring build/.sandstorm
cp -v pgp-signature build/.sandstorm
cp -v description.md build/.sandstorm
cp -v shortDesc.txt build/.sandstorm
cp -v Makefile build/.sandstorm
cp -v server.c++ build/.sandstorm
cp -v ../../war/export.html build/.sandstorm/client
cp -v ../../war/favicon.ico build/.sandstorm/client
cp -v ../../war/open.html build/.sandstorm/client
cp -v ../../war/stencils.xml build/.sandstorm/client
cp -v ../../war/search.xml build/.sandstorm/client
mkdir -p  build/.sandstorm/client/images
cp -rf ../../war/images/* build/.sandstorm/client/images/
cp -v images/drawio448.png build/.sandstorm/client/images/
mkdir -p build/.sandstorm/client/img
cp -rf ../../war/img/* build/.sandstorm/client/img/
mkdir -p build/.sandstorm/client/js
cp -rf ../../war/js/* build/.sandstorm/client/js/
mkdir -p build/.sandstorm/client/mxgraph
cp -rf ../../war/mxgraph/* build/.sandstorm/client/mxgraph/
mkdir -p build/.sandstorm/client/plugins
cp -rf ../../war/plugins/* build/.sandstorm/client/plugins/
mkdir -p build/.sandstorm/client/resources
cp -rf ../../war/resources/* build/.sandstorm/client/resources/
mkdir -p build/.sandstorm/client/shapes
cp -rf ../../war/shapes/* build/.sandstorm/client/shapes/
mkdir -p build/.sandstorm/client/stencils
cp -rf ../../war/stencils/* build/.sandstorm/client/stencils/
mkdir -p build/.sandstorm/client/styles
cp -rf ../../war/styles/* build/.sandstorm/client/styles/
mkdir -p build/.sandstorm/client/templates
cp -rf ../../war/templates/* build/.sandstorm/client/templates/

echo "Compressing assets"
gfind build/.sandstorm/client -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.txt' -o -name '*.xml' | xargs gzip -k

echo "Creating file list"
cd build/.sandstorm
gfind ./client -type f -printf "%p\n" | cut -c 3- >  sandstorm-files.list
cat ../../rootFiles >> sandstorm-files.list
