class CktComponent {
    constructor(id, value, style) {
        this.id = id;
        this.value = value;
        this.style = style;
    }

    add(key, value) {
        this[key] = value;
    }
}

class CktNode extends CktComponent {}

class CktPath extends CktComponent {
    constructor(id, value, style) {
        super(id, value, style);
        this.vertices = [];
    }

    addVertex(x, y, pos=1) { // If pos=0, add to front, if pos=1, add to end
        if(pos === 0) { this.vertices.unshift({x: x, y: y}); }
        else if (pos === 1) { this.vertices.push({x: x, y: y}); }
    }
}

class CktLine extends CktPath { // Only for line components
    constructor(id, value, style) {
        super(id, value, style);
        this.source = null;
        this.target = null;
    }

    setSource(source) {
        this.source = source;
    }

    setTarget(target) {
        this.target = target;
    }
}
