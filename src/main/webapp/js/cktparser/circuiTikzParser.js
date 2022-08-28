let map = new Map(); // Used in parseXML()
let lookup; // Map as lookup table

/* Automatically called by drawio's JS code.
   Find in js/diagramly/EditorUi.js by searching for the function name.
   Parses the XML in drawio and saves XML elements in 'map'.
 */
function parseXML(xmlStr) {
    map.clear(); // Clear contents of 'map'
    let lines = []; // Keep lines to add end points before adding to 'map'
    let xml = new DOMParser().parseFromString(xmlStr, "text/xml"); // Parse string into XML

    let mxCells = xml.getElementsByTagName("mxCell"); // Get all mxCells as an array
    for (let i = 0; i < mxCells.length; i++) { // Process each mxCell in order
        let cell = mxCells.item(i); // Get one mxCell
        if (cell.id === "0" || cell.id === "1") {
            continue;
        }  // Ignore mxCell with id="0" and id="1"

        // Read mxCell attributes
        let id = null, value = null, source = null, target = null, style = new Map();
        if (cell.hasAttribute('id')) {
            id = cell.getAttribute('id');
        }
        if (cell.hasAttribute('value')) {
            value = cell.getAttribute('value');
        }
        if (cell.hasAttribute('source')) {
            source = cell.getAttribute('source');
        }
        if (cell.hasAttribute('target')) {
            target = cell.getAttribute('target');
        }
        if (cell.hasAttribute('style')) {
            let splitStyle = cell.getAttribute('style').split(';');
            for (let j = 0; j < splitStyle.length - 1; j++) { // Ignore last element of ""
                style.set(splitStyle[j].split('=')[0], splitStyle[j].split('=')[1]);
            }
        }

        if (style.has('shape')) { // Non-line
            let component, shape = style.get('shape').concat(';');

            if (shape === 'ellipse;') {
                shape += `value="${value}";`;
            } else if (style.has('elSignalType')) {
                shape += `elSignalType=${style.get('elSignalType')};`;
                style.delete('elSignalType');
                if (style.has('elSourceType')) {
                    shape += `elSourceType=${style.get('elSourceType')};`;
                    style.delete('elSourceType');
                }
            } else if (style.has('operation')) {
                shape += `operation=${style.get('operation')};`;
                style.delete('operation');
                if (style.has('negating')) {
                    shape += `negating=${style.get('negating')};`;
                    style.delete('negating');
                }
                if (style.has('negSize')) {
                    shape += `negSize=${style.get('negSize')};`;
                    style.delete('negSize');
                }
            } else if (style.has('labelNames')) {
                shape += `labelNames=${style.get('labelNames')};`;
                style.delete('labelNames');
            } else if (style.has('direction')) {
                shape += `direction=${style.get('direction')};`;
                style.delete('direction');
            } else if (style.has('pointerEvents') &&
                (shape === 'mxgraph.electrical.opto_electronics.7_segment_display;' ||
                    shape === 'mxgraph.electrical.opto_electronics.7_segment_display_with_dp;' ||
                    shape === 'mxgraph.electrical.opto_electronics.led_2;' ||
                    shape === 'mxgraph.electrical.opto_electronics.light-activated_scr;' ||
                    shape === 'mxgraph.electrical.opto_electronics.photodiode;' ||
                    shape === 'mxgraph.electrical.opto_electronics.photo_resistor_2;')) {
                shape += `pointerEvents=${style.get('pointerEvents')};`;
                style.delete('pointerEvents');
            } else if (style.has('aspect')) {
                shape += `aspect=${style.get('aspect')};`;
                style.delete('aspect');
                if (style.has('elSwitchState')) {
                    shape += `elSwitchState=${style.get('elSwitchState')};`;
                    style.delete('elSwitchState');
                }
            }

            if (lookup.has(shape)) {
                let lookupObj = lookup.get(shape);
                if (lookupObj.type === 'node') {
                    component = new CktNode(id, value, style, lookupObj.circuitikzshape);
                } else {
                    component = new CktPath(id, value, style, lookupObj.circuitikzshape);
                }
            } else {
                component = new CktComponent(id, value, style, 'NO CIRCUITIKZ MATCH');
            }

            let mxG = cell.children[0]; // mxGeometry, as only child of mxCell
            let x, y, w, h;

            if (mxG.hasAttribute('x')) {
                x = parseFloat(mxG.getAttribute('x'));
                component.add('x', x);
            }
            if (mxG.hasAttribute('y')) {
                y = parseFloat(mxG.getAttribute('y'));
                component.add('y', y);
            }
            if (mxG.hasAttribute('width')) {
                w = parseFloat(mxG.getAttribute('width'));
                component.add('width', w);
            }
            if (mxG.hasAttribute('height')) {
                h = parseFloat(mxG.getAttribute('height'));
                component.add('height', h);
            }

            if (component instanceof CktNode) { // Node-style components
                component.addVertex(x + (w / 2), y + (h / 2)); // Center point, no change even with rotation
            } else if (!style.has('rotation')) { // Not rotated
                component.addVertex(x, y + (h / 2)); // Start point
                component.addVertex(x + w, y + (h / 2)); // End point
            } else { // Rotated
                let r = parseFloat(style.get('rotation'));
                let rv = getRotatedVertices(x + (w / 2), y + (h / 2), w, h, r);
                let rx = 0, ry = 0.5; // Default ratios
                component.addVertex(  // Start point
                    (((1 - ry) * rv[0].x) + (ry * rv[3].x)).toFixed(3),
                    (((1 - ry) * rv[0].y) + (ry * rv[3].y)).toFixed(3));
                component.addVertex(  // End point
                    (((1 - ry) * rv[1].x) + (ry * rv[2].x)).toFixed(3),
                    (((1 - ry) * rv[1].y) + (ry * rv[2].y)).toFixed(3));
            }
            map.set(id, component);
        } else { // Line
            let line = new CktLine(id, value, style);
            if (source !== null) {
                line.setSource(source);
            }
            if (target !== null) {
                line.setTarget(target);
            }

            let mxGChild = cell.children.item(0).children; // mxPoints in mxGeometry in mxCell
            if (mxGChild.item(2) !== null) { // null for line with loose ends and no other vertices
                let arr = mxGChild.item(2).children;
                if (arr.length > 0) { // If arr doesn't exist, returns empty list of length 0
                    for (let j = 0; j < arr.length; j++) { // Get from mxPoints inside Array
                        line.addVertex(arr[j].getAttribute('x'), arr[j].getAttribute('y'));
                    }
                }
            }

            if (source === null) {
                for (let j = 0; j < mxGChild.length; j++) {
                    if (mxGChild[j].getAttribute('as') === 'sourcePoint') {
                        line.addVertex(
                            (parseFloat(mxGChild[j].getAttribute('x'))).toFixed(3),
                            (parseFloat(mxGChild[j].getAttribute('y'))).toFixed(3),
                            0);
                        break;
                    }
                }
            }
            if (target === null) {
                for (let j = 0; j < mxGChild.length; j++) {
                    if (mxGChild[j].getAttribute('as') === 'targetPoint') {
                        line.addVertex(
                            (parseFloat(mxGChild[j].getAttribute('x'))).toFixed(3),
                            (parseFloat(mxGChild[j].getAttribute('y'))).toFixed(3));
                        break;
                    }
                }
            }

            lines.push(line);
        } // End of if-else for processing non-line and line components
    } // End of for loop to process mxCells

    // Add start and end points (where connect to non-line components) to lines and add lines to 'map'
    lines.forEach(line => {
        if (line.source !== null) {
            let [endX, endY] = getEndPoints(map.get(line.source), line);
            line.addVertex(endX, endY, 0);
        }
        if (line.target !== null) {
            let [endX, endY] = getEndPoints(map.get(line.target), line);
            line.addVertex(endX, endY);
        }

        map.set(line.id, line);
    });
}

/* Creates Circuitikz code from 'map'.
 */
function createCkt() {
    let cktStr = "\\begin{circuitikz}\n\t\\draw ";
    map.forEach((value, key, map) => {
        if (value instanceof CktLine) {
            let vertices = value.vertices;
            let str = "";
            for (let i = 0; i < vertices.length; i++) {
                str += `(${adjust(vertices[i].x)},${adjust(vertices[i].y, 1)})`;
                if (i < vertices.length - 1) {
                    str += ' -- ';
                }
            }
            str += "\n\t";
            cktStr += str;
        } else if (value instanceof CktPath) {
            let str = "";
            let sx = adjust(value.vertices[0].x), sy = adjust(value.vertices[0].y, 1);
            let ex = adjust(value.vertices[1].x), ey = adjust(value.vertices[1].y, 1);
            str += `(${sx},${sy}) to[${value.cktShape}`;
            if (value.value) {
                str += `=${value.value}`;
            } // If there is value (label in drawio)
            str += `] (${ex},${ey})\n\t`;
            cktStr += str;
        } else if (value instanceof CktNode) {
            let str = "";
            let sx = adjust(value.vertices[0].x), sy = adjust(value.vertices[0].y, 1);
            let cktShape = value.cktShape;
            let number = 0; // TODO: Get number for '7 segment display with DP' (NOT value.value)
            if (cktShape === 'seven segment val=;dot on box off') {
                let csSplit = cktShape.split(';');
                cktShape = csSplit[0] + number + csSplit[1];
            }
            str += `(${sx},${sy}) node[${cktShape}]`;
            if (value.cktShape === 'ieeestd nor port') {
                str += "(N)";
            }
            if (value.value) {
                str += `{${value.value}}\n\t`;
            } else {
                str += "{}\n\t";
            }
            cktStr += str;
        } else { // If CktComponent
        }

    });
    cktStr += ";\n\\end{circuitikz}";
    return cktStr;
}

/* Adjust the x or y coordinate from drawio for use with Circuitikz.
   In drawio, (x=0,y=0) is the upper-left corner.
   In Circuitikz, (x=0,y=0) is the lower-left corner.
   Use getCktOrigin() to calculate a relative origin point to the left and below the circuit.
   For the given x or y coordinate, get the absolute distance from the origin and divide by 40.
   40 in drawio corresponds to the difference between two thick lines and appears equivalent to 1 in Circuitikz.
   Parameters (If omitted, all 0 by default):
        number: x or y coordinate to adjust.
        axis: if axis=0, treat number as x coordinate; if axis=1, treat number as y coordinate.
 */
function adjust(number = 0, axis = 0) {
    let origin = getCktOrigin();
    const x = origin.x, y = origin.y;
    if (axis === 0) { // axis=0 -> x coordinate
        return (Math.abs(number - x) / 40.0).toFixed(3);
    } else { // axis=1 -> y coordinate
        return (Math.abs(number - y) / 40.0).toFixed(2);
    }
}

/* Calculates the appropriate origin point (lower-left corner) for drawing the Circuitikz diagram.
   Parses the coordinates of all components in 'map' to find the smallest x and largest y values.
   For non-line components, considers coordinates of four rotated vertices.
   For lines, considers the vertices property.
*/
function getCktOrigin() {
    let minX = 10000.0, maxY = 0.0;
    map.forEach((value, key, map) => {
        if (value instanceof CktLine) { // Check first, b/c also returns true for 'value instanceof CktPath'
            for (let i = 0; i < value.vertices.length; i++) {
                if (value.vertices[i].x < minX) {
                    minX = value.vertices[i].x;
                }
                if (value.vertices[i].y > maxY) {
                    maxY = value.vertices[i].y;
                }
            }
        } else { // CktPath or CktNode or CktComponent
            let rotatedVertices = getRotatedVertices(value.x + (value.width / 2), value.y + (value.height / 2), value.width, value.height, value.rotation);
            for (let i = 0; i < rotatedVertices.length; i++) {
                if (rotatedVertices[i].x < minX) {
                    minX = rotatedVertices[i].x;
                }
                if (rotatedVertices[i].y > maxY) {
                    maxY = rotatedVertices[i].y;
                }
            }
        }
    });
    return {x: Math.floor(parseFloat(minX) - 10), y: Math.ceil(parseFloat(maxY) + 10)};
}

/* Calculates the (x,y) coordinates of a rotated rectangle's vertices.
   Each component in draw.io has a rectangle as its boundary.
   Rotation is in the clockwise direction, with the positive x-axis as 0 degrees.
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
    rVertices.push({x: center_x - (width * cos) + (height * sin), y: center_y - (width * sin) - (height * cos)});
    // upper-right (x,y)
    rVertices.push({x: center_x + (width * cos) + (height * sin), y: center_y + (width * sin) - (height * cos)});
    // lower-right (x,y)
    rVertices.push({x: center_x + (width * cos) - (height * sin), y: center_y + (width * sin) + (height * cos)});
    // lower-left (x,y)
    rVertices.push({x: center_x - (width * cos) - (height * sin), y: center_y - (width * sin) + (height * cos)});

    return rVertices;
}

/* Calculate the exact (x,y) coordinates where the component and line are connected.
   These coordinates are either the starting point or the end point of the line.
 */
function getEndPoints(comp, line) {
    let x = parseFloat(comp.x);
    let y = parseFloat(comp.y);
    let w = parseFloat(comp.width);
    let h = parseFloat(comp.height);
    let r = comp.style.has('rotation') ? parseFloat(comp.style.get('rotation')) : 0.0;
    let rv = getRotatedVertices(x + (w / 2), y + (h / 2), w, h, r);

    if (comp.id === line.source) {
        x = 'exitX';
        y = 'exitY';
    } else if (comp.id === line.target) {
        x = 'entryX';
        y = 'entryY';
    }
    x = line.style.get(x); // x: String -> Fraction (0 ~ 1)
    y = line.style.get(y);

    // Calculate end coords using four corners and x and y
    let upperX = ((1 - x) * rv[0].x) + (x * rv[1].x);
    let upperY = ((1 - x) * rv[0].y) + (x * rv[1].y);
    let lowerX = ((1 - x) * rv[3].x) + (x * rv[2].x);
    let lowerY = ((1 - x) * rv[3].y) + (x * rv[2].y);

    x = ((1 - y) * upperX) + (y * lowerX); // x: Fraction (0 ~ 1) -> Floating point
    y = ((1 - y) * upperY) + (y * lowerY);

    return [x.toFixed(2), y.toFixed(2)];
}

/* On loading of the window, create a lookup table in the JS Map object "lookup".

   Key: DrawIO shape
   Value: Object with properties of DrawIO shape, Circuitikz shape, and object type
 */
window.onload = function () {
    lookup = new Map();
    let array = new Array();
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", "./js/cktparser/drawioshape.csv", true);
    rawFile.send(null);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                let lines = rawFile.responseText.split("\r\n");
                for (let i = 0; i < lines.length; i++) {
                    array.push({drawioshape: lines[i]});
                }
                rawFile.open("GET", "./js/cktparser/circuitikzshape.csv", true);
                rawFile.send(null);
                rawFile.onreadystatechange = function () {
                    if (rawFile.readyState === 4) {
                        if (rawFile.status === 200 || rawFile.status == 0) {
                            let lines = rawFile.responseText.split("\r\n");
                            for (let i = 0; i < lines.length; i++) {
                                array.at(i).circuitikzshape = lines[i];
                            }
                            rawFile.open("GET", "./js/cktparser/objtype.csv", true);
                            rawFile.send(null);
                            rawFile.onreadystatechange = function () {
                                if (rawFile.readyState === 4) {
                                    if (rawFile.status === 200 || rawFile.status == 0) {
                                        let lines = rawFile.responseText.split("\r\n");
                                        for (let i = 0; i < lines.length; i++) {
                                            array.at(i).type = lines[i];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        for (let i = 0; i < array.length; i++) {
            lookup.set(array[i]["drawioshape"], array[i]);
        }
    } // End of first rawFile.onreadystatechange
}