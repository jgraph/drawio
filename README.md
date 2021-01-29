[![Build Status](https://travis-ci.com/jgraph/drawio.svg?branch=master)](https://travis-ci.com/jgraph/drawio)

About
-----
[diagrams.net](https://app.diagrams.net), [previously draw.io](https://www.diagrams.net/blog/move-diagrams-net), is an online diagramming web site that delivers the source in this project.

License
-------
The source code in this repo is licensed under the Apache v2.

Development
-----------

A development guide is being started on the GitHub project wiki. There is a [draw.io](http://stackoverflow.com/questions/tagged/draw.io) tag on Stack Overflow currently, please make sure any questions adhere to their guidelines for questions.

The [mxGraph documentation](https://jgraph.github.io/mxgraph/) provides a lot of the docs for the bottom part of the stack. There is an [mxgraph tag on SO](http://stackoverflow.com/questions/tagged/mxgraph).

Running
-------
One way to run diagrams.net is to fork this project, [publish the master branch to GitHub pages](https://help.github.com/categories/github-pages-basics/) and the [pages sites](https://jgraph.github.io/drawio/src/main/webapp/index.html) will have the full editor functionality (sans the integrations).

Another way is to use [the recommended Docker project](https://github.com/jgraph/docker-drawio) or to download [draw.io Desktop](https://get.diagrams.net).

The full packaged .war of the client and servlets is built when the project is tagged and available on the [releases page](https://github.com/jgraph/draw.io/releases).

Supported Browsers
------------------
diagrams.net supports IE 11, Chrome 70+, Firefox 70+, Safari 11+, Opera 50+, Native Android browser 7x+, the default browser in the current and previous major iOS versions (e.g. 11.2.x and 10.3.x) and Edge 79+.

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
