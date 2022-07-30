// Single object holding all information on a circuit diagram
function CircuitData(mxCells = []) {
    this.mxCells = mxCells; // Default empty array
}

// Add a circuit component object to the array within a CircuitData object
CircuitData.prototype.addComponent = function(component) {
    this.mxCells.push(component);
}

// Objects representing one component in the circuit diagram
// All data (ex) id, value, shape, etc.) are saved as properties of this object
function CircuitComponent() {}

// Objects representing the mxCell and subordinate elements of the circuit diagram's XML
function CircuitElement(name = "mxCell", attrs = {}, child = null) {
    this.name = name; // Default name "mxCell"
    this.attrs = attrs; // Default empty object for attributes
    this.child = child; // Default null (no child)
}

// Attach a child to this element
CircuitElement.prototype.setChild = function(child) {
    this.child = child;
}

// Add an attribute to this element's attributes
CircuitElement.prototype.addAttr = function(name, value) {
    this.attrs[name] = value;
}