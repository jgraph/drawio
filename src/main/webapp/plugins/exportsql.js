/**
 * Parse entity charts to SQL. Simple initial version for community to improve.
 */
Draw.loadPlugin(function(ui) {

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
                        // FOREIGN KEY (`Artist Id`) REFERENCES `Artist`(`ArtistId`)
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
    var div = document.createElement('div');
    div.style.userSelect = 'none';
    div.style.overflow = 'hidden';
    div.style.padding = '10px';
    div.style.height = '100%';

    var sqlInput = document.createElement('textarea');
    sqlInput.style.height = '200px';
    sqlInput.style.width = '100%';
    sqlInput.value = '-- click a database type button'
    mxUtils.br(div);
    div.appendChild(sqlInput);

    // Extends Extras menu
    mxResources.parse('tosql=To SQL');

    var wnd = new mxWindow(mxResources.get('tosql'), div, document.body.offsetWidth - 480, 140,
        320, 320, true, true);
    wnd.destroyOnClose = false;
    wnd.setMaximizable(false);
    wnd.setResizable(false);
    wnd.setClosable(true);

    function getMermaidDiagramDb(){
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
                            name: mxcell.value,
                            attributes: []
                        }
                        for (let c = 0; c < mxcell.children.length; c++) {
                            const col = mxcell.children[c];
                            if(col.mxObjectId.indexOf("mxCell") !== -1) {
                                if(col.style && col.style.trim().startsWith("shape=partialRectangle")){
                                    let attributeName = col.value.substring(0, col.value.indexOf(" "))
                                    let attributeType = col.value.substring(col.value.indexOf(" ") + 1)
                                    let attribute = {
                                        attributeName,
                                        attributeType
                                    }
                                    var attributeKeyType = col.children.find(x=> ["FK","PK"].findIndex(k => k== x.value.toUpperCase()) !== -1)
                                    if(attributeKeyType)
                                        attribute.attributeKeyType = attributeKeyType.value
                                    entity.attributes.push(attribute)
                                    if(col.edges && col.edges.length){
                                        // check for edges foreign keys
                                        for (let e = 0; e < col.edges.length; e++) {
                                            const edge = col.edges[e];
                                            if(edge.mxObjectId.indexOf("mxCell") !== -1) {
                                                if(edge.style && edge.style.indexOf("endArrow=") != -1 && edge.source && 
                                                    edge.source.value && edge.target && edge.target.value){
                                                        // need to check if end is open or certain value to determin relationship type
                                                        var targetIsPrimary = edge.style.indexOf("endArrow=open") != -1;
                                                        var sourceIsPrimary = ["startArrow=open", "endArrow=ERoneToMany"]
                                                            .findIndex(x => edge.style.indexOf(x)!=-1) != -1;
                                                        // has to be one to many and not one to one
                                                        if((targetIsPrimary || sourceIsPrimary) &&
                                                            !(targetIsPrimary && sourceIsPrimary)
                                                        ){
                                                            var sourceId = edge.source.value;
                                                            sourceId = sourceId.substring(0,sourceId.indexOf(" "))
                                                            var sourceEntity = edge.source.parent.value
                                                            var targetId = edge.target.value;
                                                            targetId = targetId.substring(0,targetId.indexOf(" "))
                                                            var targetEntity = edge.target.parent.value
                                                            // entityA primnary
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

    function parseSql(type) {

        // get diagram model
        var db = getMermaidDiagramDb();
        debugger;
        // load parser
        var parser = new DbParser(type, db)
        // generate sql
        var sql = parser.getSQLDataDefinition()
        debugger;
        // update sql value in text area
        sqlInput.value = sql;
        // TODO: use selection as well?
        var modelSelected = ui.editor.graph.getSelectionModel()
    };

    mxUtils.br(div);

    var resetBtn = mxUtils.button(mxResources.get('reset'), function() {
        sqlInput.value = '';
    });

    resetBtn.style.marginTop = '8px';
    resetBtn.style.marginRight = '4px';
    resetBtn.style.padding = '4px';
    div.appendChild(resetBtn);

    var btn = mxUtils.button('MySQL', function() {
        parseSql('mysql');
    });

    btn.style.marginTop = '8px';
    btn.style.padding = '4px';
    div.appendChild(btn);

    var btn = mxUtils.button('SQL Server', function() {
        parseSql('sqlserver');
    });

    btn.style.marginTop = '8px';
    btn.style.padding = '4px';
    div.appendChild(btn);

    var btn = mxUtils.button('PostgreSQL', function() {
        parseSql('postgres');
    });

    btn.style.marginTop = '8px';
    btn.style.padding = '4px';
    div.appendChild(btn);

    var btn = mxUtils.button('Sqlite', function() {
        parseSql('sqlite');
    });

    btn.style.marginTop = '8px';
    btn.style.padding = '4px';
    div.appendChild(btn);

    // Adds action
    ui.actions.addAction('tosql', function() {
        wnd.setVisible(!wnd.isVisible());

        if (wnd.isVisible()) {
            sqlInput.focus();
        }
    });

    var theMenu = ui.menus.get('insert');
    var oldMenu = theMenu.funct;

    theMenu.funct = function(menu, parent) {
        oldMenu.apply(this, arguments);

        ui.menus.addMenuItems(menu, ['tosql'], parent);
    };
});