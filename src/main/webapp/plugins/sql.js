/**
 * Parse SQL CREATE TABLE. Simple initial version for community to improve.
 */
Draw.loadPlugin(function(ui) {
    
    // export sql methods

    /**
     * Mermaid Models TO SQL parser
     * src https://github.com/Software-Developers-IRL/Little-Mermaid-2-The-SQL/blob/main/src/generate-sql-ddl.ts
     */
    class DbParser {
        constructor(dbType, db) {
            this.db = db;
            this.dbType = dbType;
        }
        /**
         * return sql from mermaid erDiagram db models
         * @returns
         */
        getSQLDataDefinition() {
            this.entities = this.db.getEntities();
            this.relationships = this.db.getRelationships();
            return this.lexer();
        }
        lexer() {
            let statementGeneration = [];
            if (this.entities) {
                for (const key in this.entities) {
                    if (Object.prototype.hasOwnProperty.call(this.entities, key)) {
                        const entity = this.entities[key];
                        statementGeneration.push(this.createTable(key, entity));
                    }
                }
            }
            return statementGeneration.join("");
        }
        /**
         * convert labels with start and end strings per database type
         * @param label
         * @returns
         */
        dbTypeEnds(label) {
            let char1 = '"';
            let char2 = '"';
            if (this.dbType == "mysql") {
                char1 = "`";
                char2 = "`";
            }
            else if (this.dbType == "sqlserver") {
                char1 = "[";
                char2 = "]";
            }
            return `${char1}${label}${char2}`;
        }
        /**
         * generate create table statement
         * also includes primary keys and foreign keys
         * @param entityKey
         * @param entity
         * @returns
         */
        createTable(entityKey, entity) {
            let statement = `CREATE TABLE ${this.dbTypeEnds(entityKey)} (`;
            let primaryKeys = [];
            let attributesAdded = 0;
            for (let i = 0; i < entity.attributes.length; i++) {
                const attribute = entity.attributes[i];
                if (attribute.attributeType && attribute.attributeName) {
                    statement += attributesAdded == 0 ? "\n" : ",\n";
                    attributesAdded++;
                    // need to add parenthesis or commas
                    // BIGGEST difference from original is that column types don't have to be fixed
                    let columnType = attribute.attributeType.trim();
                    if (attribute.attributeComment) {
                        let attributeName = attribute.attributeName;
                        let attributeComment = attribute.attributeComment.trim();
                        if (attribute.attributeComment.indexOf("'") != -1) {
                            // extract
                            const testFullNameMatches = attribute.attributeComment.match(/(?<=((?<=[\s,.:;"']|^)["']))(?:(?=(\\?))\2.)*?(?=\1)/gmu);
                            if (testFullNameMatches && testFullNameMatches.length > 0) {
                                attributeName = testFullNameMatches[0];
                                attributeComment = attributeComment
                                    .replace(`'${attributeName}'`, "")
                                    .trim();
                            }
                        }
                        if (attributeComment)
                            attributeComment = " " + attributeComment;
                        // check if contains full column name
                        statement += `\t${this.dbTypeEnds(attributeName)} ${columnType}${attributeComment}`;
                        if (attribute.attributeKeyType &&
                            attribute.attributeKeyType == "PK") {
                            primaryKeys.push(attribute.attributeName);
                        }
                    }
                    else {
                        if (attribute.attributeKeyType &&
                            attribute.attributeKeyType == "PK") {
                            primaryKeys.push(attribute.attributeName);
                        }
                        statement += `\t${this.dbTypeEnds(attribute.attributeName)} ${columnType}`;
                    }
                }
            }
            if (primaryKeys.length > 0) {
                statement += ",\n\tPRIMARY KEY(";
                for (let i = 0; i < primaryKeys.length; i++) {
                    const element = primaryKeys[i];
                    statement += (i == 0 ? "" : ",") + this.dbTypeEnds(primaryKeys[i]);
                }
                statement += ")";
            }
            // foreign keys
            let entityFKeys = this.relationships.filter((relation) => relation.entityB == entityKey);
            if (entityFKeys.length > 0) {
                for (let i = 0; i < entityFKeys.length; i++) {
                    const fk = entityFKeys[i];
                    const fkRelTxt = fk.roleA;
                    // must match format "[..] to [..]"
                    const keySplit = "] to [";
                    if (fkRelTxt.indexOf(keySplit) != -1 &&
                        fkRelTxt[0] == "[" &&
                        fkRelTxt[fkRelTxt.length - 1] == "]") {
                        let keys = fkRelTxt.substring(1, fkRelTxt.length - 1).split(keySplit);
                        // remove quotes
                        let fkCol = keys[1].replace(/[\'\"]/gim, "");
                        if (fkCol.indexOf(".") != -1) {
                            fkCol = fkCol.split(".")[1];
                        }
                        fkCol = fkCol.trim();
                        let pkCol = keys[0].replace(/[\'\"]/gim, "");
                        if (pkCol.indexOf(".") != -1) {
                            pkCol = pkCol.split(".")[1];
                        }
                        pkCol = pkCol.trim();
                        statement += `,\n\tFOREIGN KEY (${this.dbTypeEnds(fkCol)}) REFERENCES ${this.dbTypeEnds(fk.entityA)}(${this.dbTypeEnds(pkCol)})`;
                    }
                }
            }
            if (attributesAdded != 0) {
                statement += "\n";
            }
            statement += `);\n\n`;
            return statement;
        }
    }

    //Create Base div
    const divGenSQL = document.createElement('div');
    divGenSQL.style.userSelect = 'none';
    divGenSQL.style.overflow = 'hidden';
    divGenSQL.style.padding = '10px';
    divGenSQL.style.height = '100%';

    const sqlInputGenSQL = document.createElement('textarea');
    sqlInputGenSQL.style.height = '200px';
    sqlInputGenSQL.style.width = '100%';
    sqlInputGenSQL.value = '-- click a database type button'
    mxUtils.br(divGenSQL);
    divGenSQL.appendChild(sqlInputGenSQL);
    var theMenuExportAs = ui.menus.get('exportAs');
    let buttonLabel = 'tosql=To SQL'
    // vscode extension support
    if(!(theMenuExportAs && theMenuExportAs.enabled)) {
        buttonLabel = 'tosql=Export As SQL'
    }
    // Extends Extras menu
    mxResources.parse(buttonLabel);

    const wndGenSQL = new mxWindow(mxResources.get('tosql'), divGenSQL, document.body.offsetWidth - 480, 140,
        320, 320, true, true);
    wndGenSQL.destroyOnClose = false;
    wndGenSQL.setMaximizable(false);
    wndGenSQL.setResizable(false);
    wndGenSQL.setClosable(true);

    /**
     * return text quantifiers for dialect
     * @returns json
     */
    function GetColumnQuantifiers(type) {
        let chars = {
            Start: '"',
            End: '"',
        };
        if (type == "mysql") {
            chars.Start = "`";
            chars.End = "`";
        }
        else if (type == "sqlserver") {
            chars.Start = "[";
            chars.End = "]";
        }
        return chars;
    }
    /**
     * sometimes rows have spans or styles, an attempt to remove them
     * @param {*} label 
     * @returns 
     */
    function removeHtml(label){
        var div = document.createElement("div");
        divGenSQL.innerHTML = label;
        var text = div.textContent || div.innerText || "";
        return text;
    }
    /**
     * extract row column attributes
     * @param {*} label 
     * @param {*} columnQuantifiers 
     * @returns 
     */
    function getDbLabel(label, columnQuantifiers){
        label = removeHtml(label)
        // fix duplicate spaces and different space chars
        label = label
            .replace(/\s+/g, " ")
        let firstSpaceIndex = label[0] == columnQuantifiers.Start &&
            label.indexOf(columnQuantifiers.End + " ") !== -1
                ? label.indexOf(columnQuantifiers.End + " ")
                : label.indexOf(" ");
        let attributeType = label.substring(firstSpaceIndex + 1).trim();
        let attributeName = RemoveNameQuantifiers(label.substring(0, firstSpaceIndex));
        let attribute = {
            attributeName,
            attributeType
        }
        return attribute
    }
    function RemoveNameQuantifiers(name) {
        return name.replace(/\[|\]|\(|\"|\'|\`/g, "").trim();
    }

    function getMermaidDiagramDb(type){
        var model = ui.editor.graph.getModel()
        // same models from mermaid for diagram relationships
        // only difference is entities is an array rather than object to allow duplicate tables
        let entities = {}
        let relationships = []
        // build models
        for (const key in model.cells) {
            if (Object.hasOwnProperty.call(model.cells, key)) {
                const mxcell = model.cells[key];
                if(mxcell.mxObjectId.indexOf("mxCell") !== -1) {
                    if(mxcell.style && mxcell.style.trim().startsWith("swimlane;")){
                        let entity = {
                            name: RemoveNameQuantifiers(mxcell.value),
                            attributes: []
                        }
                        for (let c = 0; c < mxcell.children.length; c++) {
                            const col = mxcell.children[c];
                            if(col.mxObjectId.indexOf("mxCell") !== -1) {
                                if(col.style && col.style.trim().startsWith("shape=partialRectangle")){
                                    const columnQuantifiers = GetColumnQuantifiers(type);
                                    //Get delimiter of column name
                                    //Get full name
                                    let attribute = getDbLabel(col.value, columnQuantifiers)
                                    var attributeKeyType = col.children.find(x=> ["FK","PK"].findIndex(k => k== x.value.toUpperCase()) !== -1 ||
                                        x.value.toUpperCase().indexOf("PK,")!=-1)
                                    if(attributeKeyType){
                                        attribute.attributeKeyType = attributeKeyType.value
                                        if(attribute.attributeKeyType != "PK" && attribute.attributeKeyType.indexOf("PK") != -1){
                                            attribute.attributeKeyType = "PK"
                                        }
                                    }
                                    entity.attributes.push(attribute)
                                    if(col.edges && col.edges.length){
                                        // check for edges foreign keys
                                        for (let e = 0; e < col.edges.length; e++) {
                                            const edge = col.edges[e];
                                            if(edge.mxObjectId.indexOf("mxCell") !== -1) {
                                                if(edge.style && edge.style.indexOf("endArrow=") != -1 && edge.source && 
                                                    edge.source.value && edge.target && edge.target.value){
                                                        // need to check if end is open or certain value to determin relationship type
                                                        // extract endArrow txt
                                                        // check if both match and contain many or open
                                                        // if both match and are many then create a new table
                                                        let endCheck = "endArrow="
                                                        let endArr = edge.style.indexOf(endCheck) != -1 ?
                                                        edge.style.substring(edge.style.indexOf(endCheck) + endCheck.length, edge.style.substring(edge.style.indexOf(endCheck) + endCheck.length).indexOf(";") + edge.style.indexOf(endCheck) + endCheck.length)
                                                        : ""
                                                        let startCheck = "startArrow="
                                                        let startArr = edge.style.indexOf(startCheck) != -1 ?
                                                        edge.style.substring(edge.style.indexOf(startCheck) + startCheck.length, edge.style.substring(edge.style.indexOf(startCheck) + startCheck.length).indexOf(";") + edge.style.indexOf(startCheck) + startCheck.length)
                                                        : ""

                                                        var manyCheck = ["open","many"]
                                                        var sourceIsPrimary = endArr && manyCheck
                                                        .findIndex(x => endArr.toLocaleLowerCase().indexOf(x)!=-1) != -1;
                                                        var targetIsPrimary = startArr && manyCheck
                                                            .findIndex(x => startArr.toLocaleLowerCase().indexOf(x)!=-1) != -1;
                                                        // has to be one to many and not one to one
                                                        if((targetIsPrimary || sourceIsPrimary) &&
                                                            !(targetIsPrimary && sourceIsPrimary)
                                                        ){
                                                            var sourceId = edge.source.value;
                                                            sourceAttr = getDbLabel(sourceId, columnQuantifiers);
                                                            sourceId = sourceAttr.attributeName
                                                            var sourceEntity = RemoveNameQuantifiers(edge.source.parent.value);
                                                            var targetId = edge.target.value;
                                                            targetAttr = getDbLabel(targetId, columnQuantifiers);
                                                            targetId = targetAttr.attributeName
                                                            var targetEntity = RemoveNameQuantifiers(edge.target.parent.value);
                                                            // entityA primary
                                                            // entityB foreign
                                                            let relationship = {
                                                                entityA: sourceIsPrimary ? sourceEntity : targetEntity,
                                                                entityB: sourceIsPrimary ? targetEntity : sourceEntity,
                                                                // based off of styles?
                                                                relSpec: {
                                                                    cardA: 'ZERO_OR_MORE',
                                                                    cardB: 'ONLY_ONE',
                                                                    relType: "IDENTIFYING"
                                                                },
                                                                roleA: sourceIsPrimary ? 
                                                                    `[${sourceEntity}.${sourceId}] to [${targetEntity}.${targetId}]` : 
                                                                    `[${targetEntity}.${targetId}] to [${sourceEntity}.${sourceId}]`
                                                            }
                                                            // check that is doesn't already exist
                                                            var exists = relationships.findIndex(r => r.entityA == relationship.entityA && r.entityB == relationship.entityB && r.roleA == relationship.roleA)
                                                            if(exists ==-1){
                                                                relationships.push(relationship)
                                                            }
                                                        } else if(targetIsPrimary && sourceIsPrimary){
                                                            // add a new many to many table
                                                            var sourceId = edge.source.value;
                                                            sourceAttr = getDbLabel(sourceId, columnQuantifiers);
                                                            sourceAttr.attributeKeyType = "PK"
                                                            sourceId = sourceAttr.attributeName
                                                            var sourceEntity = RemoveNameQuantifiers(edge.source.parent.value);
                                                            var targetId = edge.target.value;
                                                            targetAttr = getDbLabel(targetId, columnQuantifiers);
                                                            targetAttr.attributeKeyType = "PK"
                                                            targetId = targetAttr.attributeName
                                                            var targetEntity = RemoveNameQuantifiers(edge.target.parent.value);
                                                            let compositeEntity = {
                                                                name: RemoveNameQuantifiers(sourceEntity) + "_" + RemoveNameQuantifiers(targetEntity),
                                                                attributes: [sourceAttr, targetAttr]
                                                            }
                                                            // add composite entity
                                                            if(entities[compositeEntity.name]){
                                                                // DON'T add duplicate composite tables
                                                            } else {
                                                                entities[compositeEntity.name] = compositeEntity
                                                            }
                                                            // entityA primary
                                                            // entityB foreign
                                                            let relationship = {
                                                                entityA: sourceEntity,
                                                                entityB: compositeEntity.name,
                                                                // based off of styles?
                                                                relSpec: {
                                                                    cardA: 'ZERO_OR_MORE',
                                                                    cardB: 'ONLY_ONE',
                                                                    relType: "IDENTIFYING"
                                                                },
                                                                roleA: `[${sourceEntity}.${sourceId}] to [${compositeEntity.name}.${sourceId}]`
                                                            }
                                                            // check that is doesn't already exist
                                                            var exists = relationships.findIndex(r => r.entityA == relationship.entityA && r.entityB == relationship.entityB && r.roleA == relationship.roleA)
                                                            if(exists ==-1){
                                                                relationships.push(relationship)
                                                            }
                                                            let relationship2 = {
                                                                entityA: targetEntity,
                                                                entityB: compositeEntity.name,
                                                                // based off of styles?
                                                                relSpec: {
                                                                    cardA: 'ZERO_OR_MORE',
                                                                    cardB: 'ONLY_ONE',
                                                                    relType: "IDENTIFYING"
                                                                },
                                                                roleA: `[${targetEntity}.${targetId}] to [${compositeEntity.name}.${targetId}]`
                                                            }
                                                            // check that is doesn't already exist
                                                            exists = relationships.findIndex(r => r.entityA == relationship2.entityA && r.entityB == relationship2.entityB && r.roleA == relationship2.roleA)
                                                            if(exists ==-1){
                                                                relationships.push(relationship2)
                                                            }
                                                        }

                                                }
                                            }
                                            
                                        }
                                    }
                                }
                            }
                        }
                        // allows for duplicates if another table has the same name
                        if(entities[entity.name]){
                            var count = 2;
                            while(entities[entity.name + count.toString()]){
                                count++;
                            }
                            entities[entity.name + count.toString()] = entity
                        } else {
                            entities[entity.name] = entity
                        }
                    }

                }
            }
        }

        class DbDefinition{
            constructor(entities, relationships){
                this.entities = entities;
                this.relationships = relationships;
            }

            getEntities(){
                return this.entities
            }

            getRelationships(){
                return this.relationships
            }
        }

        var db = new DbDefinition(entities, relationships);

        return db;
    }

    function generateSql(type) {

        // get diagram model
        var db = getMermaidDiagramDb(type);
        // load parser
        var parser = new DbParser(type, db)
        // generate sql
        var sql = parser.getSQLDataDefinition()
        sql = `/*\n\tGenerated in drawio\n\tDatabase: ${type}\n*/\n\n` + sql
        sql = sql.trim();
        // update sql value in text area
        sqlInputGenSQL.value = sql;
        // TODO: use selection as well?
        var modelSelected = ui.editor.graph.getSelectionModel()
    };

    mxUtils.br(divGenSQL);

    const resetBtnGenSQL = mxUtils.button(mxResources.get('reset'), function() {
        sqlInputGenSQL.value = '';
    });

    resetBtnGenSQL.style.marginTop = '8px';
    resetBtnGenSQL.style.marginRight = '4px';
    resetBtnGenSQL.style.padding = '4px';
    divGenSQL.appendChild(resetBtnGenSQL);

    const btnGenSQL_mysql = mxUtils.button('MySQL', function() {
        generateSql('mysql');
    });

    btnGenSQL_mysql.style.marginTop = '8px';
    btnGenSQL_mysql.style.padding = '4px';
    divGenSQL.appendChild(btnGenSQL_mysql);

    const btnGenSQL_sqlserver = mxUtils.button('SQL Server', function() {
        generateSql('sqlserver');
    });

    btnGenSQL_sqlserver.style.marginTop = '8px';
    btnGenSQL_sqlserver.style.padding = '4px';
    divGenSQL.appendChild(btnGenSQL_sqlserver);

    const btnGenSQL_postgres = mxUtils.button('PostgreSQL', function() {
        generateSql('postgres');
    });

    btnGenSQL_postgres.style.marginTop = '8px';
    btnGenSQL_postgres.style.padding = '4px';
    divGenSQL.appendChild(btnGenSQL_postgres);

    const btnGenSQL_sqlite = mxUtils.button('Sqlite', function() {
        generateSql('sqlite');
    });

    btnGenSQL_sqlite.style.marginTop = '8px';
    btnGenSQL_sqlite.style.padding = '4px';
    divGenSQL.appendChild(btnGenSQL_sqlite);

    // Adds action
    ui.actions.addAction('tosql', function() {
        wndGenSQL.setVisible(!wndGenSQL.isVisible());

        if (wndGenSQL.isVisible()) {
            sqlInputGenSQL.focus();
        }
    });
    // end export sql methods

    // import diagrams from sql text methods

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
            const removedComments = chunk
                // remove database comments, multiline, --, and //
                .replace(/\/\*[\s\S]*?\*\/|\/\/|--.*/g, "")
                .replace(/IF NOT EXISTS/gi, "")
                .trim();
            const cleanedLines = removedComments
                .split("\n")
                // remove empty lines
                .filter((n) => n)
                // remove multiple spaces
                .map((n) => n.replace(/\s+/g, " ").trim());
            // combine lines that are in parenthesis
            const lines = [];
            let insertSameLine = false;
            cleanedLines.forEach((n) => {
                if (lines.length > 0){
                    if((n[0] == "(" &&
                        lines[lines.length - 1].toLocaleLowerCase().indexOf(contants_1.CreateTable) ==
                            -1) ||
                        insertSameLine) {
                        if (lines.length > 0) {
                            insertSameLine = true;
                            lines[lines.length - 1] += ` ${n}`;
                            if (n[0] == ")")
                                insertSameLine = false;
                        }
                    }
                    else if(lines[lines.length - 1].match(/CONSTRAINT/gi) && 
                        (n.match(/FOREIGN KEY/gi) && !n.match(/CONSTRAINT/gi))
                    ){
                        lines[lines.length - 1] += ` ${n}`;
                    }
                    // add to previous line if current has references and previous has foreign key
                    else if(lines[lines.length - 1].match(/FOREIGN KEY/gi) && 
                        (n.match(/REFERENCES/gi) && !n.match(/FOREIGN KEY/gi))
                    ){
                        lines[lines.length - 1] += ` ${n}`;
                    }
                    else if(n.substring(0,2).toUpperCase() == "ON"){
                        lines[lines.length - 1] += ` ${n}`;
                    }
                    else {
                        lines.push(n);
                    }
                }
                else {
                    lines.push(n);
                }
            });
            let currentTableModel = null;
            //Parse SQL to objects
            for (let i = 0; i < lines.length; i++) {
                // rowCell = null;
                const tmp = lines[i].trim();
                const propertyRow = tmp.toLowerCase().trim();
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
                    let name = tmp
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
                    let name = tmp.substring(0, tmp.charAt(tmp.length - 1) === "," ? tmp.length - 1 : tmp.length);
                    //Attempt to get the Key Type
                    let propertyType = name.toLowerCase();
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
                    const normalProperty = !propertyType.match(/PRIMARY KEY\s?\(/gi) &&
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
                            const firstSpaceIndex = name[0] == "[" && name.indexOf("]" + " ") !== -1
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
                            const firstSpaceIndex = name[0] == columnQuantifiers.Start &&
                                name.indexOf(columnQuantifiers.End + " ") !== -1
                                ? name.indexOf(columnQuantifiers.End + " ")
                                : name.indexOf(" ");
                            ExtendedProperties = name.substring(firstSpaceIndex + 1).trim();
                            //Get full name
                            name = name.substring(0, firstSpaceIndex);
                            name = this.RemoveNameQuantifiers(name);
                        }
                        //Create Property
                        const propertyModel = this.CreateProperty(name, currentTableModel.Name, null, false, ExtendedProperties);
                        //Add Property to table
                        currentTableModel.Properties.push(propertyModel);
                        if (ExtendedProperties.toLocaleLowerCase().indexOf(contants_1.Primary_Key) > -1) {
                            //Create Primary Key
                            const primaryKeyModel = this.CreatePrimaryKey(name, currentTableModel.Name);
                            //Add Primary Key to List
                            this.primaryKeyList = this.primaryKeyList.concat(primaryKeyModel);
                        }
                    }
                    else {
                        //Parse Primary Key
                        if (propertyType.indexOf(contants_1.Primary_Key) != -1 ||
                            propertyType.indexOf(contants_1.CONSTRAINT_Primary_Key) != -1) {
                            if (!this.MODE_SQLSERVER) {
                                const primaryKey = name
                                    .replace(/PRIMARY KEY\s?\(/gi, "")
                                    .replace(")", "");
                                //Create Primary Key
                                const primaryKeyModel = this.CreatePrimaryKey(primaryKey, currentTableModel.Name);
                                //Add Primary Key to List
                                this.primaryKeyList = this.primaryKeyList.concat(primaryKeyModel);
                            }
                            else {
                                if (propertyRow.indexOf(contants_1.Primary_Key) !== -1 &&
                                    nameSkipCheck.indexOf("CLUSTERED") === -1) {
                                    const primaryKey = name
                                        .replace(/PRIMARY KEY\s?\(/gi, "")
                                        .replace(")", "");
                                    //Create Primary Key
                                    const primaryKeyModel = this.CreatePrimaryKey(primaryKey, currentTableModel.Name);
                                    //Add Primary Key to List
                                    this.primaryKeyList = this.primaryKeyList.concat(primaryKeyModel);
                                }
                                else {
                                    const startIndex = name.toLocaleLowerCase().indexOf("(");
                                    const endIndex = name.indexOf(")") + 1;
                                    const primaryKey = name
                                        .substring(startIndex, endIndex)
                                        .replace("(", "")
                                        .replace(")", "")
                                        .replace(/ASC/gi, "")
                                        .trim();
                                    const columnQuantifiers = this.GetColumnQuantifiers();
                                    //Get delimiter of column name
                                    const firstSpaceIndex = primaryKey[0] == columnQuantifiers.Start &&
                                        primaryKey.indexOf(columnQuantifiers.End + " ") !== -1
                                        ? primaryKey.indexOf(columnQuantifiers.End + " ")
                                        : primaryKey.indexOf(" ");
                                    const primaryKeyRow = firstSpaceIndex == -1
                                        ? primaryKey
                                        : primaryKey.substring(firstSpaceIndex + 1).trim();
                                    //Create Primary Key
                                    const primaryKeyModel = this.CreatePrimaryKey(primaryKeyRow, currentTableModel.Name);
                                    //Add Primary Key to List
                                    this.primaryKeyList = this.primaryKeyList.concat(primaryKeyModel);
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
                            let completeRow = name;
                            if (nameSkipCheck.indexOf("REFERENCES") === -1) {
                                const referencesRow = lines[i + 1].trim();
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
                        const alterTableRow = tmp.substring(0, tmp.charAt(tmp.length - 1) === "," ? tmp.length - 1 : tmp.length);
                        const referencesRow = lines[i + 1].trim();
                        const completeRow = alterTableRow + " " + referencesRow;
                        this.ParseSQLServerForeignKey(completeRow, currentTableModel);
                    }
                }
            }
            // parse fk and primary keys
            if (this.primaryKeyList.length > 0) {
                this.primaryKeyList.forEach((pk) => {
                    // find table index
                    const pkTableIndex = this.tableList.findIndex((t) => t.Name.toLocaleLowerCase() ==
                        pk.PrimaryKeyTableName.toLocaleLowerCase());
                    // find property index
                    if (pkTableIndex > -1) {
                        const propertyIndex = this.tableList[pkTableIndex].Properties.findIndex((p) => p.Name.toLocaleLowerCase() ==
                            pk.PrimaryKeyName.toLocaleLowerCase());
                        if (propertyIndex > -1) {
                            this.tableList[pkTableIndex].Properties[propertyIndex].IsPrimaryKey = true;
                        }
                    }
                });
            }
            if (this.foreignKeyList.length > 0) {
                this.foreignKeyList.forEach((fk) => {
                    // find table index
                    const pkTableIndex = this.tableList.findIndex((t) => t.Name.toLocaleLowerCase() ==
                        fk.ReferencesTableName.toLocaleLowerCase());
                    // find property index
                    if (pkTableIndex > -1) {
                        const propertyIndex = this.tableList[pkTableIndex].Properties.findIndex((p) => p.Name.toLocaleLowerCase() ==
                            fk.PrimaryKeyName.toLocaleLowerCase());
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
            const primaryKeyNames = this.RemoveNameQuantifiers(primaryKeyName)
                .split(",")
                .filter((n) => n)
                // remove multiple spaces
                .map((n) => n.replace(/\s+/g, " ").trim());
            const primaryKeys = [];
            primaryKeyNames.forEach(name => {
                const primaryKey = {
                    PrimaryKeyTableName: primaryKeyTableName,
                    PrimaryKeyName: name,
                };
                primaryKeys.push(primaryKey);
            });
            return primaryKeys;
        }
        CreateProperty(name, tableName, foreignKey, isPrimaryKey, columnProps) {
            const isForeignKey = foreignKey !== undefined && foreignKey !== null;
            const property = {
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
            const referencesIndex = name.toLowerCase().indexOf("references");
            let foreignKeySQL = name.substring(0, referencesIndex);
            foreignKeySQL = foreignKeySQL.substring(foreignKeySQL.toUpperCase().indexOf("FOREIGN KEY"))
            let referencesSQL = name.substring(referencesIndex, name.length);
            //Remove references syntax
            referencesSQL = referencesSQL.replace(/REFERENCES /gi, "");
            //Get Table and Property Index
            const referencedTableIndex = referencesSQL.indexOf("(");
            const referencedPropertyIndex = referencesSQL.indexOf(")");
            //Get Referenced Table
            const referencedTableName = referencesSQL.substring(0, referencedTableIndex);
            //Get Referenced Key
            const referencedPropertyName = referencesSQL.substring(referencedTableIndex + 1, referencedPropertyIndex);
            //Get ForeignKey
            const foreignKey = foreignKeySQL
                .replace(/FOREIGN KEY\s?\(/gi, "")
                .replace(")", "")
                .replace(" ", "");
            //Create ForeignKey
            const foreignKeyOriginModel = this.CreateForeignKey(foreignKey, currentTableModel.Name, referencedPropertyName, referencedTableName, true);
            //Add ForeignKey Origin
            this.foreignKeyList.push(foreignKeyOriginModel);
            //Create ForeignKey
            const foreignKeyDestinationModel = this.CreateForeignKey(referencedPropertyName, referencedTableName, foreignKey, currentTableModel.Name, false);
            //Add ForeignKey Destination
            this.foreignKeyList.push(foreignKeyDestinationModel);
        }
        ParseSQLServerForeignKey(name, currentTableModel) {
            const referencesIndex = name.toLowerCase().indexOf("references");
            let foreignKeySQL = "";
            if (name.toLowerCase().indexOf(`${contants_1.Foreign_Key}(`) !== -1) {
                foreignKeySQL = name
                    .substring(name.toLowerCase().indexOf(`${contants_1.Foreign_Key}(`), referencesIndex)
                    .replace(/FOREIGN KEY\(/gi, "")
                    .replace(")", "");
            }
            else {
                foreignKeySQL = name
                    .substring(name.toLowerCase().indexOf(`${contants_1.Foreign_Key}(`), referencesIndex)
                    .replace(/FOREIGN KEY\s?\(/gi, "")
                    .replace(")", "");
            }
            let referencesSQL = name.substring(referencesIndex, name.length);
            const nameSkipCheck = name.toUpperCase().trim();
            let alterTableName = name
                .substring(0, nameSkipCheck.indexOf("WITH"))
                .replace(/ALTER TABLE /gi, "");
            if (referencesIndex !== -1 &&
                alterTableName !== "" &&
                foreignKeySQL !== "" &&
                referencesSQL !== "") {
                //Remove references syntax
                referencesSQL = referencesSQL.replace(/REFERENCES /gi, "");
                //Get Table and Property Index
                const referencedTableIndex = referencesSQL.indexOf("(");
                const referencedPropertyIndex = referencesSQL.indexOf(")");
                //Get Referenced Table
                let referencedTableName = referencesSQL.substring(0, referencedTableIndex);
                //Parse Name
                referencedTableName = this.ParseSQLServerName(referencedTableName);
                //Get Referenced Key
                let referencedPropertyName = referencesSQL.substring(referencedTableIndex + 1, referencedPropertyIndex);
                //Parse Name
                referencedPropertyName = this.ParseSQLServerName(referencedPropertyName);
                //Get ForeignKey
                let foreignKey = foreignKeySQL
                    .replace(/FOREIGN KEY\s?\(/gi, "")
                    .replace(")", "");
                //Parse Name
                foreignKey = this.ParseSQLServerName(foreignKey);
                //Parse Name
                alterTableName = this.ParseSQLServerName(alterTableName);
                //Create ForeignKey
                const foreignKeyOriginModel = this.CreateForeignKey(foreignKey, alterTableName, referencedPropertyName, referencedTableName, true);
                //Add ForeignKey Origin
                this.foreignKeyList.push(foreignKeyOriginModel);
                //Create ForeignKey
                const foreignKeyDestinationModel = this.CreateForeignKey(referencedPropertyName, referencedTableName, foreignKey, alterTableName, false);
                //Add ForeignKey Destination
                this.foreignKeyList.push(foreignKeyDestinationModel);
            }
        }
        CreateForeignKey(primaryKeyName, primaryKeyTableName, referencesPropertyName, referencesTableName, isDestination) {
            const foreignKey = {
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
            const table = {
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
            return char === "\"" || char === "'" || char === "`";
        }
        /**
         * convert labels with start and end strings per database type
         * @param label
         * @returns
         */
        dbTypeEnds(label) {
            let char1 = "\"";
            let char2 = "\"";
            if (this.dialect == "mysql") {
                char1 = "`";
                char2 = "`";
            }
            else if (this.dialect == "sqlserver") {
                char1 = "[";
                char2 = "]";
            }
            return `${char1}${label}${char2}`;
        }
        WithEnds() {
            this.tableList = this.tableList.map((table) => {
                table.Name = this.dbTypeEnds(table.Name);
                table.Properties = table.Properties.map((property) => {
                    property.Name = this.dbTypeEnds(property.Name);
                    property.TableName = this.dbTypeEnds(property.TableName);
                    return property;
                });
                return table;
            });
            this.primaryKeyList = this.primaryKeyList.map((primaryKey) => {
                primaryKey.PrimaryKeyName = this.dbTypeEnds(primaryKey.PrimaryKeyName);
                primaryKey.PrimaryKeyTableName = this.dbTypeEnds(primaryKey.PrimaryKeyTableName);
                return primaryKey;
            });
            this.foreignKeyList = this.foreignKeyList.map((foreignKey) => {
                foreignKey.PrimaryKeyName = this.dbTypeEnds(foreignKey.PrimaryKeyName);
                foreignKey.ReferencesPropertyName = this.dbTypeEnds(foreignKey.ReferencesPropertyName);
                foreignKey.PrimaryKeyTableName = this.dbTypeEnds(foreignKey.PrimaryKeyTableName);
                foreignKey.ReferencesTableName = this.dbTypeEnds(foreignKey.ReferencesTableName);
                return foreignKey;
            });
            return this;
        }
        WithoutEnds() {
            this.tableList.map((table) => {
                table.Name = this.RemoveNameQuantifiers(table.Name);
                table.Properties = table.Properties.map((property) => {
                    property.Name = this.RemoveNameQuantifiers(property.Name);
                    property.TableName = this.RemoveNameQuantifiers(property.TableName);
                    return property;
                });
                return table;
            });
            this.primaryKeyList = this.primaryKeyList.map((primaryKey) => {
                primaryKey.PrimaryKeyName = this.RemoveNameQuantifiers(primaryKey.PrimaryKeyName);
                primaryKey.PrimaryKeyTableName = this.RemoveNameQuantifiers(primaryKey.PrimaryKeyTableName);
                return primaryKey;
            });
            this.foreignKeyList = this.foreignKeyList.map((foreignKey) => {
                foreignKey.PrimaryKeyName = this.RemoveNameQuantifiers(foreignKey.PrimaryKeyName);
                foreignKey.ReferencesPropertyName = this.RemoveNameQuantifiers(foreignKey.ReferencesPropertyName);
                foreignKey.PrimaryKeyTableName = this.RemoveNameQuantifiers(foreignKey.PrimaryKeyTableName);
                foreignKey.ReferencesTableName = this.RemoveNameQuantifiers(foreignKey.ReferencesTableName);
                return foreignKey;
            });
            return this;
        }
        /**
         * return text quantifiers for dialect
         * @returns json
         */
        GetColumnQuantifiers() {
            const chars = {
                Start: "\"",
                End: "\"",
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
    const divFromSQL = document.createElement('div');
    divFromSQL.style.userSelect = 'none';
    divFromSQL.style.overflow = 'hidden';
    divFromSQL.style.padding = '10px';
    divFromSQL.style.height = '100%';

    var graph = ui.editor.graph;

    const sqlInputFromSQL = document.createElement('textarea');
    sqlInputFromSQL.style.height = '200px';
    sqlInputFromSQL.style.width = '100%';
    var defaultReset = '/*\n\tDraw io default value\n*/\n\nCREATE TABLE Persons\n(\n    PersonID int NOT NULL,\n    LastName varchar(255),\n    ' +
    'FirstName varchar(255),\n    Address varchar(255),\n    City varchar(255),\n    Primary Key(PersonID)\n);\n\n' + 
    'CREATE TABLE Orders\n(\n    OrderID int NOT NULL PRIMARY KEY,\n    PersonID int NOT NULL,\n    FOREIGN KEY ([PersonID]) REFERENCES [Persons]([PersonID])' +
    '\n);'
    sqlInputFromSQL.value = defaultReset
    mxUtils.br(divFromSQL);
    divFromSQL.appendChild(sqlInputFromSQL);

    var graph = ui.editor.graph;

    // Extends Extras menu
    mxResources.parse('fromSql=From SQL');

    const wndFromSQL = new mxWindow(mxResources.get('fromSql'), divFromSQL, document.body.offsetWidth - 480, 140,
        320, 320, true, true);
    wndFromSQL.destroyOnClose = false;
    wndFromSQL.setMaximizable(false);
    wndFromSQL.setResizable(false);
    wndFromSQL.setClosable(true);

    function AddRow(propertyModel, tableName) {
        
        var cellName = propertyModel.Name + (propertyModel.ColumnProperties ? " " + propertyModel.ColumnProperties: "");

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
        // reset values
        cells = []
        tableCell = null;
        rowCell = null;
        // load parser
        const parser = new SqlSimpleParser(type);
        

        const models = parser
            .feed(text)
            .WithoutEnds()
            .WithEnds()
            .ToModel();
        
        

        foreignKeyList = models.ForeignKeyList;
        primaryKeyList = models.PrimaryKeyList;
        tableList = models.TableList;
        exportedTables = tableList.length;

        //Create Table in UI
        CreateTableUI(type);
    };
    /**
     * return text quantifiers for dialect
     * @returns json
     */
     function GetColumnQuantifiers(type) {
        let chars = {
            Start: '"',
            End: '"',
        };
        if (type == "mysql") {
            chars.Start = "`";
            chars.End = "`";
        }
        else if (type == "sqlserver") {
            chars.Start = "[";
            chars.End = "]";
        }
        return chars;
    }

    /**
     * extract row column attributes
     * @param {*} label 
     * @param {*} columnQuantifiers 
     * @returns 
     */
       function getDbLabel(label, columnQuantifiers){
        // fix duplicate spaces and different space chars
        label = label
            .replace(/\s+/g, " ")
        let firstSpaceIndex = label[0] == columnQuantifiers.Start &&
            label.indexOf(columnQuantifiers.End + " ") !== -1
                ? label.indexOf(columnQuantifiers.End + " ")
                : label.indexOf(" ");
        let attributeType = label.substring(firstSpaceIndex + 1).trim();
        let attributeName = label.substring(0, firstSpaceIndex + 1);
        let attribute = {
            attributeName,
            attributeType
        }
        return attribute
    }

    function CreateTableUI(type) {
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
            // add foreign key edges
            var model = graph.getModel();
            const columnQuantifiers = GetColumnQuantifiers(type);
            var pt = graph.getFreeInsertPoint();
            foreignKeyList.forEach(function(fk){
                if(fk.IsDestination && fk.PrimaryKeyName && fk.ReferencesPropertyName && 
                    fk.PrimaryKeyTableName && fk.ReferencesTableName) {
                    var insertEdge = mxUtils.bind(this, function(targetCell, sourceCell, edge){
                        var label = ""
                        var edgeStyle = "edgeStyle=entityRelationEdgeStyle;html=1;endArrow=ERzeroToMany;startArrow=ERzeroToOne;labelBackgroundColor=none;fontFamily=Verdana;fontSize=14;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=-0.018;entryY=0.608;entryDx=0;entryDy=0;entryPerimeter=0;"
                        var edgeCell = graph.insertEdge(null, null, label || '', (edge.invert) ?
                        sourceCell : targetCell, (edge.invert) ? targetCell : sourceCell, edgeStyle);
                    });
                    let edge = {
                        invert: true
                    };
                    var targetCell = null;
                    var sourceCell = null;
                    // locate edge source and target cells
                    for (const key in model.cells) {
                        if(targetCell && sourceCell)
                            break;
                        if (Object.hasOwnProperty.call(model.cells, key)) {
                            const mxcell = model.cells[key];
                            if(mxcell.style && mxcell.style.trim().startsWith("swimlane;")){
                                let entity = {
                                    name: mxcell.value,
                                    attributes: []
                                }
                                var isPrimaryTable = entity.name == fk.PrimaryKeyTableName;
                                var isForeignTable = entity.name == fk.ReferencesTableName;
                                if(isPrimaryTable || isForeignTable){
                                    for (let c = 0; c < mxcell.children.length; c++) {
                                        if(targetCell && sourceCell)
                                            break;
                                        const col = mxcell.children[c];
                                        if(col.mxObjectId.indexOf("mxCell") !== -1) {
                                            if(col.style && col.style.trim().startsWith("shape=partialRectangle")){
                                                let attribute = getDbLabel(col.value, columnQuantifiers)
                                                if(isPrimaryTable && attribute.attributeName == fk.PrimaryKeyName){
                                                    targetCell = col;
                                                    break;
                                                } else if(isForeignTable && attribute.attributeName == fk.ReferencesPropertyName){
                                                    sourceCell = col;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }

                            }
                        }
                    }
                    if(targetCell && sourceCell)
                        insertEdge(targetCell, sourceCell, edge);
                }
            })
            graph.scrollCellToVisible(graph.getSelectionCell());
        }

        wndFromSQL.setVisible(false);
    };

    mxUtils.br(divFromSQL);

    const resetBtnFromSQL = mxUtils.button(mxResources.get('reset'), function() {
        sqlInputFromSQL.value = defaultReset;
    });

    resetBtnFromSQL.style.marginTop = '8px';
    resetBtnFromSQL.style.marginRight = '4px';
    resetBtnFromSQL.style.padding = '4px';
    divFromSQL.appendChild(resetBtnFromSQL);

    const btnFromSQL_mysql = mxUtils.button('Insert MySQL', function() {
        parseSql(sqlInputFromSQL.value, 'mysql');
    });

    btnFromSQL_mysql.style.marginTop = '8px';
    btnFromSQL_mysql.style.padding = '4px';
    divFromSQL.appendChild(btnFromSQL_mysql);

    const btnFromSQL_sqlserver = mxUtils.button('Insert SQL Server', function() {
        parseSql(sqlInputFromSQL.value, 'sqlserver');
    });

    btnFromSQL_sqlserver.style.marginTop = '8px';
    btnFromSQL_sqlserver.style.padding = '4px';
    divFromSQL.appendChild(btnFromSQL_sqlserver);

    const btnFromSQL_postgres = mxUtils.button('Insert PostgreSQL', function() {
        parseSql(sqlInputFromSQL.value, 'postgres');
    });

    btnFromSQL_postgres.style.marginTop = '8px';
    btnFromSQL_postgres.style.padding = '4px';
    divFromSQL.appendChild(btnFromSQL_postgres);

    const btnFromSQL_sqlite = mxUtils.button('Insert Sqlite', function() {
        parseSql(sqlInputFromSQL.value, 'sqlite');
    });

    btnFromSQL_sqlite.style.marginTop = '8px';
    btnFromSQL_sqlite.style.padding = '4px';
    divFromSQL.appendChild(btnFromSQL_sqlite);

    // Adds action
    ui.actions.addAction('fromSql', function() {
        wndFromSQL.setVisible(!wndFromSQL.isVisible());

        if (wndFromSQL.isVisible()) {
            sqlInputFromSQL.focus();
        }
    });
    // end import diagrams from sql text methods

    // finalize menu buttons
    var theMenu = ui.menus.get('insert');
    var oldMenu = theMenu.funct;

    theMenu.funct = function(menu, parent) {
        oldMenu.apply(this, arguments);
        ui.menus.addMenuItems(menu, ['fromSql'], parent);
    };
    if(theMenuExportAs && theMenuExportAs.enabled) {
        var oldMenuExportAs = theMenuExportAs.funct;

        theMenuExportAs.funct = function(menu, parent) {
            oldMenuExportAs.apply(this, arguments);
            ui.menus.addMenuItems(menu, ['tosql'], parent);
        };
    } else {
        // vscode file export sql menu
	    var menu = ui.menus.get('file');
	    var oldMenuExportAs = menu.funct;
        menu.funct = function(menu, parent) {
            oldMenuExportAs.apply(this, arguments);
            ui.menus.addMenuItems(menu, ['tosql'], parent);
        };
    }
});