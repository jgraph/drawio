#! /bin/bash
#
# Copyright (c) 2014, JGraph Ltd

# https://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in
BUILD="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILDDIR="build"

echo
echo "Creating staging"

cd $BUILD
rm -rf $BUILDDIR
mkdir $BUILDDIR
cp -v $BUILD/Makefile $BUILD/$BUILDDIR/
cp -v $BUILD/sandstorm-pkgdef.capnp $BUILD/$BUILDDIR/
cp -v $BUILD/server.c++ $BUILD/$BUILDDIR/

cd build
mkdir client
cd client
cp -v ../../ssindex.html .
cp -v ../../ChangeLog .
cp -v ../../pgp-keyring .
cp -v ../../pgp-signature .
cp -v ../../description.md .
cp -v ../../shortDesc.txt .
cp -v ../../../../war/export.html .
cp -v ../../../../war/favicon.ico .
cp -v ../../../../war/open.html .
cp -v ../../../../war/stencils.xml .
cp -v ../../../../war/search.xml .
cp -v ../../../../war/shapeeditor.html .
mkdir -p images
cp -rf ../../../../war/images/* images/
cp -v ../../images/drawio448.png images/
mkdir -p img
cp -rf ../../../../war/img/* img/
mkdir -p js
cp -rf ../../../../war/js/* js/
mkdir -p mxgraph
cp -rf ../../../../war/mxgraph/* mxgraph/
mkdir -p plugins
cp -rf ../../../../war/plugins/* plugins/
mkdir -p resources
cp -rf ../../../../war/resources/* resources/
mkdir -p shapes
cp -rf ../../../../war/shapes/* shapes/
mkdir -p stencils
cp -rf ../../../../war/stencils/* stencils/
mkdir -p styles
cp -rf ../../../../war/styles/* styles/
mkdir -p templates
cp -rf ../../../../war/templates/* templates/

echo "Creating file list"
cd -
find . -printf "%p\n" | cut -c 3- >  sandstorm-files.list

echo "Creating sandstorm package"
make
echo "Distributable file is build/package.spk"