
var tap = require('tap');
var xelement = require('../lib/xelement');
var fs = require('fs');

var xmlString = "";
var xeleCatalog;


tap.test("Parsing xml", function (t) {
    
    xmlString = fs.readFileSync('./sampledata.xml', 'utf8');
    
    
    try {
        xeleCatalog = xelement.Parse(xmlString);
        t.equal(xeleCatalog.name, "catalog");
        t.equal(xeleCatalog.elements.length, 12);
    }
    catch (e) {
        t.bailout("unable to parse the xml...");
    }
    
    
    t.done();
});


//Creating a new instance
tap.test("Create new instance", function (t) {
    var ele = new xelement.XElement("Root");
    ele.value = "Sample Value";
    ele.attr.Attr1 = "att val 1";
    t.equal(ele.name , "Root");
    t.equal(ele.value, "Sample Value");
    t.equal(ele.attr.Attr1, "att val 1");
    t.done();
});


//descendants
tap.test("Get all descendants(author)", function (t) {
    var descs = xeleCatalog.descendants('author', true);
    t.equal(descs.length, 12);
    t.end();
});

//descendantsAndSelf
tap.test("Get all descendants and self(author)", function (t) {
    var descs = xeleCatalog.descendantsAndSelf('author');
    t.equal(descs[0].name, "catalog");
    t.equal(descs.length, 13);
    t.end();
});

//descendantFirst
tap.test("Get first descendant(author)", function (t) {
    var fd = xeleCatalog.descendantFirst('author1');
    t.equal(fd, undefined);
    fd = xeleCatalog.descendantFirst('author');
    t.equal(fd.name, "author");
    t.equal(fd.value, "Gambardella, Matthew");
    t.end();
});

//ancestor
tap.test("Get ancestor of element(author)", function (t) {
    var fd = xeleCatalog.descendantFirst('author');
    
    var ba = fd.ancestor('book', true)
    t.equal(ba.name, 'book');
    t.equal(ba.attr.id, "bk101");
    
    ba = fd.ancestor('catalog')
    t.equal(ba.name, 'catalog');
    t.end();
});

//siblings
tap.test("Get siblings of (book)", function (t) {
    var fd = xeleCatalog.descendantFirst('book');
    var siblings = fd.siblings();
    t.equal(siblings.length, 11);
    var foundSelf = false;
    for (var i = 0; i < siblings.length; i++) {
        if (siblings[i] == fd) {
            foundSelf = true;
            break;
        }
    }
    t.equal(foundSelf, false);
    t.equal(fd.firstElement().siblings("genre")[0].value, "Computer");
    t.end();
});

//element
tap.test("Get element with name", function (t) {
    var fd = xeleCatalog.element('book1');
    t.equal(fd, undefined);
    fd = xeleCatalog.element('book');
    t.equal(fd.name, 'book');
    t.equal(fd.attr.id, "bk101");
    t.end();
});

//elements
tap.test("Get elements with book name", function (t) {
    
    var eles = xeleCatalog.getElements('book', true);
    t.equal(eles.length, 12);
    
    var isAllBooks = true;
    for (var i = 0; i < eles.length; i++) {
        if (eles[i].name != "book") {
            isAllBooks = false;
            break;
        }
    }
    t.equal(isAllBooks, true);
    t.end();
});

//firstElement
tap.test("Get elements first element", function (t) {
    var fe = xeleCatalog.firstElement();
    t.equal(fe.name, "book");
    t.equal(fe.attr.id, "bk101");
    t.end();
});

//lastElement
tap.test("Get elements last element", function (t) {
    var fe = xeleCatalog.lastElement();
    t.equal(fe.name, "book");
    t.equal(fe.attr.id, "bk112");
    t.end();
});

//previousSibling
tap.test("Get previous sibling element", function (t) {
    var fd = xeleCatalog.descendantFirst('title', true);
    var ps = fd.previousSibling();
    
    t.equal(ps.name, "author");
    t.equal(fd.previousSibling().previousSibling(), undefined);
    t.end();

});

//nextSibling
tap.test("Get next sibling element", function (t) {
    var fd = xeleCatalog.descendantFirst('publish_date');
    var ps = fd.nextSibling();
    
    t.equal(ps.name, "description");
    t.equal(fd.nextSibling().nextSibling(), undefined);
    t.end();
});

//index
tap.test("Get index of element", function (t) {
    var fd = xeleCatalog.elements.where(function (o) { return o.attr.id == "bk104"; });
    t.equal(fd[0].index(), 3);
    t.end();
});

//setAttr
tap.test("Get set Attribute of element", function (t) {
    var fd = xeleCatalog.descendantFirst('book');
    fd.setAttr('NewAttr', '100');
    t.equal(fd.attr.NewAttr, '100');
    fd.setAttr('NewAttr', '1001');
    t.equal(fd.attr.NewAttr, '1001');
    t.end();
});

//getAttr
tap.test("Get get Attribute of element", function (t) {
    var fd = xeleCatalog.descendantFirst('book');
    
    t.equal(fd.getAttr('NewAttr'), '1001');
    t.equal(fd.getAttr('XYZ'), '');
    t.end();
});

//removeAttr
tap.test("Get get Attribute of element", function (t) {
    var fd = xeleCatalog.descendantFirst('book');
    fd.removeAttr('NewAttr');
    t.equal(fd.attr["NewAttr"], undefined);
    t.end();
});

/*
//element
tap.test("Get element by name", function (t) {
    var fd = xeleCatalog.descendantFirst('book');
   var dsc =  fd.element('publish_date');
    t.equal(dsc.name , "publish_date");
    t.end();
});*/

//add
tap.test("Add element", function (t) {
    
    var dummy = {};
    xeleCatalog.add(dummy);//adding invalid object
    
    t.equal(xeleCatalog.lastElement().attr.id, "bk112");
    
    //adding single element
    var newBook = new xelement.XElement("book");
    newBook.attr.id = "bk113";
    xeleCatalog.add(newBook);
    t.equal(xeleCatalog.lastElement().attr.id, "bk113");
    
    
    var newElements = [];
    for (var i = 0; i < 5; i++) {
        newBook = new xelement.XElement("book");
        newBook.attr.id = "bk" + (113 + i).toString();
        newElements.push(newBook);
    }
    xeleCatalog.add(newElements); //Adding range of elements
    
    t.equal(xeleCatalog.lastElement().attr.id, "bk117");
    
    t.end();
});

//createElement
tap.test("Create clement", function (t) {
    
    var newEle = xeleCatalog.createElement("TestElement");
    newEle.value = "100";
    
    t.equal(xeleCatalog.lastElement().name, newEle.name);
    
    t.end();
});

//setElementValue
tap.test("Set element value", function (t) {
    
    xeleCatalog.setElementValue("TestElement", 1001);    
    t.equal(xeleCatalog.lastElement().value, 1001);    
    xeleCatalog.setElementValue("TestElement1", 123);    
    t.equal(xeleCatalog.lastElement().value, 123);  
    
    t.end();
});

//getElementValue
tap.test("Get element value", function (t) {
    
    var vl = xeleCatalog.getElementValue("TestElement1", true);
    t.equal(vl, 123);
    t.equal(xeleCatalog.getElementValue("ElementDoneExists"), "");
    t.end();
});


//toXmlString
tap.test("To Xml String", function (t) {
    
    var vl = xeleCatalog.descendantFirst('book');
    var cln = xelement.Parse(vl.toXmlString());
    
    t.equal(vl.name, cln.name);
    t.equal(vl.elements.length, cln.elements.length);
    
    t.end();
});


//************************EXTENSIONS***********************

//where extension
tap.test("where extension", function (t) {
    
    var wr = xeleCatalog.descendants("book").where(function (o) { return o.attr.id == "bk109" });
    
    t.equal(wr[0].name, "book");
    t.equal(wr[0].attr.id, "bk109");
    
    t.end();
});


//select
tap.test("select extension", function (t) {
    
    var wr = xeleCatalog.descendants("author").select(function (o) { return o.value; });
    
    t.equal(wr[8], "Kress, Peter");
    
    t.end();
});


//selectMany
tap.test("select many extension", function (t) {
    
    var wr = xeleCatalog.descendants("book").selectMany(function (o) { return o.firstElement() });
    
    t.equal(wr[8].value, "Kress, Peter");
    
    t.end();
});

/*
//indexOf extension
tap.test("remove extension", function (t) {
    var wr = xeleCatalog.descendants("book");
    var item = wr[7];
   
    t.equal(wr.indexOf(item),7);
    t.end();
});*/


/*

//remove extension
tap.test("remove extension", function (t) {
    var wr = xeleCatalog.descendants("book");
    var item = wr[7];
    var c = wr.length;
    
    wr.remove(item);
    t.equal(wr.length + 1, c);
    t.end();
});*/

//forEach
tap.test("select many extension", function (t) {
    
    var wr = xeleCatalog.descendants("book");
    wr.forEach(function (o) {
        o.setAttr('newAttr', 'someValue');
    });
    
    var isUpdated = true;
    for (var i = 0; i < wr.length; i++) {
        if (wr[i].attr.newAttr != "someValue") {
            isUpdated = false;
            break;
        }
    }
    
    t.equal(isUpdated, true);
    
    t.end();
});

/*
tap.test("indexOf extension", function (t) {
    
    var wr = xeleCatalog.descendants("book");
    var book8 = wr.where(function (o) {
        return o.attr.id == "bk108";
    });
    
    t.equal(wr.indexOf(book8[0]), 7);
    
    t.end();
});*/


//**************END OF EXTENSIONS**************************
//remove
tap.test("remove a element", function (t) {
    
    var wr = xeleCatalog.element("TestElement1");
    t.equal(xeleCatalog.lastElement().name, "TestElement1");
    
    wr.remove();
    
    t.equal(xeleCatalog.lastElement().name, "TestElement");
    
    t.end();
});

//removeAll
tap.test("remove all elements from a element", function (t) {
    
    var fb = xeleCatalog.descendantFirst('book');
    t.equal(fb.elements.length, 6);
    
    fb.removeAll();
    
    t.equal(fb.elements.length, 0);
    
    t.end();
});




