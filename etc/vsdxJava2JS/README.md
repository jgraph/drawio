# JSweet quick start

A simple project to get started with JSweet. This project just contains a main method that shows 'Hello world' messages in two different ways. The program uses the [J4TS](https://github.com/cincheo/j4ts) candy to access `java.util` API, and the jQuery candy. Programmers can use it to set up a new JSweet project and try out some basic features.

## Usage

```
> git clone https://github.com/cincheo/jsweet-quickstart.git
> cd jsweet-quickstart
> mvn generate-sources
> firefox webapp/index.html
```

## Modify

At any time, you can modify the Java files (or add new files) and run ``mvn generate-sources`` to generate the corresponding JavaScript files. You can then use them in the ``index.html`` file (``<script>`` tags).

You can modify the generation options by modifying the plugin section for ``jsweet-maven-plugin``. When having a  project with multiple source files, a good generation option to turn on is the ``bundle`` option, in order to generate all the JavaScript classes in a single file. Check the [Maven plugin](https://github.com/lgrignon/jsweet-maven-plugin) for the full option list.  

If you want to use a JavaScript library (besides jQuery which is already enabled), you must add the Maven dependency in the ``<dependencies>`` section of the ``pom.xml``. You can copy-paste the Maven dependency description from our [Candy browser](http://www.jsweet.org/candies-snapshots/), or from our online [Maven repository](http://repository.jsweet.org/artifactory/webapp/#/artifacts/browse/tree/General/libs-snapshot-local). When running ``mvn generate-sources`` with a new library, if available in the candy, the JavaScript library will be extracted to the location given by the ``candiesJsOut`` option (here in the ``webapp`` directory). JavaScript libraries are packaged in the Jar following the [WebJars](http://www.webjars.org/) conventions. When not available, you will need to find and download the JavaScript library manually (or using a third-party tool such as [Bower](https://bower.io/)). 

## Prerequisites

- Java 8 JDK is required. Type in ``java -version`` in a console to make sure that you have a >1.8 JDK.
- The `node` and `npm` executables must be in the path (https://nodejs.org).
- Install Maven (https://maven.apache.org/install.html).

