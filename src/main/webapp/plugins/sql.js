/**
 * Parse SQL CREATE TABLE. Simple initial version for community to improve.
 */
Draw.loadPlugin(function(ui) {

    function TableModel() {
        this.Name = null;
        this.Properties = []
    }

    function PropertyModel() {
        this.Name = null;
        this.Value = null;
        this.TableName = null;
        this.ForeignKey = null;
        this.IsPrimaryKey = false;
        this.IsForeignKey = false;
    }

    function ForeignKeyModel() {
        this.PrimaryKeyName = null;
        this.ReferencesPropertyName = null

        this.PrimaryKeyTableName = null;
        this.ReferencesTableName = null;
    }

    //SQL Types
    var SQLServer = 'sqlserver';

    //SQL Modes
    var MODE_SQLSERVER = null;

    //Table Info
    var tableList = [];
    var rows = {};
    var cells = [];
    var tableCell = null;
    var rowCell = null;

    var exportedTables = 0;
    var propertyForeignKeyList = [];


    //Create Base div
    var div = document.createElement('div');
    div.style.userSelect = 'none';
    div.style.overflow = 'hidden';
    div.style.padding = '10px';
    div.style.height = '100%';

    var graph = ui.editor.graph;

    var sqlInput = document.createElement('textarea');
    sqlInput.style.height = '200px';
    sqlInput.style.width = '100%';
    sqlInput.value = 'CREATE TABLE Persons\n(\nPersonID int,\nLastName varchar(255),\n' +
        'FirstName varchar(255),\nAddress varchar(255),\nCity varchar(255)\n);';
    mxUtils.br(div);
    div.appendChild(sqlInput);

    var graph = ui.editor.graph;

    // Extends Extras menu
    mxResources.parse('fromSql=From SQL');

    var wnd = new mxWindow(mxResources.get('fromSql'), div, document.body.offsetWidth - 480, 140,
        320, 300, true, true);
    wnd.destroyOnClose = false;
    wnd.setMaximizable(false);
    wnd.setResizable(false);
    wnd.setClosable(true);

    function AddRow(name) {

        rowCell = new mxCell(name, new mxGeometry(0, 0, 90, 26),
            'shape=partialRectangle;top=0;left=0;right=0;bottom=0;align=left;verticalAlign=top;spacingTop=-2;fillColor=none;spacingLeft=34;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;');
        rowCell.vertex = true;

        var left = sb.cloneCell(rowCell, '' /* eg. PK */ );
        left.connectable = false;
        left.style = 'shape=partialRectangle;top=0;left=0;bottom=0;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'
        left.geometry.width = 30;
        left.geometry.height = 26;
        rowCell.insert(left);

        var size = ui.editor.graph.getPreferredSizeForCell(rowCell);

        if (size !== null && tableCell.geometry.width < size.width + 10) {
            tableCell.geometry.width = size.width + 10;
        }

        tableCell.insert(rowCell);
        tableCell.geometry.height += 26;

        rows[rowCell.value] = rowCell;
        rowCell = rowCell;

    };

    function ParseMySQLForeignKey(name, currentTableModel) {
        var referencesIndex = name.toLowerCase().indexOf("references");
        var foreignKeySQL = name.substring(0, referencesIndex);
        var referencesSQL = name.substring(referencesIndex, name.length);

        //Remove references syntax
        referencesSQL = referencesSQL.replace("REFERENCES ", '');

        //Get Table and Property Index
        var referencedTableIndex = referencesSQL.indexOf("(");
        var referencedPropertyIndex = referencesSQL.indexOf(")");

        //Get Referenced Table
        var referencedTableName = referencesSQL.substring(0, referencedTableIndex);

        //Get Referenced Key
        var referencedPropertyName = referencesSQL.substring(referencedTableIndex + 1, referencedPropertyIndex);

        //Get ForeignKey 
        var foreignKey = foreignKeySQL.replace("FOREIGN KEY (", '').replace(")", '').replace(" ", '');

        //Create ForeignKey
        var foreignKeyModel = CreateForeignKey(foreignKey, currentTableModel.Name, referencedPropertyName, referencedTableName);

        //Add Property with ForeignKey to List
        propertyForeignKeyList.push(foreignKeyModel);
    };

    function ParseSQLServerForeignKey(name, currentTableModel) {
        var referencesIndex = name.toLowerCase().indexOf("references");
        var foreignKeySQL = name.substring(name.toLowerCase().indexOf("foreign key("), referencesIndex).replace("FOREIGN KEY(", '').replace(')', '');
        var referencesSQL = name.substring(referencesIndex, name.length);

        //Remove references syntax
        referencesSQL = referencesSQL.replace("REFERENCES ", '');

        //Get Table and Property Index
        var referencedTableIndex = referencesSQL.indexOf("(");
        var referencedPropertyIndex = referencesSQL.indexOf(")");

        //Get Referenced Table
        var referencedTableName = referencesSQL.substring(0, referencedTableIndex);

        referencedTableName = ParseSQLServerName(referencedTableName);

        //Get Referenced Key
        var referencedPropertyName = referencesSQL.substring(referencedTableIndex + 1, referencedPropertyIndex);

        referencedPropertyName = ParseSQLServerName(referencedPropertyName);

        //Get ForeignKey 
        var foreignKey = foreignKeySQL.replace("FOREIGN KEY (", '').replace(")", '');

        foreignKey = ParseSQLServerName(foreignKey);

        //Create ForeignKey
        var foreignKeyModel = CreateForeignKey(foreignKey, currentTableModel.Name, referencedPropertyName, referencedTableName);

        //Add Property with ForeignKey to List
        propertyForeignKeyList.push(foreignKeyModel);
    };

    function CreateForeignKey(primaryKeyName, primaryKeyTableName, referencesPropertyName, referencesTableName) {
        var foreignKey = new ForeignKeyModel;

        foreignKey.PrimaryKeyTableName = primaryKeyTableName;
        foreignKey.PrimaryKeyName = primaryKeyName;
        foreignKey.ReferencesPropertyName = referencesPropertyName;
        foreignKey.ReferencesTableName = referencesTableName;

        return foreignKey;
    };

    function CreateProperty(name, tableName, foreignKey, isPrimaryKey) {
        var property = new PropertyModel;

        property.Name = name;
        property.TableName = tableName;
        property.ForeignKey = foreignKey;
        property.IsForeignKey = foreignKey !== undefined && foreignKey !== null;
        property.IsPrimaryKey = isPrimaryKey;

        return property;
    };

    function CreateTable(name) {
        var table = new TableModel;

        table.Name = name;

        //Count exported tables
        exportedTables++;

        return table;
    };

    function ParseSQLServerName(name, property) {
        name = name.replace('[dbo].[', '');
        name = name.replace('](', '');
        name = name.replace('].[', '.');
        name = name.replace('[', '');

        if (property == undefined || property == null) {
            name = name.replace(' [', '');
            name = name.replace('] ', '');
        } else {
            name = name.substring(0, name.indexOf(']'));
        }

        if (name.lastIndexOf(']') === (name.length - 1)) {
            name = name.substring(0, name.length - 1);
        }

        return name;
    };

    function ParseTableName(name) {
        if (name.charAt(name.length - 1) === '(') {
            if (!MODE_SQLSERVER) {
                name = name.substring(0, name.lastIndexOf(' '));
            } else {
                name = ParseSQLServerName(name);
            }
        }

        return name;
    };

    function parseSql(text, type) {
        var lines = text.split('\n');
        var dx = 0;
        MODE_SQLSERVER = type !== undefined && type !== null && type == SQLServer;

        rows = null;
        tableCell = null;
        cells = [];
        exportedTables = 0;

        var currentTableModel = null;

        //Parse SQL
        for (var i = 0; i < lines.length; i++) {

            rowCell = null;

            var tmp = mxUtils.trim(lines[i]);

            var propertyRow = tmp.substring(0, 12).toLowerCase();

            //Parse Table
            if (propertyRow === 'create table') {

                //Parse row
                var name = mxUtils.trim(tmp.substring(12));

                //Parse Table Name
                name = ParseTableName(name);

                if (currentTableModel !== null) {
                    //Add table to the list
                    tableList.push(currentTableModel);
                }

                //Create Table
                currentTableModel = CreateTable(name);

                //TODO: Change to a new loop
                tableCell = new mxCell(name, new mxGeometry(dx, 0, 160, 26),
                    'swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=#e0e0e0;horizontalStack=0;resizeParent=1;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;align=center;');
                tableCell.vertex = true;

                cells.push(tableCell);

                var size = ui.editor.graph.getPreferredSizeForCell(rowCell);

                if (size !== null) {
                    tableCell.geometry.width = size.width + 10;
                }

                // For primary key lookups
                rows = {};

            } else if (propertyRow === 'alter table ') {

                if (MODE_SQLSERVER) {
                    //Parse the row
                    var alterTableRow = tmp.substring(0, (tmp.charAt(tmp.length - 1) === ',') ? tmp.length - 1 : tmp.length);
                    var referencesRow = mxUtils.trim(lines[i + 1]);
                    var completeRow = alterTableRow + ' ' + referencesRow;

                    ParseSQLServerForeignKey(completeRow, currentTableModel);
                }
            } //Close Table
            else if (tableCell !== null && tmp.charAt(0) === ')') {
                dx += tableCell.geometry.width + 40;
                tableCell = null;
            } // Parse Properties 
            else if (tmp !== '(' && tableCell !== null) {

                //Parse the row
                var name = tmp.substring(0, (tmp.charAt(tmp.length - 1) === ',') ? tmp.length - 1 : tmp.length);

                //Attempt to get the Key Type
                var propertyType = name.substring(0, 11).toLowerCase();

                //Verify if this is a property that doesn't have a relationship (One minute of silence for the property)
                var normalProperty = propertyType !== 'primary key' && propertyType !== 'foreign key';

                //Parse properties that don't have relationships
                if (normalProperty) {
                    if (!MODE_SQLSERVER) {
                        //Add row
                        AddRow(name);
                    } else {

                        if (name.toLowerCase().indexOf("asc") !== -1 && name.toLowerCase().indexOf("desc")) {
                            continue;
                        }
                        //Add row
                        AddRow(name);

                        name = ParseSQLServerName(name, true);
                    }

                    //Create Property
                    var propertyModel = CreateProperty(name, currentTableModel.Name, null, false, false);

                    //Add Property to table
                    currentTableModel.Properties.push(propertyModel);


                }

                //Parse Primary Key
                if (propertyType === 'primary key') {
                    if (!MODE_SQLSERVER) {

                    } else {

                    }
                }

                //Parse Foreign Key
                if (propertyType === 'foreign key') {
                    if (!MODE_SQLSERVER) {
                        ParseMySQLForeignKey(name, currentTableModel);

                    }
                }

            }
        }

        if (cells.length > 0) {
            var graph = ui.editor.graph;
            var view = graph.view;
            var bds = graph.getGraphBounds();

            // Computes unscaled, untranslated graph bounds
            var x = Math.ceil(Math.max(0, bds.x / view.scale - view.translate.x) + 4 * graph.gridSize);
            var y = Math.ceil(Math.max(0, (bds.y + bds.height) / view.scale - view.translate.y) + 4 * graph.gridSize);

            graph.setSelectionCells(graph.importCells(cells, x, y));
            graph.scrollCellToVisible(graph.getSelectionCell());
        }

        alert('Processed ' + exportedTables + ' tables.');
        wnd.setVisible(false);
    };

    mxUtils.br(div);

    var resetBtn = mxUtils.button(mxResources.get('reset'), function() {
        sqlInput.value = '';
    });

    resetBtn.style.marginTop = '8px';
    resetBtn.style.marginRight = '4px';
    resetBtn.style.padding = '4px';
    div.appendChild(resetBtn);

    var btn = mxUtils.button(mxResources.get('cancel'), function() {
        wnd.setVisible(false);
    });

    btn.style.marginTop = '8px';
    btn.style.marginRight = '4px';
    btn.style.padding = '4px';
    div.appendChild(btn);

    var btn = mxUtils.button(mxResources.get('insert'), function() {
        parseSql(sqlInput.value);
    });

    btn.style.marginTop = '8px';
    btn.style.padding = '4px';
    div.appendChild(btn);

    var btn = mxUtils.button('Insert SQL Server', function() {
        parseSql(sqlInput.value, 'sqlserver');
    });

    btn.style.marginTop = '8px';
    btn.style.padding = '4px';
    div.appendChild(btn);

    // Adds action
    ui.actions.addAction('fromSql', function() {
        wnd.setVisible(!wnd.isVisible());

        if (wnd.isVisible()) {
            sqlInput.focus();
        }
    });

    var theMenu = ui.menus.get('insert');
    var oldMenu = theMenu.funct;

    theMenu.funct = function(menu, parent) {
        oldMenu.apply(this, arguments);

        ui.menus.addMenuItems(menu, ['fromSql'], parent);
    };
});