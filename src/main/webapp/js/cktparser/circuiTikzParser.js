let map = new Map(); // Used in parseXML()

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
        if(cell.id === "0" || cell.id === "1") { continue; }  // Ignore mxCell with id="0" and id="1"

        // Read mxCell attributes
        let id = null, value = null, source = null, target = null, style = new Map();
        if(cell.hasAttribute('id')) { id = cell.getAttribute('id'); }
        if(cell.hasAttribute('value')) { value = cell.getAttribute('value'); }
        if(cell.hasAttribute('source')) { source = cell.getAttribute('source'); }
        if(cell.hasAttribute('target')) { target = cell.getAttribute('target'); }
        if(cell.hasAttribute('style')) {
            let splitStyle = cell.getAttribute('style').split(';');
            for (let j = 0; j < splitStyle.length-1; j++) { // Ignore last element of ""
                style.set(splitStyle[j].split('=')[0], splitStyle[j].split('=')[1]);
            }
        }

        // Create appropriate object (Node, Path, Line)
        // Access lookup table to figure out what type this component should be
        // No lookup table now so default to Path and Line types
        // Add specific x, y ratios for line connections (ex) american-style inductor is x:0/1, y:1 and lines connect to bottom corners)

        if(style.has('shape')) { // Non-line
            let component = new CktPath(id, value, style);
            let mxG = cell.children[0]; // mxGeometry, as only child of mxCell
            let x, y, w, h;

            if(mxG.hasAttribute('x')) {
                x = parseFloat(mxG.getAttribute('x'));
                component.add('x', x); }
            if(mxG.hasAttribute('y')) {
                y = parseFloat(mxG.getAttribute('y'));
                component.add('y', y); }
            if(mxG.hasAttribute('width')) {
                w = parseFloat(mxG.getAttribute('width'));
                component.add('width', w); }
            if(mxG.hasAttribute('height')) {
                h = parseFloat(mxG.getAttribute('height'));
                component.add('height', h); }

            if(!style.has('rotation')) { // Not rotated
                component.addVertex(x,y+(h/2)); // Start point
                component.addVertex(x+w, y+(h/2)); // End point
            } else { // Rotated
                let r = parseFloat(style.get('rotation'));
                let rv = getRotatedVertices(x+(w/2), y+(h/2), w, h, r);
                let rx = 0, ry = 0.5; // Default ratios
                component.addVertex(  // Start point
                    (((1-ry) * rv[0].x) + (ry * rv[3].x)).toFixed(3),
                    (((1-ry) * rv[0].y) + (ry * rv[3].y)).toFixed(3));
                component.addVertex(  // End point
                    (((1-ry) * rv[1].x) + (ry * rv[2].x)).toFixed(3),
                    (((1-ry) * rv[1].y) + (ry * rv[2].y)).toFixed(3));
            }
            map.set(id, component);
        } else { // Line
            let line = new CktLine(id, value, style);
            if(source !== null) { line.setSource(source); }
            if(target !== null) { line.setTarget(target); }

            let mxGChild = cell.children[0].children;
            let arr = cell.children[0].children[2].children; // mxPoints in Array in mxGeometry in mxCell
            for(let j = 0; j < arr.length; j++) { // Get from mxPoints inside Array
                line.addVertex(
                    (parseFloat(arr[j].getAttribute('x'))).toFixed(3),
                    (parseFloat(arr[j].getAttribute('y'))).toFixed(3));
            }

            if(source === null) {
                for(let j = 0; j < mxGChild.length; j++) {
                    if(mxGChild[j].getAttribute('as') === 'sourcePoint') {
                        line.addVertex(
                            (parseFloat(mxGChild[j].getAttribute('x'))).toFixed(3),
                            (parseFloat(mxGChild[j].getAttribute('y'))).toFixed(3),
                            0);
                        break;
                    } } }
            if(target === null) {
                for(let j = 0; j < mxGChild.length; j++) {
                    if(mxGChild[j].getAttribute('as') === 'targetPoint') {
                        line.addVertex(
                            (parseFloat(mxGChild[j].getAttribute('x'))).toFixed(3),
                            (parseFloat(mxGChild[j].getAttribute('y'))).toFixed(3));
                        break;
                    } } }

            lines.push(line);
        } // End of if-else for processing non-line and line components
    } // End of for loop to process mxCells

    // Add start and end points (where connect to non-line components) to lines and add lines to 'map'
    lines.forEach(line => {
        if(line.source !== null) {
            let [endX, endY] = getEndPoints(map.get(line.source), line);
            line.addVertex(endX, endY, 0);
        }
        if(line.target !== null) {
            let [endX, endY] = getEndPoints(map.get(line.target), line);
            line.addVertex(endX, endY);
        }

        map.set(line.id, line);
    });
}

/* Calculates the appropriate origin point (lower-left corner) for drawing the Circuitikz diagram.
   Parses the coordinates of all components in 'data'
        to find smallest x and largest y values in the lower-left corner of drawio diagram.
   For non-line components, considers coordinates of four rotated vertices.
   For lines, considers the vertices property.
*/
function getCTOrigin() {
    let minX = 10000, maxY = 0;
    for(let i = 0; i < data.length; i++) {
        let cell = data[i];
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
    rVertices.push({x: center_x - (width * cos) - (height * sin), y: center_y - (width * sin) + (height * cos)});
    // upper-right (x,y)
    rVertices.push({x: center_x + (width * cos) - (height * sin), y: center_y + (width * sin) + (height * cos)});
    // lower-right (x,y)
    rVertices.push({x: center_x + (width * cos) + (height * sin), y: center_y + (width * sin) - (height * cos)});
    // lower-left (x,y)
    rVertices.push({x: center_x - (width * cos) + (height * sin), y: center_y - (width * sin) - (height * cos)});

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
    let rv = getRotatedVertices(x + (w/2), y + (h/2), w, h, r);

    if(comp.id === line.source) { x = 'exitX'; y = 'exitY'; }
    else if(comp.id === line.target) { x = 'entryX'; y = 'entryY'; }
    x = line.style.get(x); // x: String -> Fraction (0 ~ 1)
    y = line.style.get(y);

    // Calculate end coords using four corners and x and y
    let upperX = ((1-x) * rv[0].x) + (x * rv[1].x);
    let upperY = ((1-x) * rv[0].y) + (x * rv[1].y);
    let lowerX = ((1-x) * rv[3].x) + (x * rv[2].x);
    let lowerY = ((1-x) * rv[3].y) + (x * rv[2].y);

    x = ((1-y) * upperX) + (y * lowerX); // x: Fraction (0 ~ 1) -> Floating point
    y = ((1-y) * upperY) + (y * lowerY);

    return [x.toFixed(3), y.toFixed(3)];
}
