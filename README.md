[![Build Status](https://travis-ci.com/jgraph/drawio.svg?branch=master)](https://travis-ci.com/jgraph/drawio)

About
-----
draw.io, this project, is a configurable diagramming/whiteboarding visualization application. draw.io is owned and developed by JGraph Ltd, a UK based software company.

As well as running this project, we run a production-grade deployment of the diagramming interface at https://app.diagrams.net.

License
-------
The source code in this repo is licensed under the Apache v2.

The JGraph provided icons and diagram templates are licensed under the [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Additional terms may also apply where the icons are originally defined by a third-party copyright holder. We have checked in all cases that the original license allows use in this project.

Additional minified JavaScript files and Java libraries are used in this project. All of the licenses are deemed compatible with the Apache 2.0, nothing is GPL or AGPL ,due dilgence is performed on all third-party code.

Scope of the Project
--------------------

draw.io is a diagramming or whiteboarding application, depending on which theme is selected. It is not an SVG editing app, the SVG export is designed only for embedding in web pages, not for further editing in other tools.

The application is designed to be used largely as-is. It's possible to alter the major parts of the interface, but if you're looking for an editor with very specific editing features, the project is likely not a good base to use.

That is to say, if you wanted to create/deply a whiteboard or diagramming application where the functionality in the main canvas is as this project provides, it more likely to be a good base to use. 
The default libraries, the menus, the toolbar, the default colours, the storage location, these can all be changed.

If you are using a draw.io project/product and have issues or questions about the editor itself, the issue tracker and discussion in this GitHub project are likely a good place to look.

Running
-------
One way to run diagrams.net is to fork this project, [publish the master branch to GitHub pages](https://help.github.com/categories/github-pages-basics/) and the [pages sites](https://jgraph.github.io/drawio/src/main/webapp/index.html) will have the full editor functionality (sans the integrations).

Another way is to use [the recommended Docker project](https://github.com/jgraph/docker-drawio) or to download [draw.io Desktop](https://get.diagrams.net).

The full packaged .war of the client and servlets is built when the project is tagged and available on the [releases page](https://github.com/jgraph/draw.io/releases).

Supported Browsers
------------------
diagrams.net supports Chrome 70+, Firefox 70+, Safari 11+, Opera 50+, Native Android browser 7x+, the default browser in the current and previous major iOS versions (e.g. 11.2.x and 10.3.x) and Edge 79+.

Open-source, not open-contribution
----------------------------------

[Similar to SQLite](https://www.sqlite.org/copyright.html), diagrams.net is open
source but closed to contributions.

The level of complexity of this project means that even simple changes 
can break a _lot_ of other moving parts. The amount of testing required 
is far more than it first seems. If we were to receive a PR, we'd have 
to basically throw it away and write it how we want it to be implemented.

We are grateful for community involvement, bug reports, & feature requests. We do
not wish to come off as anything but welcoming, however, we've
made the decision to keep this project closed to contributions for 
the long term viability of the project.
