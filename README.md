## draw.io project sources

draw.io comprises three parts:

1. The static web content under the `war/` directory.
2. The open, save, embed, proxy and iconfinder servlets as one servlet war. These are located under `src/com/mxgraph/online/`.
3. The image export servlet. This is located under `etc/imageexport/`.

Prior to invoking any builds, search `war/index.html` for *CUSTOM_PARAMETERS*. The image *EXPORT_URL* is the most important variable to change. 
Without that the export to image will use our server, which somewhat defeats the point of hosting it. The servlet is mapped to *export* and the default name 
of the war is *Imageexport* so `/Imageexport/export` is the value if you deploy that war as-is and the servlet engine is on the root of the domain.

* `/etc/build/build.xml` is the ant build file for the main war. Invoking `ant war` will generate `build/draw.war`.

* `/etc/imagexport/build.xml` is the ant build file for the image export war. Invoking `ant war` will generate `etc/imageexport/imageexport.war`.

Deploy these wars on a servlet engine and navigate to the location of the first war, you will get the draw.io application.

## Licensing

The underlying mxGraph library is licensed to you either the [CCNC](http://creativecommons.org/licenses/by-nc-sa/3.0/) or the 
[mxGraph commercial license](http://www.jgraph.com/mxlicense.html) (if you're a paying customer). Please understand that we make 
a living selling the mxGraph library commercially, we need to avoid draw.io being 
used freely where mxGraph would previously have been sold.

The source to draw.io itself is Apache 2.0 licensed (or mxGraph Commercial License), but obviously the mxGraph license dominates this for commercial 
purposes.

We separate between developing against the mxGraph API and just deploying draw.io for general usage. Thus, we make exceptions to the CCNC license 
if you want to take draw.io as-is and deploy it for your own use (note this only affects commercial users). Below, we will build up a list of alterations 
you can make to draw.io without being subject to the mxGraph commercial license (note this only affects commercial users):

* You can alter draw.io paths so that the functionality works correctly in your deployment environment

* You can add and remove menu options and library stencil sets to/from the UI

If you require more exceptions, please add to issue tracker.
