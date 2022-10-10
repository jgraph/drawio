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
        div.innerHTML = label;
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
        let attributeName = label.substring(0, firstSpaceIndex);
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
                            name: mxcell.value,
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
                                                        // var matchingArrows = startArr == endArr

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
                                                            var sourceEntity = edge.source.parent.value
                                                            var targetId = edge.target.value;
                                                            targetAttr = getDbLabel(targetId, columnQuantifiers);
                                                            targetId = targetAttr.attributeName
                                                            var targetEntity = edge.target.parent.value
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
                                                            var sourceEntity = edge.source.parent.value
                                                            var targetId = edge.target.value;
                                                            targetAttr = getDbLabel(targetId, columnQuantifiers);
                                                            targetAttr.attributeKeyType = "PK"
                                                            targetId = targetAttr.attributeName
                                                            var targetEntity = edge.target.parent.value
                                                            let compositeEntity = {
                                                                name: RemoveNameQuantifiers(sourceEntity) + "_" + RemoveNameQuantifiers(targetEntity),
                                                                attributes: [sourceAttr, targetAttr]
                                                            }
                                                            // add composite entity
                                                            if(entities[compositeEntity.name]){
                                                                // DON'T add duplicate composite tables
                                                                // var countE = 2;
                                                                // while(entities[compositeEntity.name + countE.toString()]){
                                                                //     countE++;
                                                                // }
                                                                // compositeEntity.name = compositeEntity.name + countE.toString()
                                                                // entities[compositeEntity.name] = compositeEntity
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

    function parseSql(type) {

        // get diagram model
        var db = getMermaidDiagramDb(type);
        // load parser
        var parser = new DbParser(type, db)
        // generate sql
        var sql = parser.getSQLDataDefinition()
        sql = `/*\n\tGenerated in drawio\n\tDatabase: ${type}\n*/\n\n` + sql
        sql = sql.trim();
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