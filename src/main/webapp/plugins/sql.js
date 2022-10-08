/**
 * Parse SQL CREATE TABLE. Simple initial version for community to improve.
 */
Draw.loadPlugin(function(ui) {

    const contants_1 ={}
    contants_1.CONSTRAINT_Foreign_Key = contants_1.CONSTRAINT_Primary_Key = contants_1.Foreign_Key = contants_1.Primary_Key = contants_1.CONSTRAINT = contants_1.AlterTable = contants_1.CreateTable = void 0;
    contants_1.CreateTable = "create table";
    contants_1.AlterTable = "alter table ";
    contants_1.CONSTRAINT = "constraint";
    contants_1.Primary_Key = "primary key";
    contants_1.Foreign_Key = "foreign key";
    contants_1.CONSTRAINT_Primary_Key = "constraint primary key";
    contants_1.CONSTRAINT_Foreign_Key = "constraint foreign key";

    /**
     * Main Parser class
     */
    class SqlSimpleParser {
        /**
         * Parser constructor.
         * Default dialect is 'sqlite'.
         * Options: "mysql" | "sqlite" | "postgres" | "sqlserver" .
         *
         * @param dialect SQL dialect ('sqlite').
         */
        constructor(dialect = "sqlite") {
            this.tableList = [];
            /**
             * Parsed statements.
             */
            this.statements = [];
            /**
             * Remains of string feed, after last parsed statement.
             */
            this.remains = "";
            /**
             * Whether preparser is currently escaped.
             */
            this.escaped = false;
            /**
             * Current quote char of preparser.
             */
            this.quoted = "";
            this.exportedTables = 0;
            this.SQLServer = "sqlserver";
            this.MODE_SQLSERVER = false;
            this.foreignKeyList = [];
            this.primaryKeyList = [];
            this.dialect = dialect;
            this.MODE_SQLSERVER =
                this.dialect !== undefined &&
                    this.dialect !== null &&
                    this.dialect == this.SQLServer;
        }
        /**
         * Feed chunk of string into parser.
         *
         * @param chunk Chunk of string to be parsed.
         */
        feed(chunk) {
            //
            var removedComments = chunk
                // remove database comments, multiline, --, and //
                .replace(/\/\*[\s\S]*?\*\/|\/\/|--.*/g, "")
                .trim();
            var cleanedLines = removedComments
                .split("\n")
                // remove empty lines
                .filter((n) => n)
                // remove multiple spaces
                .map((n) => n.replace(/\s+/g, " ").trim());
            // combine lines that are in parenthesis
            var lines = [];
            var insertSameLine = false;
            cleanedLines.forEach((n) => {
                if ((lines.length > 0 &&
                    n[0] == "(" &&
                    lines[lines.length - 1].toLocaleLowerCase().indexOf(contants_1.CreateTable) ==
                        -1) ||
                    insertSameLine) {
                    if (lines.length > 0) {
                        insertSameLine = true;
                        lines[lines.length - 1] += n;
                        if (n[0] == ")")
                            insertSameLine = false;
                    }
                }
                else {
                    lines.push(n);
                }
            });
            var currentTableModel = null;
            //Parse SQL to objects
            for (var i = 0; i < lines.length; i++) {
                // rowCell = null;
                var tmp = lines[i].trim();
                var propertyRow = tmp.toLowerCase().trim();
                if (propertyRow[0] == ")") {
                    // close table
                    if (currentTableModel) {
                        this.tableList.push(currentTableModel);
                        currentTableModel = null;
                    }
                    continue;
                }
                //Parse Table
                if (propertyRow.indexOf(contants_1.CreateTable) != -1) {
                    //Parse row
                    var name = tmp
                        .replace(this.stringToRegex(`/${contants_1.CreateTable}/gi`), "")
                        .trim();
                    //Parse Table Name
                    name = this.ParseTableName(name);
                    if (currentTableModel !== null) {
                        //Add table to the list
                        this.tableList.push(currentTableModel);
                    }
                    //Create Table
                    currentTableModel = this.CreateTable(name);
                }
                // Parse Properties
                else if (tmp !== "(" &&
                    currentTableModel != null &&
                    propertyRow.indexOf(contants_1.AlterTable) == -1) {
                    //Parse the row
                    var name = tmp.substring(0, tmp.charAt(tmp.length - 1) === "," ? tmp.length - 1 : tmp.length);
                    //Attempt to get the Key Type
                    var propertyType = name.toLowerCase();
                    // .substring(0, AlterTable.length).toLowerCase();
                    //Add special constraints
                    if (this.MODE_SQLSERVER) {
                        if (propertyType.indexOf(contants_1.CONSTRAINT) !== -1 &&
                            propertyType.indexOf(contants_1.Primary_Key) !== -1) {
                            propertyType = contants_1.CONSTRAINT_Primary_Key;
                        }
                        if (propertyType.indexOf(contants_1.CONSTRAINT) !== -1 &&
                            propertyType.indexOf(contants_1.Foreign_Key) !== -1) {
                            propertyType = contants_1.CONSTRAINT_Foreign_Key;
                        }
                    }
                    //Verify if this is a property that doesn't have a relationship (One minute of silence for the property)
                    var normalProperty = !propertyType.match(/PRIMARY KEY\s?\(/gi) &&
                        propertyType.indexOf(contants_1.Foreign_Key) == -1 &&
                        propertyType.indexOf(contants_1.CONSTRAINT_Primary_Key) == -1 &&
                        propertyType.indexOf(contants_1.CONSTRAINT_Foreign_Key) == -1;
                    const nameSkipCheck = name.toUpperCase().trim();
                    //Parse properties that don't have relationships
                    if (normalProperty) {
                        if (name === "" || name === "" || name === ");") {
                            continue;
                        }
                        let ExtendedProperties = null;
                        if (this.MODE_SQLSERVER) {
                            if (nameSkipCheck.indexOf(" ASC") !== -1 ||
                                nameSkipCheck.indexOf(" DESC") !== -1 ||
                                nameSkipCheck.indexOf("EXEC ") !== -1 ||
                                nameSkipCheck.indexOf("WITH ") !== -1 ||
                                nameSkipCheck.indexOf(" ON") !== -1 ||
                                nameSkipCheck.indexOf("ALTER ") !== -1 ||
                                // comments already removed
                                nameSkipCheck.indexOf("/*") !== -1 ||
                                nameSkipCheck.indexOf(" CONSTRAINT") !== -1 ||
                                nameSkipCheck.indexOf("SET ") !== -1 ||
                                nameSkipCheck.indexOf(" NONCLUSTERED") !== -1 ||
                                // no spaces desired
                                nameSkipCheck.indexOf("GO") !== -1 ||
                                nameSkipCheck.indexOf("REFERENCES ") !== -1) {
                                continue;
                            }
                            //Get delimiter of column name
                            //TODO: check for space? or end quantifier
                            var firstSpaceIndex = name[0] == "[" && name.indexOf("]" + " ") !== -1
                                ? name.indexOf("]" + " ")
                                : name.indexOf(" ");
                            ExtendedProperties = name.substring(firstSpaceIndex + 1).trim();
                            //Get full name
                            name = name.substring(0, firstSpaceIndex);
                            name = this.RemoveNameQuantifiers(name);
                        }
                        else {
                            const columnQuantifiers = this.GetColumnQuantifiers();
                            //Get delimiter of column name
                            var firstSpaceIndex = name[0] == columnQuantifiers.Start &&
                                name.indexOf(columnQuantifiers.End + " ") !== -1
                                ? name.indexOf(columnQuantifiers.End + " ")
                                : name.indexOf(" ");
                            ExtendedProperties = name.substring(firstSpaceIndex + 1).trim();
                            //Get full name
                            name = name.substring(0, firstSpaceIndex);
                            name = this.RemoveNameQuantifiers(name);
                        }
                        //Create Property
                        var propertyModel = this.CreateProperty(name, currentTableModel.Name, null, false, ExtendedProperties);
                        //Add Property to table
                        currentTableModel.Properties.push(propertyModel);
                        if (ExtendedProperties.toLocaleLowerCase().indexOf(contants_1.Primary_Key) > -1) {
                            //Create Primary Key
                            var primaryKeyModel = this.CreatePrimaryKey(name, currentTableModel.Name);
                            //Add Primary Key to List
                            this.primaryKeyList.push(primaryKeyModel);
                        }
                    }
                    else {
                        //Parse Primary Key
                        if (propertyType.indexOf(contants_1.Primary_Key) != -1 ||
                            propertyType.indexOf(contants_1.CONSTRAINT_Primary_Key) != -1) {
                            if (!this.MODE_SQLSERVER) {
                                var primaryKey = name
                                    .replace(/PRIMARY KEY\s?\(/gi, "")
                                    .replace(")", "");
                                //Create Primary Key
                                var primaryKeyModel = this.CreatePrimaryKey(primaryKey, currentTableModel.Name);
                                //Add Primary Key to List
                                this.primaryKeyList.push(primaryKeyModel);
                            }
                            else {
                                if (propertyRow.indexOf(contants_1.Primary_Key) !== -1 &&
                                    nameSkipCheck.indexOf("CLUSTERED") === -1) {
                                    var primaryKey = name
                                        .replace(/PRIMARY KEY\s?\(/gi, "")
                                        .replace(")", "");
                                    //Create Primary Key
                                    var primaryKeyModel = this.CreatePrimaryKey(primaryKey, currentTableModel.Name);
                                    //Add Primary Key to List
                                    this.primaryKeyList.push(primaryKeyModel);
                                }
                                else {
                                    var startIndex = name.toLocaleLowerCase().indexOf("(");
                                    var endIndex = name.indexOf(")") + 1;
                                    var primaryKey = name
                                        .substring(startIndex, endIndex)
                                        .replace("(", "")
                                        .replace(")", "")
                                        .replace(/ASC/gi, "")
                                        .trim();
                                    const columnQuantifiers = this.GetColumnQuantifiers();
                                    //Get delimiter of column name
                                    var firstSpaceIndex = primaryKey[0] == columnQuantifiers.Start &&
                                        primaryKey.indexOf(columnQuantifiers.End + " ") !== -1
                                        ? primaryKey.indexOf(columnQuantifiers.End + " ")
                                        : primaryKey.indexOf(" ");
                                    var primaryKeyRow = firstSpaceIndex == -1
                                        ? primaryKey
                                        : primaryKey.substring(firstSpaceIndex + 1).trim();
                                    //Create Primary Key
                                    var primaryKeyModel = this.CreatePrimaryKey(primaryKeyRow, currentTableModel.Name);
                                    //Add Primary Key to List
                                    this.primaryKeyList.push(primaryKeyModel);
                                }
                            }
                        }
                    }
                    //Parse Foreign Key
                    if (propertyType.indexOf(contants_1.Foreign_Key) != -1 ||
                        propertyType.indexOf(contants_1.CONSTRAINT_Foreign_Key) != -1) {
                        if (!this.MODE_SQLSERVER || propertyRow.indexOf(contants_1.AlterTable) == -1) {
                            this.ParseMySQLForeignKey(name, currentTableModel);
                        }
                        else {
                            var completeRow = name;
                            if (nameSkipCheck.indexOf("REFERENCES") === -1) {
                                var referencesRow = lines[i + 1].trim();
                                completeRow =
                                    "ALTER TABLE [dbo].[" +
                                        currentTableModel.Name +
                                        "]  WITH CHECK ADD" +
                                        " " +
                                        name +
                                        " " +
                                        referencesRow;
                            }
                            this.ParseSQLServerForeignKey(completeRow, currentTableModel);
                        }
                    }
                }
                else if (propertyRow.indexOf(contants_1.AlterTable) != -1) {
                    if (this.MODE_SQLSERVER) {
                        //Parse the row
                        var alterTableRow = tmp.substring(0, tmp.charAt(tmp.length - 1) === "," ? tmp.length - 1 : tmp.length);
                        var referencesRow = lines[i + 1].trim();
                        var completeRow = alterTableRow + " " + referencesRow;
                        this.ParseSQLServerForeignKey(completeRow, currentTableModel);
                    }
                }
            }
            // parse fk and primary keys
            if (this.primaryKeyList.length > 0) {
                this.primaryKeyList.forEach((pk) => {
                    // find table index
                    var pkTableIndex = this.tableList.findIndex((t) => t.Name.toLocaleLowerCase() == pk.PrimaryKeyTableName.toLocaleLowerCase());
                    // find property index
                    if (pkTableIndex > -1) {
                        var propertyIndex = this.tableList[pkTableIndex].Properties.findIndex((p) => p.Name.toLocaleLowerCase() == pk.PrimaryKeyName.toLocaleLowerCase());
                        if (propertyIndex > -1) {
                            this.tableList[pkTableIndex].Properties[propertyIndex].IsPrimaryKey = true;
                        }
                    }
                });
            }
            if (this.foreignKeyList.length > 0) {
                this.foreignKeyList.forEach((fk) => {
                    // find table index
                    var pkTableIndex = this.tableList.findIndex((t) => t.Name.toLocaleLowerCase() == fk.ReferencesTableName.toLocaleLowerCase());
                    // find property index
                    if (pkTableIndex > -1) {
                        var propertyIndex = this.tableList[pkTableIndex].Properties.findIndex((p) => p.Name.toLocaleLowerCase() == fk.PrimaryKeyName.toLocaleLowerCase());
                        if (propertyIndex > -1) {
                            this.tableList[pkTableIndex].Properties[propertyIndex].ForeignKey.push(fk);
                            if (!fk.IsDestination) {
                                this.tableList[pkTableIndex].Properties[propertyIndex].IsForeignKey = true;
                            }
                        }
                    }
                });
            }
            return this;
        }
        stringToRegex(str) {
            // Main regex
            const mainResult = str.match(/\/(.+)\/.*/);
            const optionsResult = str.match(/\/.+\/(.*)/);
            if (mainResult && optionsResult) {
                const main = mainResult[1];
                // Regex options
                const options = optionsResult[1];
                // Compiled regex
                return new RegExp(main, options);
            }
            return new RegExp("//(.+)/.*/", "//.+/(.*)/");
        }
        CreatePrimaryKey(primaryKeyName, primaryKeyTableName) {
            var primaryKey = {
                PrimaryKeyTableName: primaryKeyTableName,
                PrimaryKeyName: this.RemoveNameQuantifiers(primaryKeyName),
            };
            return primaryKey;
        }
        CreateProperty(name, tableName, foreignKey, isPrimaryKey, columnProps) {
            var isForeignKey = foreignKey !== undefined && foreignKey !== null;
            var property = {
                Name: name,
                ColumnProperties: columnProps,
                TableName: tableName,
                ForeignKey: foreignKey || [],
                IsForeignKey: isForeignKey,
                IsPrimaryKey: isPrimaryKey,
            };
            return property;
        }
        ParseMySQLForeignKey(name, currentTableModel) {
            var referencesIndex = name.toLowerCase().indexOf("references");
            var foreignKeySQL = name.substring(0, referencesIndex);
            var referencesSQL = name.substring(referencesIndex, name.length);
            //Remove references syntax
            referencesSQL = referencesSQL.replace(/REFERENCES /gi, "");
            //Get Table and Property Index
            var referencedTableIndex = referencesSQL.indexOf("(");
            var referencedPropertyIndex = referencesSQL.indexOf(")");
            //Get Referenced Table
            var referencedTableName = referencesSQL.substring(0, referencedTableIndex);
            //Get Referenced Key
            var referencedPropertyName = referencesSQL.substring(referencedTableIndex + 1, referencedPropertyIndex);
            //Get ForeignKey
            var foreignKey = foreignKeySQL
                .replace(/FOREIGN KEY\s?\(/gi, "")
                .replace(")", "")
                .replace(" ", "");
            //Create ForeignKey
            var foreignKeyOriginModel = this.CreateForeignKey(foreignKey, currentTableModel.Name, referencedPropertyName, referencedTableName, true);
            //Add ForeignKey Origin
            this.foreignKeyList.push(foreignKeyOriginModel);
            //Create ForeignKey
            var foreignKeyDestinationModel = this.CreateForeignKey(referencedPropertyName, referencedTableName, foreignKey, currentTableModel.Name, false);
            //Add ForeignKey Destination
            this.foreignKeyList.push(foreignKeyDestinationModel);
        }
        ParseSQLServerForeignKey(name, currentTableModel) {
            var referencesIndex = name.toLowerCase().indexOf("references");
            if (name.toLowerCase().indexOf(`${contants_1.Foreign_Key}(`) !== -1) {
                var foreignKeySQL = name
                    .substring(name.toLowerCase().indexOf(`${contants_1.Foreign_Key}(`), referencesIndex)
                    .replace(/FOREIGN KEY\(/gi, "")
                    .replace(")", "");
            }
            else {
                var foreignKeySQL = name
                    .substring(name.toLowerCase().indexOf(`${contants_1.Foreign_Key}(`), referencesIndex)
                    .replace(/FOREIGN KEY\s?\(/gi, "")
                    .replace(")", "");
            }
            var referencesSQL = name.substring(referencesIndex, name.length);
            const nameSkipCheck = name.toUpperCase().trim();
            var alterTableName = name
                .substring(0, nameSkipCheck.indexOf("WITH"))
                .replace(/ALTER TABLE /gi, "");
            if (referencesIndex !== -1 &&
                alterTableName !== "" &&
                foreignKeySQL !== "" &&
                referencesSQL !== "") {
                //Remove references syntax
                referencesSQL = referencesSQL.replace(/REFERENCES /gi, "");
                //Get Table and Property Index
                var referencedTableIndex = referencesSQL.indexOf("(");
                var referencedPropertyIndex = referencesSQL.indexOf(")");
                //Get Referenced Table
                var referencedTableName = referencesSQL.substring(0, referencedTableIndex);
                //Parse Name
                referencedTableName = this.ParseSQLServerName(referencedTableName);
                //Get Referenced Key
                var referencedPropertyName = referencesSQL.substring(referencedTableIndex + 1, referencedPropertyIndex);
                //Parse Name
                referencedPropertyName = this.ParseSQLServerName(referencedPropertyName);
                //Get ForeignKey
                var foreignKey = foreignKeySQL
                    .replace(/FOREIGN KEY\s?\(/gi, "")
                    .replace(")", "");
                //Parse Name
                foreignKey = this.ParseSQLServerName(foreignKey);
                //Parse Name
                alterTableName = this.ParseSQLServerName(alterTableName);
                //Create ForeignKey
                var foreignKeyOriginModel = this.CreateForeignKey(foreignKey, alterTableName, referencedPropertyName, referencedTableName, true);
                //Add ForeignKey Origin
                this.foreignKeyList.push(foreignKeyOriginModel);
                //Create ForeignKey
                var foreignKeyDestinationModel = this.CreateForeignKey(referencedPropertyName, referencedTableName, foreignKey, alterTableName, false);
                //Add ForeignKey Destination
                this.foreignKeyList.push(foreignKeyDestinationModel);
            }
        }
        CreateForeignKey(primaryKeyName, primaryKeyTableName, referencesPropertyName, referencesTableName, isDestination) {
            var foreignKey = {
                PrimaryKeyTableName: this.RemoveNameQuantifiers(primaryKeyTableName),
                PrimaryKeyName: this.RemoveNameQuantifiers(primaryKeyName),
                ReferencesPropertyName: this.RemoveNameQuantifiers(referencesPropertyName),
                ReferencesTableName: this.RemoveNameQuantifiers(referencesTableName),
                IsDestination: isDestination !== undefined && isDestination !== null
                    ? isDestination
                    : false,
            };
            return foreignKey;
        }
        RemoveNameQuantifiers(name) {
            return name.replace(/\[|\]|\(|\"|\'|\`/g, "").trim();
        }
        ParseTableName(name) {
            if (name.charAt(name.length - 1) === "(") {
                name = this.RemoveNameQuantifiers(name);
            }
            return name;
        }
        ParseSQLServerName(name, property) {
            name = name.replace("[dbo].[", "");
            name = name.replace("](", "");
            name = name.replace("].[", ".");
            name = name.replace("[", "");
            if (property == undefined || property == null) {
                name = name.replace(" [", "");
                name = name.replace("] ", "");
            }
            else {
                if (name.indexOf("]") !== -1) {
                    name = name.substring(0, name.indexOf("]"));
                }
            }
            if (name.lastIndexOf("]") === name.length - 1) {
                name = name.substring(0, name.length - 1);
            }
            if (name.lastIndexOf(")") === name.length - 1) {
                name = name.substring(0, name.length - 1);
            }
            if (name.lastIndexOf("(") === name.length - 1) {
                name = name.substring(0, name.length - 1);
            }
            name = name.replace(" ", "");
            return name;
        }
        CreateTable(name) {
            var table = {
                Name: name,
                Properties: [],
            };
            //Count exported tables
            this.exportedTables++;
            return table;
        }
        /**
         * Checks whether character is a quotation character.
         *
         * @param char Character to be evaluated.
         */
        static isQuoteChar(char) {
            return char === '"' || char === "'" || char === "`";
        }
        /**
         * return text quantifiers for dialect
         * @returns json
         */
        GetColumnQuantifiers() {
            let chars = {
                Start: '"',
                End: '"',
            };
            if (this.dialect == "mysql") {
                chars.Start = "`";
                chars.End = "`";
            }
            else if (this.dialect == "sqlserver") {
                chars.Start = "[";
                chars.End = "]";
            }
            return chars;
        }
        ToTableList() {
            return this.tableList;
        }
        ToPrimaryKeyList() {
            return this.primaryKeyList;
        }
        ToForeignKeyList() {
            return this.foreignKeyList;
        }
        ResetModel() {
            this.tableList = [];
            this.primaryKeyList = [];
            this.foreignKeyList = [];
            return this;
        }
        /**
         * return full sql model
         * @returns
         */
        ToModel() {
            return {
                TableList: this.tableList,
                Dialect: this.dialect,
                ForeignKeyList: this.foreignKeyList,
                PrimaryKeyList: this.primaryKeyList,
            };
        }
    }

    //Table Info
    var foreignKeyList = [];
    var primaryKeyList = [];
    var tableList = [];
    var cells = [];
    var tableCell = null;
    var rowCell = null;
    var dx = 0;
    var exportedTables = 0;


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
    sqlInput.value = 'CREATE TABLE Persons\n(\n    PersonID int NOT NULL,\n    LastName varchar(255),\n    ' +
        'FirstName varchar(255),\n    Address varchar(255),\n    City varchar(255),\n    Primary Key(PersonID)\n);\n\n' + 
        'CREATE TABLE Orders\n(\n    OrderID int NOT NULL PRIMARY KEY,\n    PersonID int NOT NULL,\n    FOREIGN KEY ([PersonID]) REFERENCES [Persons]([PersonID])' +
        '\n);'
    mxUtils.br(div);
    div.appendChild(sqlInput);

    var graph = ui.editor.graph;

    // Extends Extras menu
    mxResources.parse('fromSql=From SQL');

    var wnd = new mxWindow(mxResources.get('fromSql'), div, document.body.offsetWidth - 480, 140,
        320, 320, true, true);
    wnd.destroyOnClose = false;
    wnd.setMaximizable(false);
    wnd.setResizable(false);
    wnd.setClosable(true);

    function AddRow(propertyModel, tableName) {
        
        var cellName = propertyModel.Name + (propertyModel.ColumnProperties ? " " + propertyModel.ColumnProperties: "");

        if (propertyModel.IsForeignKey && propertyModel.ForeignKey !== undefined && propertyModel.ForeignKey !== null) {
            propertyModel.ForeignKey.forEach(function(foreignKeyModel) {

                //We do not want the foreign key to be duplicated in our table to the same property
                if (tableName !== foreignKeyModel.PrimaryKeyTableName || (tableName === foreignKeyModel.PrimaryKeyTableName && propertyModel.Name !== foreignKeyModel.PrimaryKeyName)) {
                    cellName += ' | ' + foreignKeyModel.PrimaryKeyTableName + '(' + foreignKeyModel.PrimaryKeyName + ')';
                }
            })
        }

        rowCell = new mxCell(cellName, new mxGeometry(0, 0, 90, 26),
            'shape=partialRectangle;top=0;left=0;right=0;bottom=0;align=left;verticalAlign=top;spacingTop=-2;fillColor=none;spacingLeft=64;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;');
        rowCell.vertex = true;

        var columnType = propertyModel.IsPrimaryKey && propertyModel.IsForeignKey ? 'PK | FK' : propertyModel.IsPrimaryKey ? 'PK' : propertyModel.IsForeignKey ? 'FK' : '';

        var left = sb.cloneCell(rowCell, columnType);
        left.connectable = false;
        left.style = 'shape=partialRectangle;top=0;left=0;bottom=0;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=180;points=[];portConstraint=eastwest;part=1;'
        left.geometry.width = 54;
        left.geometry.height = 26;
        rowCell.insert(left);

        var size = ui.editor.graph.getPreferredSizeForCell(rowCell);

        if (size !== null && tableCell.geometry.width < size.width + 10) {
            tableCell.geometry.width = size.width + 10;
        }

        tableCell.insert(rowCell);
        tableCell.geometry.height += 26;

        rowCell = rowCell;

    };

    function parseSql(text, type) {

        // TODO: load parser
        const parser = new SqlSimpleParser(type);
        

        const models = parser
            .feed(text)
            .ToModel();
        
        

        foreignKeyList = models.ForeignKeyList;
        primaryKeyList = models.PrimaryKeyList;
        tableList = models.TableList;
        exportedTables = tableList.length

        //Create Table in UI
        CreateTableUI();
    };

    function CreateTableUI() {

        tableList.forEach(function(tableModel) {
            //Define table size width
            var maxNameLenght = 100 + tableModel.Name.length;

            //Create Table
            tableCell = new mxCell(tableModel.Name, new mxGeometry(dx, 0, maxNameLenght, 26),
                'swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=default;horizontalStack=0;resizeParent=1;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=default;align=center;');
            tableCell.vertex = true;

            //Resize row
            var size = ui.editor.graph.getPreferredSizeForCell(rowCell);
            if (size !== null) {
                tableCell.geometry.width = size.width + maxNameLenght;
            }

            //Add Table to cells
            cells.push(tableCell);

            //Add properties
            tableModel.Properties.forEach(function(propertyModel) {

                //Add row
                AddRow(propertyModel, tableModel.Name);
            });

            //Close table
            dx += tableCell.geometry.width + 40;
            tableCell = null;
        });

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

    var btn = mxUtils.button('Insert MySQL', function() {
        parseSql(sqlInput.value, 'mysql');
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

    var btn = mxUtils.button('Insert PostgreSQL', function() {
        parseSql(sqlInput.value, 'postgres');
    });

    btn.style.marginTop = '8px';
    btn.style.padding = '4px';
    div.appendChild(btn);

    var btn = mxUtils.button('Insert Sqlite', function() {
        parseSql(sqlInput.value, 'sqlite');
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
