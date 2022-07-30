/* Automatically called by drawio's JS code.
   Find in js/diagramly/EditorUi.js by searching for the function name.
   Parses the XML in drawio and saves XML elements in a global JS object named 'data'.
   Simpler version than 'parseToCiruiTikzFull()',
        omits unnecessary data and saves everything as JS object properties.

   Line connecting two components: no 'shape', both 'source' and 'target'
        From attrs: id, value, everything in style, source, target
        From Array in mxGeometry: Array of (x,y) coordinates in mxPoint
        Ignore mxPoint in mxGeometry, only mxPoint inside Array
   Line with loose end: no 'shape', either 'source' or 'target'
        From attrs: id, value, everything in style, source/target
        From Array in mxGeometry: Array of (x,y) coordinates in mxPoint
        If only source, (x,y) from mxPoint in mxGeometry labelled targetPoint
        If only target, (x,y) from mxPoint in mxGeometry labelled sourcePoint
   Non-line component: 'shape' under 'style', no 'source' and no 'target'
        From attrs: id, value, everything in style
        From mxGeometry: x, y, width, height
 */
function parseToCircuiTikz(xmlStr) {
    // Parse XML string into XML format
    let parser = new DOMParser();
    xml = parser.parseFromString(xmlStr, "text/xml");
    // 'data': JS object of array of JS objects (one CircuitComponent object for each circuit component)
    data = new CircuitData();

    let mxCells = xml.getElementsByTagName("mxCell"); // Get all mxCells as an array
    for (let i = 0; i < mxCells.length; i++) { // Process each mxCell in order
        let component = new CircuitComponent(); // JS object to hold all data from one mxCell
        let cell = mxCells.item(i); // Get one mxCell
        if(cell.id === "0" || cell.id === "1") { continue; }  // Ignore mxCell with id="0" and id="1"
        let attrNames = cell.getAttributeNames(); // Get all attribute names as an array
        let type; // Type of component (mxCell's children processed differently by type)
                  // 0 for line with both ends, 1 for line with only source,
                  // 2 for line with only target, 3 for non-line component

        // Get from mxCell attributes
        for (let j = 0; j < attrNames.length; j++) {
            if(['id', 'value', 'source', 'target'].includes(attrNames[j])) {
                component[attrNames[j]] = cell.getAttribute(attrNames[j]);
            } else if (attrNames[j] === 'style') {
                let splitStyle = cell.getAttribute('style').split(';');
                for (let k = 0; k < splitStyle.length-1; k++) { // Last element is "", so ignore
                    component[splitStyle[k].split('=')[0]] = splitStyle[k].split('=')[1];
                }
            }
        }

        if(cell.hasAttribute('source') || cell.hasAttribute('target')) {
            if(cell.hasAttribute('source') && cell.hasAttribute('target')) { type = 0; }
            else if (cell.hasAttribute('source')) { type = 1; }
            else if (cell.hasAttribute('target')) { type = 2; }

            let mxGChild = cell.children[0].children;
            let point = {};
            for(let j = 0; j < mxGChild.length; j++) {
                if( (type === 2 && mxGChild[j].getAttribute('as') === 'sourcePoint') ||
                    (type === 1 && mxGChild[j].getAttribute('as') === 'targetPoint')
                ) {
                    point.x = parseFloat(mxGChild[j].getAttribute('x'));
                    point.y = parseFloat(mxGChild[j].getAttribute('y'));
                    break;
                }
            }

            let arr = cell.children[0].children[2].children; // mxPoints in Array in mxGeometry in mxCell
            component['vertices'] = []; // Array of line vertices' coordinates as {x,y}
            if(type === 2) { component['vertices'].push(point); } // 'source' coordinates before vertices coordinates
            for(let j = 0; j < arr.length; j++) { // Get from mxPoints inside Array
                component['vertices'].push({x : parseFloat(arr[j].getAttribute('x')), y : parseFloat(arr[j].getAttribute('y'))});
            }
            if(type === 1) { component['vertices'].push(point); } // 'target' coordinates after vertices coordinates
        } else { // Non-line component
            let mxG = cell.children[0]; // mxGeometry, as only child of mxCell
            let mxGAttrNames = mxG.getAttributeNames();
            for(let j = 0; j < mxGAttrNames.length; j++) { // Get from mxGeometry
                if(['x', 'y', 'width', 'height'].includes(mxGAttrNames[j])) {
                    component[mxGAttrNames[j]] = parseFloat(mxG.getAttribute(mxGAttrNames[j]));
                }
            }
        }

        data.addComponent(component);
    }
}

// Notes on XML
// Ignore mxCell with id="0" and id="1", required in XML for draw.io, but seems unnecessary for Circuitikz
// Regarding lines
//    With a line connecting two components, ignore mxPoints under mxGeometry,
//      instead Array with mxPoints designate the corners of the line,
//      in order of top to bottom the corners when drawing a line from the source to the target
//    With a line with only one end connected to a component, mxPoint under mxGeometry indicates location of loose end
//      If mxCell style attribute only has source attribute, mxPoint labelled targetPoint indicates loose end
//      If mxCell style attribute only has target attribute, mxPoint labelled sourcePoint indicates loose end
// 'style' attribute of lines
//    exitX=0 for source's connection point on left side at rotation=0, if =1 point on right side
//    exitY=0 for source's connection point on top side at rotation=0, if =1 point on bottom side
//    exitDx=10 shifts the source's connection point from left side in rightwards direction by one notch of grid
//    exitDy=10 shifts the source's connection point from top side in downward direction by one notch of grid
//    entryX / entryY / entryDx / entryDy are the same, but for the target component at rotation=0
// 'x' and 'y' in mxGeometry under mxCell indicates the upperleft corner of the component at rotation=0
//    x=10 moves rightwards by one notch of grid, x=40 for moving by one bold line; same for y=10 in downwards direction

/* Calculates the appropriate origin point (lower-left corner) for the Circuitikz diagram.
   Parses the coordinates of components and lines in 'data'
        to find smallest x and largest y values in the lower-left corner of drawio diagram.
   For non-line components, considers coordinates of four rotated vertices.
   For lines, considers the vertices property.
*/
function getCTOrigin() {
    let minX = 10000, maxY = 0;
    for(let i = 0; i < data.mxCells.length; i++) {
        let cell = data.mxCells[i];
        let rotatedVertices = [];

        // Non-line component: 'shape', no 'source', no 'target'
        if((cell.source == undefined) && (cell.target == undefined) && (cell.shape != undefined)) {
            rotatedVertices = getRotatedVertices(cell.x + (cell.width / 2), cell.y + (cell.height / 2), cell.width, cell.height, cell.rotation);
            for(let j = 0; j < rotatedVertices.length; j++) {
                if(rotatedVertices[j].x < minX) { minX = rotatedVertices[j].x; }
                if(rotatedVertices[j].y > maxY) { maxY = rotatedVertices[j].y; }
            }
        } else { // Line connecting two components and line with loose end: no 'shape'
            for(let j = 0; j < cell.vertices.length; j++) {
                if(cell.vertices[j].x < minX) { minX = cell.vertices[j].x; }
                if(cell.vertices[j].y > maxY) { maxY = cell.vertices[j].y; }
            }
        }
    }
    return { x : minX - 10.0, y : maxY + 10.0};
}

/* Calculates the (x,y) coordinates of a rotated rectangle's vertices.
   Rotation is in the clockwise direction, with the x-axis as 0 degrees.
        ex) Rotation of 90 degrees, rotates rectangle clockwise from horizontal to vertical.
   Parameters (If omitted, all 0 by default):
        center_x: x coordinate at the center of the rectangle.
        center_y: y coordinate at the center of the rectangle.
        width: Full width of the rectangle.
        height: Full height of the rectangle.
        degree: Degree of rotation, do not provide in radians.
 */
function getRotatedVertices(center_x = 0, center_y = 0, width = 0, height = 0, degree = 0) {
    width = width / 2; // Only half of width and height needed for this function
    height = height / 2;
    let rVertices = [];
    let rad = degree * Math.PI / 180;
    let cos = Math.cos(rad);
    let sin = Math.sin(rad);

    // upper-left (x,y)
    rVertices.push({x: center_x - (width * cos) - (height * sin), y: center_y - (width * sin) + (height * cos)});
    // upper-right (x,y)
    rVertices.push({x: center_x + (width * cos) - (height * sin), y: center_y + (width * sin) + (height * cos)});
    // lower-right (x,y)
    rVertices.push({x: center_x + (width * cos) + (height * sin), y: center_y + (width * sin) - (height * cos)});
    // lower-left (x,y)
    rVertices.push({x: center_x - (width * cos) + (height * sin), y: center_y - (width * sin) - (height * cos)});

    return rVertices;
}

// Automatically called by drawio's JS code.
// Find in app.min.js by searching for the function name.
// Parses the XML in drawio and saves XML elements in a global JS object named 'data'.
// All XML elements and the XML hierarchy are saved in full as a JS object.
function parseToCircuiTikzFull(xmlStr) {
    let parser = new DOMParser();
    xml = parser.parseFromString(xmlStr, "text/xml");

    data = new CircuitData();

    let mxCells = xml.getElementsByTagName("mxCell"); // Get all mxCells as an array
    for (let i = 0; i < mxCells.length; i++) {
        let cell = mxCells.item(i); // Get one mxCell
        let component = new CircuitElement(); // JS object for mxCell

        // Add attributes to component
        let cellAttr = cell.getAttributeNames(); // Get all attributes of mxCell as an array
        for (let j = 0; j < cellAttr.length; j++) {
            let attrName = cellAttr.at(j);
            let attrVal = cell.getAttribute(attrName);
            let splitAttr = attrVal.split(';');
            if (splitAttr.length != 1) { // When length is greater than 1, it's the 'style' attribute
                let styleAttr = {};
                for (let k = 0; k < splitAttr.length-1; k++) { // Last element is "", so ignore
                    styleAttr[splitAttr.at(k).split('=').at(0)] = splitAttr.at(k).split('=').at(1);
                }
                attrVal = styleAttr;
            }
            component.addAttr(attrName, attrVal);
        }
        // Add child(ren) to component
        if (cell.hasChildNodes()) {
            component.setChild(parseChild(cell.children));
        }

        data.addComponent(component);
    }
}

// Parses the XML in 'children' and called recursively to process children's children.
// Parameter 'children': HTMLCollection
// For use with parseToCircuiTikzFull()
function parseChild(children) {
    let retVal = [];
    for(let i = 0; i < children.length; i++) {
        let child = children.item(i);
        let node = new CircuitElement(child.tagName);

        // Add attributes to node
        let childAttr = child.getAttributeNames();
        for(let j = 0; j < childAttr.length; j++) {
            let attrName = childAttr.at(j);
            let attrVal = child.getAttribute(attrName);
            node.addAttr(attrName, attrVal);
        }

        if(child.hasChildNodes()) {
            node.setChild(parseChild(child.children));
        }

        if(children.length == 1) {
            retVal = node;
        } else { // If more than one child, returns array
            retVal.push(node);
        }
    }

    return retVal;
}

// For use with parseToCircuiTikzFull()
function getCTOriginFull() {
    let minX = 10000, maxY = 0;
    for(let i = 0; i < data.mxCells.length; i++) {
        let cell = data.mxCells[i];
        let rotatedVertices = [];

        if((cell.attrs.id == 0) || (cell.attrs.id == 1)) { // Ignore mxCell with id="0" and id="1"
            continue;
        }
        if( // Non-line component: 'shape' under 'style', no 'source', no 'target'
            (cell.attrs.source == undefined) &&
            (cell.attrs.target == undefined) &&
            (cell.attrs.style.shape != undefined)
        ) {
            rotatedVertices = getRotatedVertices(parseInt(cell.child.attrs.x) + parseInt(cell.child.attrs.width/2), parseInt(cell.child.attrs.y) + parseInt(cell.child.attrs.height/2), cell.child.attrs.width, cell.child.attrs.height, cell.attrs.style.rotation);
            console.log(rotatedVertices);
            for(let j = 0; j < rotatedVertices.length; j++) {
                if(rotatedVertices[j].x < minX) {
                    minX = rotatedVertices[j].x;
                }
                if(rotatedVertices[j].y > maxY) {
                    maxY = rotatedVertices[j].y;
                }
            }
        } else if ( // Line connecting two components: no 'shape', both 'source' and 'target'
            (cell.attrs.style.shape == undefined) &&
            (cell.attrs.source != undefined) &&
            (cell.attrs.target != undefined)
        ) {
            let child = cell.child.child; // Array under mxGeometry under mxCell
            for(let j = 0; j < child.length; j++) {
                if(child[j].name == "Array") {
                    for(let k = 0; k < child[j].child.length; k++) {
                        if(child[j].child[k].attrs.x < minX) {
                            minX = child[j].child[k].attrs.x;
                        }
                        if(child[j].child[k].attrs.y > maxY) {
                            maxY = child[j].child[k].attrs.y;
                        }
                    }
                    break;
                }
            }
        } else if ( // Line with loose end: no 'shape', either 'source' or 'target'
            (cell.attrs.style.shape == undefined) &&
            (cell.attrs.source != undefined) || (cell.attrs.target != undefined)
        ) {
            let child = cell.child.child; // Array under mxGeometry under mxCell
            for(let j = 0; j < child.length; j++) {
                // 'source' designated, check mxPoint as="targetPoint"
                if((cell.attrs.source != undefined && child[j].attrs.as == 'targetPoint') ||
                    (cell.attrs.target != undefined && child[j].attrs.as == 'sourcePoint')) {
                    // 'target' designated, check mxPoint as="sourcePoint"
                    if(child[j].attrs.x < minX) {
                        minX = child[j].attrs.x;
                    }
                    if(child[j].attrs.y > maxY) {
                        maxY = child[j].attrs.y;
                    }
                }
                if(child[j].name == "Array") {
                    for(let k = 0; k < child[j].child.length; k++) {
                        if(child[j].child[k].attrs.x < minX) {
                            minX = child[j].child[k].attrs.x;
                        }
                        if(child[j].child[k].attrs.y > maxY) {
                            maxY = child[j].child[k].attrs.y;
                        }
                    }
                }
            }
        }
    }
    return { x : parseFloat(minX)-10, y : parseFloat(maxY)+10};
}