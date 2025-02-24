/**
 * Custom Attributes plugin.
 * Displays a toolbox when objects are selected, for easy entry of Custom Attribute Names and Values
 * Attribute (Property Names and Values are also editable via the Edit->Edit Data menu,
 * but this plugin and associated toolbox improve the UX
 */
Draw.loadPlugin(function (ui) {
    const graph = ui.editor.graph;
    const toolboxName = "Custom Attributes";

    let toolbox = new mxWindow(toolboxName, document.createElement("div"), 300, 150, 300, 220, true, true);
    toolbox.setVisible(false);

    const container = toolbox.content;
    container.style.overflow = "hidden";
    container.style.padding = "10px";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.height = "100%";

    // Scrollable attribute list with fixed height
    const tableContainer = document.createElement("div");
    tableContainer.style.height = "130px"; // Fixed height
    tableContainer.style.overflowY = "auto"; // Vertical scroll only
    tableContainer.style.position = "relative"; // Needed for sticky header

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.textAlign = "left";
    table.style.display = "block";

    // Floating header
    const thead = document.createElement("thead");
    thead.style.position = "sticky";
    thead.style.top = "0";
    thead.style.backgroundColor = "#fff"; // Prevents blending into the background
    thead.style.zIndex = "10"; // Keeps it above scrolling content
    thead.style.boxShadow = "0px 2px 2px rgba(0,0,0,0.1)"; // Adds a subtle shadow
    thead.style.display = "table"; // Aligns with the tbody
    thead.style.width = "100%"; // Ensures it sticks properly

    const headerRow = document.createElement("tr");
    headerRow.style.display = "table"; // Keeps alignment
    headerRow.style.width = "100%"; // Ensures full-width alignment

    const nameHeader = createSortableHeader("Name");
    const valueHeader = createSortableHeader("Value");

    headerRow.appendChild(nameHeader);
    headerRow.appendChild(valueHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Scrollable body
    const tbody = document.createElement("tbody");
    tbody.style.display = "table"; // Ensures alignment with headers
    tbody.style.width = "100%"; // Matches header width
    table.appendChild(tbody);
    tableContainer.appendChild(table);

    // Error message display
    const errorMessage = document.createElement("div");
    errorMessage.style.color = "red";
    errorMessage.style.marginTop = "5px";
    errorMessage.style.minHeight = "15px"; // Keeps a consistent error space

    // Delete Button
    const deleteButtonContainer = document.createElement("div");
    deleteButtonContainer.style.textAlign = "right";
    deleteButtonContainer.style.paddingTop = "5px";

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete Attribute";

    deleteButtonContainer.appendChild(deleteButton);

    // Append elements to the container
    container.appendChild(tableContainer);
    container.appendChild(errorMessage);
    container.appendChild(deleteButtonContainer);

    let selectedCell = null;
    let selectedCellProperties = {};
    let previousSelectedCell = null;
    let selectedAttribute = null;
    let sortState = { column: null, order: null };
    let newRowSetFocus = false;

    function createSortableHeader(name) {
        const th = document.createElement("th");
        th.innerText = name;
        th.style.cursor = "pointer";
        th.style.padding = "1px";
        th.style.borderBottom = "2px solid black";
        th.style.position = "relative";
        th.style.minWidth = "50px"; // Prevents shifting

        // Add a span for sorting arrows
        const arrow = document.createElement("span");
        arrow.style.marginLeft = "5px";
        arrow.style.display = "inline-block";
        arrow.style.width = "10px"; // Fixed space to avoid shifting
        th.appendChild(arrow);

        th.addEventListener("click", function () {
            sortTable(name.toLowerCase(), th, arrow);
        });

        return th;
    }

    function sortTable(column, header, arrow) {
        let rows = Array.from(tbody.querySelectorAll("tr"));

        // Find the placeholder row by checking for the placeholder text
        let placeholderRow = rows.find(row => {
            let nameInput = row.cells[0].querySelector("input");
            return nameInput && nameInput.placeholder === "New Attribute";
        });

        // Filter out the placeholder row from sorting
        let sortableRows = rows.filter(row => row !== placeholderRow);

        if (sortState.column === column) {
            sortState.order = sortState.order === "asc" ? "desc" : "asc";
        } else {
            sortState.column = column;
            sortState.order = "asc";
        }

        // Sort only the non-placeholder rows
        sortableRows.sort((rowA, rowB) => {
            let cellA = rowA.cells[column === "name" ? 0 : 1].querySelector("input").value.toLowerCase();
            let cellB = rowB.cells[column === "name" ? 0 : 1].querySelector("input").value.toLowerCase();

            return sortState.order === "asc" ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
        });

        // Re-append sorted rows
        sortableRows.forEach(row => tbody.appendChild(row));

        // Re-append the placeholder row at the bottom
        if (placeholderRow) {
            tbody.appendChild(placeholderRow);
        }

        // Update sort arrow
        document.querySelectorAll("th span").forEach(span => (span.innerText = ""));
        arrow.innerText = sortState.order === "asc" ? "▲" : "▼";
    }

    function getProperties(cell) {
        if (!cell || !mxUtils.isNode(cell.value)) return {};

        let attributes = {};
        for (let i = 0; i < cell.value.attributes.length; i++) {
            let attr = cell.value.attributes[i];
            if (attr.nodeName !== "label") { // Exclude "label" attribute from display
                attributes[attr.nodeName] = attr.nodeValue;
            }
        }
        return attributes;
    }

    function setAttribute(cell, attributeName, attributeValue) {
        let newNode;
        if (!mxUtils.isNode(cell.value)) {
            var doc = mxUtils.createXmlDocument();
            var obj = doc.createElement("object");
            newNode = obj;
            newNode.setAttribute("label", cell.value);
        } else {
            newNode = cell.value.cloneNode(true);
        }

        newNode.setAttribute(attributeName, attributeValue);
        cell.setValue(newNode);
    }

    function setSelectedAttribute(attribute) {
        selectedAttribute = attribute;
        deleteButton.disabled = (attribute === null);
        deleteButton.style.color = (attribute === null) ? "grey" : "black";
        deleteButton.style.cursor = (attribute === null) ? "not-allowed" : "pointer";
        deleteButton.style.opacity = (attribute === null) ? "0.6" : "1";
    }

    function refreshProperties() {
        if (!selectedCell) return;

        let extractedAttributes = getProperties(selectedCell.value);

        // Merge extracted attributes into selectedCellProperties
        selectedCellProperties = { ...extractedAttributes, ...getProperties(selectedCell) };

        // Update title with label attribute if it exists
        toolbox.setTitle(`${toolboxName} - ${selectedCell.getAttribute("label") || selectedCell.value || "Unnamed Object"}`);

        tbody.innerHTML = "";
        errorMessage.innerText = "";
        setSelectedAttribute(null);

        let entries = Object.entries(selectedCellProperties);

        // Apply sorting if a column is set
        if (sortState.column) {
            entries.sort(([keyA, valueA], [keyB, valueB]) => {
                let a = sortState.column === "name" ? keyA.toLowerCase() : valueA.toLowerCase();
                let b = sortState.column === "name" ? keyB.toLowerCase() : valueB.toLowerCase();
                return sortState.order === "asc" ? a.localeCompare(b) : b.localeCompare(a);
            });
        }

        // Populate attribute table
        entries.forEach(([key, value]) => {
            createAttributeRow(false, key, value, selectedCellProperties);
        });

        const nameInput = createAttributeRow(true);
        // If we've just tabbed off a placeholder row, set focus on the new placeholder row
        if (newRowSetFocus) {
            setTimeout(() => {
                nameInput.focus();
                nameInput.select();
            }, 10); // Small delay ensures the element is in the DOM
            newRowSetFocus = false;
        }
    }

    function createAttributeRow(isPlaceholder, attributeName, attributeValue) {
        const tr = document.createElement("tr");
        tr.style.cursor = "pointer";

        // Editable Name Cell
        const nameCell = document.createElement("td");
        nameCell.style.paddingRight = "6px";
        const nameInput = document.createElement("input");
        nameInput.style.width = "100%";
        nameInput.value = isPlaceholder ? "" : attributeName;
        nameInput.placeholder = isPlaceholder ? "New Attribute" : "";
        nameCell.appendChild(nameInput);
        tr.appendChild(nameCell);

        // Editable Value Cell
        const valueCell = document.createElement("td");
        valueCell.style.paddingRight = "6px";
        const valueInput = document.createElement("input");
        valueInput.style.width = "100%";
        valueInput.value = isPlaceholder ? "" : attributeValue;
        valueInput.placeholder = isPlaceholder ? "New Value" : "";

        // Highlight selection
        tr.addEventListener("click", function () {
            setSelectedAttribute(isPlaceholder ? null : attributeName);

            // Remove highlight and bold styling from all rows
            tbody.querySelectorAll("tr").forEach(row => {
                row.querySelectorAll("td input").forEach(input => {
                    input.style.fontWeight = "normal";
                });
            });

            // Make text bold in selected row
            tr.querySelectorAll("td input").forEach(input => {
                input.style.fontWeight = "bold";
            });
        });

        nameInput.addEventListener("blur", function (event) {
            errorMessage.innerHTML = ""; //Clear previous errors
            const newName = nameInput.value.trim();
            if (newName !== attributeName) { //Attribute name has changed
                if (attributeExists(newName)) {
                    errorMessage.innerHTML = "Error: An attribute with this name already exists.";
                    nameInput.value = isPlaceholder ? "" : attributeName; // Restore original name
                    nameInput.focus();
                }
                else if (newName === "") {
                    if (typeof attributeName !== 'undefined') {
                        errorMessage.innerHTML = "Error: Attribute name cannot be blanked out.";
                        nameInput.value = attributeName;
                        nameInput.focus();
                    }
                }
                else {
                    updateAttributeName(attributeName, newName, valueInput.value.trim());
                    if (event.relatedTarget === valueInput)
                        valueInput.focus();
                }
            }
        });

        valueInput.addEventListener("blur", function () {
            errorMessage.innerHTML = ""; //Clear previous errors
            if (valueInput.value !== attributeValue || isPlaceholder) { //Attribute Value change
                if (nameInput.value.trim() === "")
                    errorMessage.innerHTML = "Error: An attribute name must be entered for the value.";
                else {
                    setAttribute(selectedCell, nameInput.value.trim(), valueInput.value.trim());
                    if (isPlaceholder) {
                        //Placeholder row, call refreshProperties to add a new placeholder row and set a flag to set Focus
                        newRowSetFocus = true;
                        refreshProperties();
                    }
                }
            }
        });

        valueCell.appendChild(valueInput);
        tr.appendChild(valueCell);
        tbody.appendChild(tr);
        return nameInput;
    }

    // Checks if a attribute name already exists
    function attributeExists(name) {
        //console.log(`attributeExists: Name ${name} Properties ${JSON.stringify(selectedCellProperties)}`)
        return Object.keys(selectedCellProperties).includes(name);
    }

    // Updates the attribute name in the data store
    function updateAttributeName(oldName, newName, newValue) {
        if (selectedCell) {
            deleteAttribute(oldName);
            setAttribute(selectedCell, newName, newValue);
        }
    }

    function deleteAttribute(name) {
        if (!selectedCell || !mxUtils.isNode(selectedCell.value)) return;

        let newNode = selectedCell.value.cloneNode(true);
        newNode.removeAttribute(name);

        selectedCell.setValue(newNode);

    }

    deleteButton.addEventListener("click", function () {
        if (selectedAttribute && selectedCell) {
            deleteAttribute(selectedAttribute);
            setSelectedAttribute(null);
            refreshProperties();
        }
    });

    graph.getSelectionModel().addListener(mxEvent.CHANGE, function () {
        selectedCell = graph.getSelectionCell();
        setSelectedAttribute(null);
        if (selectedCell) {
            if (previousSelectedCell !== selectedCell) {
                previousSelectedCell = selectedCell;
            }
            toolbox.setVisible(true);
            refreshProperties();
        } else {
            toolbox.setVisible(false);
        }
    });
});