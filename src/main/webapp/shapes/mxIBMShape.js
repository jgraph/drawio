/**
 * $Id: mxIBMShape.js,v 1.0 2022/06/01 17:00:00 mate Exp $
 * Copyright (c) 2022, JGraph Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


(function()
{
	let ibmIcons;
	let ibmConfig = JSON.parse(mxUtils.load((new RegExp(/^.*\//)).exec(window.location.href)[0] + 'js/diagramly/sidebar/ibm/IBMConfig.json').getText());
	let ibmLanguage = (new URLSearchParams(window.location.search)).get('lang') || 'en';

//**********************************************************************************************************************************************************
// Base Shapes
//**********************************************************************************************************************************************************

function mxIBMShapeBase(bounds, fill, stroke, strokewidth) {
	let configured = Editor.configure(ibmConfig, true);
	mxShape.call(this, bounds, fill, stroke, strokewidth);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

mxUtils.extend(mxIBMShapeBase, mxShape);

mxIBMShapeBase.prototype.cst = ibmConfig.ibmBaseConstants;

mxIBMShapeBase.prototype.customProperties = ibmConfig.ibmBaseProperties;

mxIBMShapeBase.prototype.customAttributes = ibmConfig.ibmBaseAttributes;

mxIBMShapeBase.prototype.init = function (container) {
	if (this.node == null) {
		this.node = this.create(container);
		if (container != null) {
			container.appendChild(this.node);
		}
		
		// Add shape custom attributes
		this.addCustomAttributes(this.state.cell);

		// Define custom event handler
		this.customEventsHandler = mxUtils.bind(this, function (sender, event) {
			if (event.properties.change && event.properties.change.cell && event.properties.change.cell.id === this.state.cell.id) {
				if ("mxValueChange" === event.properties.change.constructor.name) {
					this.valueChangedEventsHandler(this.state.view.graph, event);
				}
				if ("mxStyleChange" === event.properties.change.constructor.name) {
					this.styleChangedEventsHandler(this.state.view.graph, event);
				}
			}
		})
		this.state.view.graph.model.addListener('executed', this.customEventsHandler);
	}
}

/**
 * Add custom attributes to cell
 * @param {*} cell 
 */
mxIBMShapeBase.prototype.addCustomAttributes = function(cell) {
	if (!mxUtils.isNode(cell.value)) { 
		let obj = mxUtils.createXmlDocument().createElement('UserObject');
		obj.setAttribute('label', cell.value);
		cell.value = obj;
	}
	for (var key of this.customAttributes) {
		if (!cell.hasAttribute(key)) {
			cell.setAttribute(key, '');
		}
	}	
}

/**
 * valueChangedEventsHandler
 * @param {*} graph 
 * @param {*} event 
 */
mxIBMShapeBase.prototype.valueChangedEventsHandler = function (graph, event) {	
	var { current, previous } = { 
		current: event.properties.change.value.attributes, 
		previous: event.properties.change.previous.attributes 
	};
	var isChanged = this.customAttributes.some(item => (current.getNamedItem(item) && current.getNamedItem(item).value) !== (previous.getNamedItem(item) && previous.getNamedItem(item).value));
	if (this.node && isChanged) {
		// Check for changes to label and set top spacing if needed.
		if ((current["Primary-Label"].value != previous["Primary-Label"].value) ||
		    (current["Secondary-Text"].value != previous["Secondary-Text"].value)) {
			if (this.state.cell.style && this.state.style) {
				let shapeType = mxUtils.getValue(this.state.style, this.cst.SHAPE_TYPE, this.cst.SHAPE_TYPE_DEFAULT); 
				let shapeLayout = mxUtils.getValue(this.state.style, this.cst.SHAPE_LAYOUT, this.cst.SHAPE_LAYOUT_DEFAULT); 
				if (shapeLayout.startsWith('expanded') && shapeType !== 'target') {
					let previousSpacing = this.state.cell.style.includes('spacingTop') ? this.state.style["spacingTop"] : 0;
					let currentSpacing = getLabelSpacing(current["Primary-Label"].value, current["Secondary-Text"].value);
					if (previousSpacing != currentSpacing) {
						this.state.cell.style = mxUtils.setStyle(this.state.cell.style, "spacingTop", currentSpacing);
						this.state.style["spacingTop"] = currentSpacing;
					}
				}
			}
		}
		// Redraw for changes to badge text or icon name.
		this.redraw();
	}
}

/**
 * styleChangedEventsHandler
 * @param {*} graph 
 * @param {*} event 
 */
mxIBMShapeBase.prototype.styleChangedEventsHandler = function (graph, event) {

	var cell = event.properties.change.cell;
	var pStyleStr = event.properties.change.previous;
	var cStyleStr = event.properties.change.style;
	var pStyle = getStylesObj(pStyleStr);
	var cStyle = getStylesObj(cStyleStr);

	// Hold all the changes
	var changes = {};
	changes.style = this.getNewStyles(cStyleStr, pStyle, cStyle);

	// Get the new geometry	
	var geometry = cell.getGeometry();
	var geometryRect = this.getNewGeometryRect(cStyle, new mxRectangle(geometry.x, geometry.y, geometry.width, geometry.height), false);
	geometry.height = geometryRect.height;
	geometry.width = geometryRect.width;
	changes.geometry = geometry;

	// set the new style and geometry
	graph.model.beginUpdate();
	try {
		graph.model.setStyle(cell, changes.style);
		graph.model.setGeometry(cell, changes.geometry);
	} finally {
		graph.model.endUpdate();
	}
}

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxIBMShapeBase.prototype.paintVertexShape = function (c, x, y, w, h) {
	var properties = this.getProperties(this, h, w);

	c.translate(x, y);
	this.drawShape(c, properties);
	this.drawStencil(c, properties);
	this.drawStyle(c, properties);
	this.drawBadge(c, properties);
}

mxIBMShapeBase.prototype.getProperties = function (shape, shapeHeight, shapeWidth) {
	var properties = {}
	if (shape.state.style) {
		properties.shapeType = mxUtils.getValue(shape.state.style, this.cst.SHAPE_TYPE, this.cst.SHAPE_TYPE_DEFAULT);
		properties.shapeLayout = mxUtils.getValue(shape.state.style, this.cst.SHAPE_LAYOUT, this.cst.SHAPE_LAYOUT_DEFAULT);
		properties.styleDashed = mxUtils.getValue(shape.state.style, this.cst.STYLE_DASHED, this.cst.STYLE_DASHED_DEFAULT);
		properties.styleDouble = mxUtils.getValue(shape.state.style, this.cst.STYLE_DOUBLE, this.cst.STYLE_DOUBLE_DEFAULT);
		properties.styleStrikethrough = mxUtils.getValue(shape.state.style, this.cst.STYLE_STRIKETHROUGH, this.cst.STYLE_STRIKETHROUGH_DEFAULT);
		properties.styleMultiplicity = mxUtils.getValue(shape.state.style, this.cst.STYLE_MULTIPLICITY, this.cst.STYLE_MULTIPLICITY_DEFAULT);
		properties.ibmBadge = mxUtils.getValue(shape.state.style, this.cst.BADGE, this.cst.BADGE_DEFAULT);
		properties.hideIcon = mxUtils.getValue(shape.state.style, this.cst.HIDE_ICON, this.cst.HIDE_ICON_DEFAULT);
		properties.rotateIcon = mxUtils.getValue(shape.state.style, this.cst.ROTATE_ICON, this.cst.ROTATE_ICON_DEFAULT);
		properties.lineColor = mxUtils.getValue(shape.state.style, this.cst.LINE_COLOR, this.cst.LINE_COLOR_DEFAULT);
		properties.fillColor = mxUtils.getValue(shape.state.style, this.cst.FILL_COLOR, this.cst.FILL_COLOR_DEFAULT);
		properties.fontColor = mxUtils.getValue(shape.state.style, this.cst.FONT_COLOR, this.cst.FONT_COLOR_DEFAULT);

		var details = this.getDetails(shape, properties.shapeType, properties.shapeLayout, shapeWidth, shapeHeight);
		for (var key in details) {
			properties[key] = details[key];
		}

		// set the shape size
		if (properties['shapeHeight'] == null) {
			properties['shapeHeight'] = properties.defaultHeight;
		}
		if (properties['shapeWidth'] == null) {
			properties['shapeWidth'] = properties.defaultWidth;
		}
	}

	return properties;
}

/**
 * Draw base shape
 * @param {*} c 
 * @param {*} properties 
 */
mxIBMShapeBase.prototype.drawShape = function (c, properties) {	
	if (properties.shapeLayout !== 'itemBadge') {
		// draw shape container
		drawShapeContainer(0, 0, properties.shapeWidth, properties.shapeHeight, properties.curveRadius);

		if (properties.shapeType === 'zone') return;

		if (properties.shapeType.startsWith('group')) {
			c.rect(0, 0, properties.sidebarWidth, properties.sidebarHeight);
			c.setStrokeColor(properties.lineColor);
			c.setFillColor(properties.styleColor);
			c.setDashed(false);
			c.fillAndStroke();
		} else if (properties.shapeType === 'sub') {
			c.rect(0, properties.subbarAlign, properties.subbarWidth, properties.subbarHeight);
			c.setStrokeColor(properties.lineColor);
			c.setFillColor(properties.fillColor);
			c.setDashed(false);
			c.fillAndStroke();
		} else if (properties.shapeLayout.startsWith('expanded') && properties.shapeType !== 'target') {
			if (!properties.hideIcon) {
				drawIconArea(0, 0, properties.iconAreaWidth, properties.iconAreaHeight, properties.curveRadius);
				c.setStrokeColor(properties.lineColor);
				if (this.image) {
					c.setFillColor(properties.fillColor);
					if (properties.styleDashed) {
						c.setDashed(true, true);
						c.setDashPattern('6 6');
					}
				}
				else {
					c.setFillColor(properties.iconAreaColor);
					c.setDashed(false);
				}
				c.fillAndStroke();
			}
		}
		if (properties.shapeType.startsWith('comp')) {
			c.rect(properties.sidetickAlign, properties.minHeight / 4, properties.sidetickWidth, properties.sidetickHeight);
			c.setStrokeColor(properties.lineColor);
			c.setFillColor(ibmConfig.ibmColors.white);
			c.setDashed(false);
			c.fillAndStroke();

			c.rect(properties.sidetickAlign, properties.minHeight - properties.minHeight / 4 - properties.sidetickHeight, properties.sidetickWidth, properties.sidetickHeight);
			c.setDashed(false);
			c.fillAndStroke();
		}
	}

	function drawShapeContainer(x, y, w, h, curveRadius) {
		// if shape is styleDouble
		if (properties.styleDouble) {
			drawBaseShape(x, y, w, h, curveRadius);
			c.setStrokeColor(properties.lineColor);
			c.fillAndStroke();
			// reset x, y, w, h, curveRadius			
			x = properties.doubleAlign;
			y = properties.doubleAlign;
			w = properties.shapeWidth - properties.doubleAlign * 2;
			h = properties.shapeHeight - properties.doubleAlign * 2;
			curveRadius = properties.curveRadius - properties.doubleAlign;
		} 
		// if shape is zone
		else if (properties.shapeType === 'zone') {
			c.setDashed(true, true);
			c.setDashPattern('2 4');
		}
		// if shape is styleDashed
		else if (properties.styleDashed) {
			c.setDashed(true, true);
			c.setDashPattern('6 6');
			// single dashed border on any shape and visible on collapsed or target shapes with no fill color
			if ((properties.shapeLayout === 'collapsed' || properties.shapeType === 'target') && properties.fillColor === 'none') {
				drawBaseShape(x, y, w, h, curveRadius);
				c.setStrokeColor(properties.lineColor);
				c.fillAndStroke();
				// reset x, y, w, h, curveRadius			
				x = properties.doubleAlign;
				y = properties.doubleAlign;
				w = properties.shapeWidth - properties.doubleAlign * 2;
				h = properties.shapeHeight - properties.doubleAlign * 2;
				curveRadius = properties.curveRadius - properties.doubleAlign;
				// set inner border to solid so only outer border is dashed
				c.setDashed(false);
			}
		} else {
			c.setDashed(false);
		}
		// 	draw actual shape container
		drawBaseShape(x, y, w, h, curveRadius);
		if (properties.shapeLayout == 'itemIcon') {
			c.setStrokeColor('none');
			c.setFillColor(properties.fillColor);
		} else if (properties.shapeLayout == 'itemStyle' || properties.shapeLayout == 'itemShape') {
			c.setFillColor(ibmConfig.ibmColors.white)
		} else {
			c.setStrokeColor(properties.lineColor);
			if (properties.shapeLayout.startsWith('expanded') && properties.shapeType !== 'target') {
				c.setFillColor(properties.fillColor)
			} else {
				c.setFillColor(properties.iconAreaColor);				
			}
		}
		c.fillAndStroke();
	}

	function drawBaseShape(x, y, w, h, curveRadius) {
		if (properties.shapeType == 'actor') {
			c.ellipse(x, y, w, h);
		} else if (properties.shapeType == 'target') {
			c.roundrect(x, y, w, h, curveRadius, curveRadius);
		} else if (properties.shapeType == 'nodel' || properties.shapeType == 'compl') {
			c.roundrect(x, y, w, h, curveRadius, curveRadius);
		} else if (properties.shapeType == 'groupl') {
			c.begin()
			c.moveTo(x, y);
			c.lineTo(x + w - curveRadius, y);
			c.arcTo(curveRadius, curveRadius, 0, 0, 1, x + w, curveRadius);
			c.lineTo(x + w, h - curveRadius);
			c.arcTo(curveRadius, curveRadius, 0, 0, 1, x + w - curveRadius, h);
			c.lineTo(curveRadius, h);			
			c.arcTo(curveRadius, curveRadius, 0, 0, 1, x, h - curveRadius);
			c.close();
		} else {
			c.rect(x, y, w, h);
		}
	}

	function drawIconArea(x, y, w, h, curveRadius) {
		if (properties.shapeType == 'nodel' || properties.shapeType == 'compl') {
			if (properties.sidebarHeight < properties.shapeHeight) {
				c.begin()
				c.moveTo(curveRadius, y);
				c.lineTo(w, y);
				c.lineTo(w, h);
				c.lineTo(x, h);
				c.lineTo(x, curveRadius);
				c.arcTo(curveRadius, curveRadius, 0, 0, 1, curveRadius, y);
				c.close();
			} else {
				c.begin()
				c.moveTo(curveRadius, y);
				c.lineTo(w, y);
				c.lineTo(w, h);
				c.lineTo(curveRadius, h);
				c.arcTo(curveRadius, curveRadius, 0, 0, 1, x, h - curveRadius);
				c.lineTo(x, curveRadius);
				c.arcTo(curveRadius, curveRadius, 0, 0, 1, curveRadius, y);
				c.close();
			}
		} else {
			c.rect(x, y, w, h);
		}
	}
}

/**
 * Draw stencil, hideIcon if set
 * @param {*} c 
 * @param {*} properties 
 */
mxIBMShapeBase.prototype.drawStencil = function (c, properties) {
	if (properties.shapeLayout.startsWith('expanded') || properties.shapeLayout === 'collapsed' || properties.shapeLayout === 'itemIcon') {
		if (!properties.hideIcon) {
			var x = properties.iconAreaWidth / 2 - properties.iconSize / 2;
			var y = properties.iconAreaHeight / 2 - properties.iconSize / 2;
			if (properties.shapeType.startsWith('group') || properties.shapeType === 'sub' || properties.shapeType === 'zone') {
				x = properties.iconAreaWidth - properties.iconSize;
			}
			if (properties.shapeLayout.startsWith('expanded') && properties.shapeType  === 'target') {
				x = x + properties.curveRadius / 2;
			}
			if (properties.shapeLayout.startsWith('item')) {
				x = 0;
			}

			c.save();
			// rotate icon if set
			if (properties.rotateIcon) {
				c.rotate(properties.rotateIcon, false, false, x + properties.iconSize / 2, properties.iconAreaHeight / 2);
			}
			// draw image or stencil
			if (this.image) { // if the shape style contains image attribute
				c.image(x, y, properties.iconSize, properties.iconSize, this.image, true, false, false);
			} else  {
				var prIcon = this.state.cell.getAttribute('Icon-Name');
				var prStencil = mxStencilRegistry.getStencil('mxgraph.ibmicons.' + prIcon);
				if (prStencil == null) {
					prStencil = mxStencilRegistry.getStencil('mxgraph.ibmicons.undefined');
				}
				c.setFillColor(properties.iconColor);
				c.setStrokeColor('none');
				c.setDashed(false);
				c.strokewidth = 1;
				prStencil.drawShape(c, this, x, y, properties.iconSize, properties.iconSize);				
			}
			c.restore();
		}
	}
}

/**
 * Draw style, styleStrikethrough and styleMultiplicity
 * @param {*} c 
 * @param {*} properties 
 */
mxIBMShapeBase.prototype.drawStyle = function (c, properties) {
	if (properties.shapeLayout.startsWith('expanded') || properties.shapeLayout === 'collapsed' || properties.shapeLayout === 'itemStyle') {
		if (properties.styleStrikethrough) {
			c.begin();
			if (properties.shapeLayout == 'collapsed' || properties.shapeLayout == 'itemStyle' || properties.shapeType.startsWith('group')) {
				c.moveTo(0, 0);
				c.lineTo(properties.shapeWidth, properties.shapeHeight);
			} else if (properties.shapeLayout.startsWith('expanded')) {
				if (properties.shapeType == 'target') {
					c.moveTo(properties.iconSize, 0);
					c.lineTo(properties.shapeWidth - properties.iconSize, properties.iconAreaHeight);
					properties.styleColor = properties.fillColor == 'none' ? properties.fontColor : properties.styleColor;
				} else {
					properties.hideIcon ? c.moveTo(0, 0) : c.moveTo(properties.iconAreaWidth, 0);
					c.lineTo(properties.shapeWidth, properties.iconAreaHeight);
				}
			}
			c.setStrokeColor(properties.styleColor);			
			c.stroke();
			c.close();
		}

		if (properties.styleMultiplicity) {
			c.begin();
			for (var i = 1; i <= 2; i++) {
				var offSet = properties.multiplicityAlign * i;
				if (properties.shapeType == 'actor') {
					c.moveTo(properties.shapeWidth / 2 + offSet, - offSet);
					c.arcTo(properties.curveRadius, properties.curveRadius, 0, 0, 1, properties.shapeWidth + offSet, properties.shapeHeight / 2 - offSet);
					c.moveTo(properties.shapeWidth / 2 + offSet, - offSet);
				} else if (properties.shapeType == 'target') {
					c.moveTo(properties.iconSize + offSet, - offSet);
					c.lineTo(properties.shapeWidth + offSet - properties.curveRadius, - offSet);
					c.arcTo(properties.curveRadius, properties.curveRadius, 0, 0, 1, properties.shapeWidth + offSet, properties.curveRadius - offSet);
					c.lineTo(properties.shapeWidth + offSet, properties.shapeHeight / 2 - offSet);
					c.moveTo(properties.iconSize + offSet, - offSet);
				} else if (properties.shapeType.endsWith('l')) {
					c.moveTo(offSet, - offSet);
					c.lineTo(properties.shapeWidth + offSet - properties.curveRadius, - offSet);
					c.arcTo(properties.curveRadius, properties.curveRadius, 0, 0, 1, properties.shapeWidth + offSet, properties.curveRadius - offSet);
					c.lineTo(properties.shapeWidth + offSet, properties.shapeHeight - offSet);
					c.moveTo(offSet, - offSet);
				} else {
					c.moveTo(offSet, - offSet);
					c.lineTo(properties.shapeWidth + offSet, - offSet);
					c.lineTo(properties.shapeWidth + offSet, properties.shapeHeight - offSet);
					c.moveTo(offSet, - offSet);
				}
			}
			if (properties.styleDashed) {
				c.setDashed(true, true);
				c.setDashPattern('6 6');
			} else {
				c.setDashed(false);
			}
			c.setStrokeColor(properties.lineColor);			
			c.stroke();
			c.close();
		}
	}
}

/**
 * Draw badge shape, color, text, font color
 * @param {*} c 
 * @param {*} properties 
 */
mxIBMShapeBase.prototype.drawBadge = function (c, properties) {
	if (properties.ibmBadge != 'none' && (properties.shapeLayout.startsWith('expanded') || properties.shapeLayout === 'collapsed' || properties.shapeLayout === 'itemBadge')) {
		var bW = ibmConfig.ibmShapeSizes[properties.ibmBadge + 'Badge'].width;
		var bH = ibmConfig.ibmShapeSizes[properties.ibmBadge + 'Badge'].height;
		var bM = 1;
		var fontSize = 12;
		var fontFamily = ibmConfig.ibmFonts[ibmLanguage];

		let textLength = (properties.badgeText != null) ? properties.badgeText.length : 0;
		let badgeTextOffset = (textLength > 1) ? fontSize * textLength : 0;
		var offset = properties.shapeType == 'target' || properties.shapeType == 'actor' ? - bW / 2 - bM : 0;

		if (properties.shapeLayout !== 'itemBadge') {			
			let x = properties.shapeWidth + offset - bW / 2 - badgeTextOffset;
			let y = -bW / 2;
			let w = bW + badgeTextOffset;
			let h = bH;
			drawBadgeIcon(ibmConfig.ibmColors.white, ibmConfig.ibmColors.white, x, y, w, h, -1);
			drawBadgeIcon(properties.badgeColor, properties.badgeFillColor, x, y, w, h, 0);
		} else {			
			let x = bW / 2;
			let y = 1;
			let w = bW;
			let h = bH;
			drawBadgeIcon(properties.badgeColor, properties.badgeFillColor, x, y, w, h, 0);
		}

		if (properties.badgeText != null) {
			c.setFontFamily(fontFamily);
			c.setFontSize(fontSize);
			c.setFontColor(properties.badgeFontColor);
			if (properties.shapeLayout !== 'itemBadge') {
				c.text(properties.shapeWidth - badgeTextOffset / 2 + offset, - 1, 0, 14, properties.badgeText, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
			} 
		}
	}

	function drawBadgeIcon(strokeColor, fillColor, x, y, w, h, offset) {
		let r = 7;
		let shapeActions = {
			circle: { operators: ['move', 'line', 'arc', 'line', 'arc'], positions: [[x + r, y + offset], [x + w - r, y + offset], [x + w - r, y + h - offset], [x + r, y + h - offset], [x + r, y + offset]] },
			diamond: { operators: ['move', 'line', 'line', 'line', 'line', 'line'], positions: [[x + r, y + offset], [x + w - r, y + offset], [x + w - offset, y + r], [x + w - r, y + h - offset], [x + r, y + h - offset], [x + offset, y + r]] },
			hexagon: { operators: ['move', 'line', 'line', 'line', 'line', 'line', 'line'], positions: [[x + r / 2, y + offset], [x + w - offset / 2 - r / 2, y + offset], [x + w - offset, y + r], [x + w - offset / 2 - r / 2, y + h - offset], [x + offset / 2 + r / 2, y + h - offset], [x + offset, y + r], [x + offset / 2 + r / 2, y + offset]] },
			octagon: { operators: ['move', 'line', 'line', 'line', 'line', 'line', 'line', 'line', 'line'], positions: [[x + offset / 2 + r / 2, y + offset], [x + w - offset / 2 - r / 2, y + offset], [x + w - offset, y + offset / 2 + r / 2], [x + w - offset, y + h - offset / 2 - r / 2], [x + w - offset / 2 - r / 2, y + h - offset], [x + offset / 2 + r / 2, y + h - offset], [x + offset, y + h - offset / 2 - r / 2], [x + offset, y + offset / 2 + r / 2], [x + offset / 2 + r / 2, y + offset]] },
			square: { operators: ['move', 'line', 'line', 'line', 'line'], positions: [[x + offset, y + offset], [x + w - offset, y + offset], [x + w - offset, y + h - offset], [x + offset, y + h - offset], [x + offset, y + offset]] },
			triangle: { operators: ['move', 'line', 'line', 'line', 'line'], positions: [[x + r, y + offset], [x + w - offset - r, y + offset], [x + w - 2 * offset, y + h - offset], [x + 2 * offset, y + h - offset], [x + offset + r, y + offset]] }
		}

		let action = shapeActions[properties.ibmBadge];
		if (action) {
			c.begin();
			for (let i in action.operators) {
				let positions = action.positions[i];
				if (action.operators[i] === 'move') {
					c.moveTo(positions[0], positions[1]);
				}
				else if (action.operators[i] === 'line') {
					c.lineTo(positions[0], positions[1]);
				}
				else if (action.operators[i] === 'arc') {
					c.arcTo(1, 1, 0, 0, 1, positions[0], positions[1]);
				}
			}
			c.close();
		}

		c.setStrokeColor(strokeColor);
		c.setFillColor(fillColor);
		c.setDashed(false);
		c.fillAndStroke();
	}
}

/**
 * get the new shape style as per shapeType and shapeLayout
 * @param {*} cStyleStr 
 * @param {*} pStyle 
 * @param {*} cStyle 
 * @returns 
 */
mxIBMShapeBase.prototype.getNewStyles = function (cStyleStr, pStyle, cStyle) {	
	var style = this.getBaseStyle(cStyleStr, pStyle, cStyle);

	var newStyle = this.getLayoutStyle(style.cStyleStr, style.pStyle, style.cStyle);
	newStyle = this.getLineStyle(newStyle, style.pStyle, style.cStyle);
	newStyle = this.getColorStyle(newStyle, style.pStyle, style.cStyle);

	return newStyle;
}

/**
 * get the new shape size as per shapeType and shapeLayout
 * @param {*} style 
 * @param {*} rect 
 * @param {*} minSize 
 * @returns 
 */
mxIBMShapeBase.prototype.getNewGeometryRect = function (style, rect, minSize) {	
	const shapeType = mxUtils.getValue(style, mxIBMShapeBase.prototype.cst.SHAPE_TYPE, mxIBMShapeBase.prototype.cst.SHAPE_TYPE_DEFAULT);
	const shapeLayout = mxUtils.getValue(style, mxIBMShapeBase.prototype.cst.SHAPE_LAYOUT, mxIBMShapeBase.prototype.cst.SHAPE_LAYOUT_DEFAULT);
	var details = this.getDetails(null, shapeType, shapeLayout, rect.width, rect.height);
	if (shapeLayout === 'collapsed') {
		rect.width = details.minWidth;
		rect.height = details.minHeight;
	} else if (shapeLayout.startsWith('expanded')) {
		if (minSize) {
			rect.width = Math.max(details.minWidth, rect.width);
		} else {
			if (rect.width < details.minWidth) {
				rect.width = details.defaultWidth;
			}
		}
		if (shapeType === 'target') {
			rect.height = details.minHeight;
		} else {
			rect.height = Math.max(details.minHeight, rect.height);
		}
	} 
	else {
		rect.width = Math.max(details.minWidth, rect.width);
		rect.height = details.minHeight;
	}	

	if (shapeType == 'actor') {
		rect.width = Math.min(details.minWidth, 48);
		rect.height = Math.min(details.minHeight, 48);
	}	
	return rect;
}

/**
 * Rewrite label position
 * @param {*} rect 
 * @returns 
 */
mxIBMShapeBase.prototype.getLabelBounds = function (rect) {
	var properties = this.getProperties(this, null, null);
	var offSet = properties.hideIcon || properties.shapeLayout.startsWith('item') ? properties.labelAlign : properties.iconAreaWidth + properties.labelAlign;
	return new mxRectangle(rect.x + offSet * this.scale, rect.y, rect.width - properties.labelAlign * this.scale, properties.labelHeight * this.scale);
};

/**
 * Retrieve size and color details.
 * @param {*} shape
 * @param {*} shapeType
 * @param {*} shapeLayout
 * @param {*} shapeWidth
 * @param {*} shapeHeight
 * @returns 
 */
mxIBMShapeBase.prototype.getDetails = function (shape, shapeType, shapeLayout, shapeWidth, shapeHeight) {
	let details = {};

	// Get defined shape sizes.

	if (shapeLayout === 'collapsed') {
		if (shapeType === 'target')
			details = ibmConfig.ibmShapeSizes.collapsedTarget;
		else if (shapeType === 'actor')
			details = ibmConfig.ibmShapeSizes.collapsedActor;
		else
			details = ibmConfig.ibmShapeSizes.collapsed;

		details = Object.assign({}, details, ibmConfig.ibmShapeSizes.trim);

		details['shapeWidth'] = shapeWidth;
		details['shapeHeight'] = shapeHeight;
	}
	else if (shapeLayout.startsWith('expanded')) {
		if (shapeType === 'target')
			details = ibmConfig.ibmShapeSizes.expandedTarget;
		else if (shapeType.startsWith('group') || shapeType === 'sub' || shapeType === 'zone')
			details = ibmConfig.ibmShapeSizes.group;
		else
			details = ibmConfig.ibmShapeSizes.expanded;

		details = Object.assign({}, details, ibmConfig.ibmShapeSizes.trim);

		details['shapeWidth'] = shapeWidth;
		details['shapeHeight'] = shapeHeight;
	}
	else {
		if (shapeLayout === 'itemBadge')
			details = ibmConfig.ibmShapeSizes.itemBadge;
		else if (shapeLayout === 'itemColor')
			details = ibmConfig.ibmShapeSizes.itemColor;
		else if (shapeLayout === 'itemStyle')
			details = ibmConfig.ibmShapeSizes.itemStyle;
		else if (shapeLayout === 'itemIcon' && shapeType === 'target')
			details = ibmConfig.ibmShapeSizes.itemTarget;
		else if (shapeLayout === 'itemIcon' && shapeType === 'actor')
			details = ibmConfig.ibmShapeSizes.itemActor;
		else if (shapeLayout === 'itemIcon')
			details = ibmConfig.ibmShapeSizes.itemIcon;
		else // (shapeLayout === 'itemShape')
			details = ibmConfig.ibmShapeSizes.itemShape;

		details = Object.assign({}, details, ibmConfig.ibmShapeSizes.itemTrim);

		details['shapeWidth'] = details.defaultWidth;
		details['shapeHeight'] = details.defaultHeight;
	}

	if (shape) {
		// Add shape colors.		
		let colors = getColorDetails(shape, shapeType, shapeLayout);
		details['lineColor'] = colors.lineColor;
		details['fillColor'] = colors.fillColor;
		details['fontColor'] = colors.fontColor;
		details['badgeColor'] = colors.badgeColor;
		details['badgeFillColor'] = colors.badgeFillColor;
		details['badgeFontColor'] = colors.badgeFontColor;
		details['iconColor'] = colors.iconColor;
		details['iconAreaColor'] = colors.iconAreaColor;
		details['styleColor'] = colors.styleColor;

		// Add badge text	
		let badgeStyle = mxUtils.getValue(shape.state.style, mxIBMShapeBase.prototype.cst.BADGE, mxIBMShapeBase.prototype.cst.BADGE_DEFAULT);
		let badgeVisible = (badgeStyle != 'none') && (shapeLayout === 'collapsed' || shapeLayout.startsWith('expanded') || shapeLayout === 'itemBadge');
		details['badgeText'] = badgeVisible ? shape.state.cell.getAttribute('Badge-Text', null) : null;
		
	}

	return details;

	// Retrieve color settings.
	function getColorDetails (shape, shapeType, shapeLayout) {
		// Retrieve color settings.
		let lineColor = mxUtils.getValue(shape.state.style, mxIBMShapeBase.prototype.cst.LINE_COLOR, mxIBMShapeBase.prototype.cst.LINE_COLOR_DEFAULT);
		let fillColor = mxUtils.getValue(shape.state.style, mxIBMShapeBase.prototype.cst.FILL_COLOR, mxIBMShapeBase.prototype.cst.FILL_COLOR_DEFAULT);
		let fontColor = mxUtils.getValue(shape.state.style, mxIBMShapeBase.prototype.cst.FONT_COLOR, mxIBMShapeBase.prototype.cst.FONT_COLOR_DEFAULT);
		let badgeColor = mxUtils.getValue(shape.state.style, mxIBMShapeBase.prototype.cst.BADGE_COLOR, mxIBMShapeBase.prototype.cst.BADGE_COLOR_DEFAULT);
		let badgeFill = mxUtils.getValue(shape.state.style, mxIBMShapeBase.prototype.cst.BADGE_FILL, mxIBMShapeBase.prototype.cst.BADGE_FILL_DEFAULT);

		let badgeFillColor = badgeColor;
		let badgeFontColor = fontColor;
		let iconColor = ibmConfig.ibmColors.black;
		let iconAreaColor = (shapeType.startsWith('group') || shapeType === 'sub' || shapeType === 'zone') ? 'none' : lineColor;
		let styleColor = lineColor;

		// Set line color to black if not set otherwise use line color.
		lineColor = (lineColor === mxIBMShapeBase.prototype.cst.LINE_COLOR_DEFAULT) ? ibmConfig.ibmColors.black : rgb2hex(lineColor);

		// Set fill color to transparent if not set otherwise use fill color.
		fillColor = (fillColor === mxIBMShapeBase.prototype.cst.FILL_COLOR_DEFAULT) ? ibmConfig.ibmColors.none : rgb2hex(fillColor);

		// Set fill color to same as line color for legend color items.
		fillColor = (shapeLayout === 'itemColor') ? lineColor : fillColor;

		// Set icon area color to fill color for collapsed shapes.
		iconAreaColor = (shapeLayout === 'collapsed' && fillColor != mxIBMShapeBase.prototype.cst.FILL_COLOR_DEFAULT) ? fillColor : iconAreaColor;

		// Set icon area color to fill color for expanded target shapes.
		iconAreaColor = (shapeLayout === 'expanded' && shapeType === 'target' && fillColor != mxIBMShapeBase.prototype.cst.FILL_COLOR_DEFAULT) ? fillColor : iconAreaColor;

		// Set badge color to line color if not set otherwise use badge color.
		badgeColor = (badgeColor === mxIBMShapeBase.prototype.cst.BADGE_COLOR_DEFAULT) ? lineColor : rgb2hex(badgeColor);

		// Set badge fill color.
		if (badgeFill == 0)
			badgeFillColor = badgeColor;
		else if (badgeFill == 1)
			badgeFillColor = ibmConfig.ibmColors.white;
		else // badgeFill == 2
			badgeFillColor = getLightColor(badgeColor);

		// Normalize badge font color to be visible if badge fill color is too dark.
		badgeFontColor = normalizeElementColor(badgeFontColor, badgeFillColor);

		// Normalize icon color to be visible if icon area color is too dark.
		iconColor = normalizeElementColor(iconColor, iconAreaColor);

		// Set icon color to black for legend icon items.
		iconColor = (shapeLayout === 'itemIcon') ? ibmConfig.ibmColors.coolgray : iconColor;

		// Normalize style color to be visibile if icon area color is too dark.
		styleColor = normalizeElementColor(styleColor, iconAreaColor);

		// Set style color to black for expanded shapes and legend style items.
		styleColor = (shapeLayout.startsWith('expanded') || shapeLayout === 'itemStyle') ? lineColor : styleColor;

		return {
			'lineColor': lineColor,
			'fillColor': fillColor,
			'fontColor': fontColor,
			'badgeColor': badgeColor,
			'badgeFillColor': badgeFillColor,
			'badgeFontColor': badgeFontColor,
			'iconColor': iconColor,
			'iconAreaColor': iconAreaColor,
			'styleColor': styleColor
		};
	}

	// Normalize element color to be visible if background color is too dark.
	function normalizeElementColor(elementColor, backgroundColor) {
		if (backgroundColor === "none")
			return elementColor;
		else if (backgroundColor === ibmConfig.ibmColors.black)
			return ibmConfig.ibmColors.white;

		backgroundColor = backgroundColor.toUpperCase();
		let name = ibmConfig.colorNames[backgroundColor.substring(1)];
		if (!name) return name;
	
		let segments = name.split(' ');

		for (var index = 0; index < segments.length; index++) {
			code = parseInt(segments[index]);
			if (!isNaN(code) && code >= 50)
				return ibmConfig.ibmColors.white;
		}

		return elementColor;
	}
}

/**
 * Get base style called by event handler to revert shape back to base for drop-in images.
 * @param {*} cStyleStr
 * @param {*} pStyle
 * @param {*} cStyle
 * @returns 
 */
mxIBMShapeBase.prototype.getBaseStyle = function (cStyleStr, pStyle, cStyle) {	
	// if shape is image, change it to base shape
	if (cStyle && cStyle.shape === 'image') {		
		var tempStyle = Object.assign({}, pStyle);
		tempStyle.image = cStyle.image;
		cStyle = tempStyle;
		cStyleStr = getStylesStr(cStyle);
	}
	if (pStyle && pStyle.shape === 'image') {
		pStyle = cStyle;
	}

	return {cStyleStr, pStyle, cStyle}
};

/**
 * Get layout style called by event handler.
 * @param {*} cStyleStr
 * @param {*} pStyle
 * @param {*} cStyle
 * @returns 
 */
mxIBMShapeBase.prototype.getLayoutStyle = function (cStyleStr, pStyle, cStyle) {
	var shapeType = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.SHAPE_TYPE, mxIBMShapeBase.prototype.cst.SHAPE_TYPE_DEFAULT);
	var shapeLayout = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.SHAPE_LAYOUT,mxIBMShapeBase.prototype.cst.SHAPE_TYPE_LAYOUT);
	var hideIcon = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.HIDE_ICON, mxIBMShapeBase.prototype.cst.HIDE_ICON_DEFAULT);
	var rotateIcon = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.ROTATE_ICON, mxIBMShapeBase.prototype.cst.ROTATE_ICON_DEFAULT);
	var badge = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.ROTATE_ICON, mxIBMShapeBase.prototype.cst.ROTATE_ICON_DEFAULT);
	var fillColor = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.FILL_COLOR, mxIBMShapeBase.prototype.cst.FILL_COLOR_DEFAULT);
	var fontColor = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.FONT_COLOR, mxIBMShapeBase.prototype.cst.FONT_COLOR_DEFAULT);
	var fontSize = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.FONT_SIZE, mxIBMShapeBase.prototype.cst.FONT_SIZE_DEFAULT);
	var badge = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.BADGE, mxIBMShapeBase.prototype.cst.BADGE_DEFAULT);
	var image = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.IMAGE, mxIBMShapeBase.prototype.cst.IMAGE_DEFAULT);

	let primaryLabel = this.state.cell.getAttribute('Primary-Label', null);
	let secondaryText = this.state.cell.getAttribute('Secondary-Text', null);
	let iconName = this.state.cell.getAttribute('Icon-Name', null);

	// Change icon if switching between logical shape and prescribed shape.
	if (shapeType.isChanged && !image.current) {
		let newIconName = changeIcon(shapeType, iconName);
		if (newIconName)
			this.state.cell.setAttribute('Icon-Name', newIconName);
	}

	// Change label if switching between regular shape and item shape.
	if (shapeLayout.isChanged) {
		let newShapeLabel = changeLabel(shapeType, shapeLayout);
		if (newShapeLabel)
			this.state.cell.setAttribute('label', newShapeLabel);
	}

	// Get properties corresponding to layout change.
	var properties = getLayoutProperties(shapeType, shapeLayout, hideIcon, rotateIcon, fillColor, fontColor, fontSize, badge, image, primaryLabel, secondaryText);

	// Build styles object from styles string.
	var stylesObj = getStylesObj(properties);

	// Update styles string from styles object.
	cStyleStr = updateStylesStr(stylesObj, cStyleStr);

	return cStyleStr;
	
	// Get properties corresponding to layout change.
	// Properties are kept minimal by nulling out unused properties when changing layouts.
	// Invalid layout changes revert to original layout.
	// For the fill in nodes and components: 
	// 1. Regular icons default to line-colored icon area for collapsed shapes and expanded target
	//    system, and white fill for other expanded shapes. When changing between layouts revert to 
	//    layout default of none fill for collapsed shapes, default fill for non-target expanded shapes.
	// 2. Dropin images default to white icon area for collapsed shapes and expanded target system, 
	//    and will use the expanded fill for icon area on other expanded shapes.  When changing between
	//    collapsed and expanded shapes the same fill will be retained, except transparent on expanded
	//    will become white fill on collapsed.
	function getLayoutProperties(shapeType, shapeLayout, hideIcon, rotateIcon, fillColor, fontColor, fontSize, badge, image, primaryLabel, secondaryText) 
	{
		let properties = '';

		let changed = shapeType.isChanged || shapeLayout.isChanged || hideIcon.isChanged || rotateIcon.isChanged || image.isChanged;
		if (!changed)
			return properties;

		if (image.isChanged) {
			// Get fill property if image has changed depending on whether added or removed.
			if (image.current)	
				properties += ibmConfig.ibmSystemProperties.defaultFill;
			else if (shapeLayout.previous === 'collapsed' || (shapeLayout.previous === 'expanded' && shapeType.previous === 'target'))
				properties += ibmConfig.ibmSystemProperties.noFill;
			else
				properties += ibmConfig.ibmSystemProperties.defaultFill;

			return properties;
		}

		if (rotateIcon.isChanged) {
			// Prevent invalid icon rotation.
			if (rotateIcon.current === '0' || !['90', '180', '270'].includes(rotateIcon.current)) {
				properties += 'ibmRotation=null;';
			}

			return properties;
		}

		if (hideIcon.isChanged) {
			if (shapeType.current === 'target') {
				// Add expanded label properties depending on whether icon is visible.
				if (hideIcon.current === '1')
					properties += ibmConfig.ibmSystemProperties.expandedTargetLabelNoIcon;
				else
					properties += ibmConfig.ibmSystemProperties.expandedTargetLabel;
			}

			return properties;
		}

		if (shapeType.isChanged) {
			// Set layout to expanded if required by type change.
			if (['groupl', 'groupp', 'sub', 'zone'].includes(shapeType.current)) {
				if (shapeLayout.current != 'expanded') {
					properties += 'ibmLayout=expanded;';
					return properties;
				}
			}

			// Set layout to collapsed if required by type change.
			if (['actor'].includes(shapeType.current)) {
				if (shapeLayout.current != 'collapsed') {
					properties += 'ibmLayout=collapsed;';
					return properties;
				}
			}

			// Get dotted properties if changing between zone and non-zone shape.
			if (shapeType.previous !== 'zone' && shapeType.current === 'zone')
				properties += ibmConfig.ibmSystemProperties.styleDottedOn;
			else if (shapeType.previous === 'zone' && shapeType.current !== 'zone')
				properties += ibmConfig.ibmSystemProperties.styleDottedOff;

		}

		if (shapeType.isChanged || shapeLayout.isChanged)   {
			// Prevent invalid layout changes.
			if ((['groupl', 'groupp', 'sub', 'zone'].includes(shapeType.current) &&
			    (['collapsed', 'expandedStack'].includes(shapeLayout.current))) ||
			    (shapeType.current === 'actor' && shapeLayout.current.startsWith('expanded')) ||
			    (shapeType.current === 'target' && shapeLayout.current === 'expandedStack') ||
			    (shapeLayout.current === 'itemBadge' && badge.current === 'none')) {
				properties += 'ibmLayout=' + shapeLayout.previous + ';';
				return properties;
			}

			// Change font color and font size for changed item to non-item.
			properties += getFontProperties(shapeType, shapeLayout, fontColor, fontSize);

			// Get shape properties for changed layout.
			properties += getShapeProperties(shapeType, shapeLayout, hideIcon, image, primaryLabel, secondaryText);
		}

		return properties;
	}

	// Get shape properties for changed layout.
	function getShapeProperties(shapeType, shapeLayout, hideIcon, image, primaryLabel, secondaryText) { 
		let properties = '';

		if (shapeLayout.current === "collapsed") {
			// Add collapsed label properties, remove expanded stack properties, remove container properties.
			properties += ibmConfig.ibmSystemProperties.collapsedLabel + ibmConfig.ibmSystemProperties.expandedStackNull +
					ibmConfig.ibmSystemProperties.containerNull;

			// If image retain fill otherwise add no fill.
			if (!image.current && (shapeLayout.previous.startsWith('expanded') || shapeLayout.previous.startsWith('item'))) {
				properties += ibmConfig.ibmSystemProperties.noFill;
			}
		}
		else if (shapeLayout.current === "expanded") {
			if (shapeType.current === 'target') {
				// Add expanded label properties, remove container properties, remove expanded stack properties.
				if (hideIcon.current === '1')
					properties += ibmConfig.ibmSystemProperties.expandedTargetLabelNoIcon;
				else
					properties += ibmConfig.ibmSystemProperties.expandedTargetLabel;

				properties += ibmConfig.ibmSystemProperties.containerNull + ibmConfig.ibmSystemProperties.expandedStackNull;
			}
			else if (shapeType.current === 'sub') {
				// Add expanded label properties, remove container properties, remove expanded stack properties, add default fill.
				properties += ibmConfig.ibmSystemProperties.expandedLabel + ibmConfig.ibmSystemProperties.container +
						ibmConfig.ibmSystemProperties.expandedStackNull + ibmConfig.ibmSystemProperties.defaultFill;

				properties = properties.replace(/spacingTop=0/, "spacingTop=" + getLabelSpacing(primaryLabel, secondaryText));
			}
			else if (shapeType.current === 'zone') {
				// Add expanded label properties, remove container properties, remove expanded stack properties, remove fill.
				properties += ibmConfig.ibmSystemProperties.expandedLabel + ibmConfig.ibmSystemProperties.containerNull +
						ibmConfig.ibmSystemProperties.expandedStackNull + ibmConfig.ibmSystemProperties.noFill;

				properties = properties.replace(/spacingTop=0/, "spacingTop=" + getLabelSpacing(primaryLabel, secondaryText));
			}
			else {
				// Add expanded label properties, add container properties, remove expanded stack properties.
				properties += ibmConfig.ibmSystemProperties.expandedLabel + ibmConfig.ibmSystemProperties.container +
						ibmConfig.ibmSystemProperties.expandedStackNull;

				// If previous was zone or no image and collapsed or item then add default fill otherwise retain current fill.
				if (shapeType.previous === 'zone' || 
			    	    (!image.current && (shapeLayout.previous === 'collapsed' || shapeLayout.previous.startsWith('item')))) {
					properties += ibmConfig.ibmSystemProperties.defaultFill;
				}

				properties = properties.replace(/spacingTop=0/, "spacingTop=" + getLabelSpacing(primaryLabel, secondaryText));
			}
		}
		else if (shapeLayout.current === "expandedStack") {
			// Add expanded label properties, add expanded stack properties, add container properties.
			properties += ibmConfig.ibmSystemProperties.expandedLabel + ibmConfig.ibmSystemProperties.expandedStack +
				ibmConfig.ibmSystemProperties.container;

			// If image retain fill otherwise add default fill.
			if (!image.current && (shapeLayout.previous === 'collapsed' || shapeLayout.previous.startsWith('item'))) {
				properties += ibmConfig.ibmSystemProperties.defaultFill;
			}

			properties = properties.replace(/spacingTop=0/, "spacingTop=" + getLabelSpacing(primaryLabel, secondaryText));
		}
		else if (shapeLayout.current.startsWith('item')) {
			// Add item label properties, remove container properties, remove expanded stack properties, remove fill.
			properties += ibmConfig.ibmSystemProperties.itemLabel + ibmConfig.ibmSystemProperties.containerNull +
				ibmConfig.ibmSystemProperties.expandedStackNull + ibmConfig.ibmSystemProperties.noFill;
		}
		else {
			// Remove expanded stack properties, remove container properties, remove fill.
			properties += ibmConfig.ibmSystemProperties.expandedStackNull + ibmConfig.ibmSystemProperties.containerNull;

			// If image retain fill otherwise add no fill.
			if (!image.current) {
				properties += ibmConfig.ibmSystemProperties.noFill;
			}
		}

		return properties;
	}

	// Change font color and font size if switching between regular shape and item shape.
	function getFontProperties(shapeType, shapeLayout, fontColor, fontSize) {
		let properties = '';

		if (shapeLayout.current.startsWith('item') && !shapeLayout.previous.startsWith('item')) {
			if (fontColor.current != ibmConfig.ibmColors.coolgray)  
				properties += 'fontColor=' + ibmConfig.ibmColors.coolgray + ';';

			if (fontSize.current != 12)  
				properties += 'fontSize=12;';
		}	
		else if (shapeLayout.previous.startsWith('item') && !shapeLayout.current.startsWith('item')) {
			if (shapeLayout.current === 'expanded' && shapeType.current === 'target') {
				if (fontColor.current != ibmConfig.ibmColors.white)
					properties += 'fontColor=' + ibmConfig.ibmColors.white + ';';
			}
			else {
				if (fontColor.current != ibmConfig.ibmColors.black)
					properties += 'fontColor=' + ibmConfig.ibmColors.black + ';';
			}

			if (fontSize.current != 14)  
				properties += 'fontSize=14;';
		}

		return properties;
	}

	// Check that color is valid according to searchName.
	function validColor(colorValue, searchName) {
		var colorName = getColorName(colorValue);
		return colorName.indexOf(searchName) != -1;
	}

	// Change icon to iconl or iconp if available when switching between logical shape and prescribed shape.
	function changeIcon(shapeType, iconName)
	{
		ibmIcons = ibmIcons || flattenIcons();
		iconKey = 'icon' + shapeType.current.slice(-1);
		let icon = ibmIcons[iconName];
		if (icon.hasOwnProperty(iconKey)) {
			return icon[iconKey];
		}
		return null;
	}

	// Remove categories leaving only icons.
	// Delayed loading of icons until needed and loaded only once.
	function flattenIcons()
	{
		let sidebar = JSON.parse(mxUtils.load((new RegExp(/^.*\//)).exec(window.location.href)[0] + 'js/diagramly/sidebar/ibm/IBMIcons.json').getText());
		let icons = sidebar.Sidebars.Icons;
		let flatIcons = {};
		for (let categoryKey in icons) {
			let category = icons[categoryKey];
			for (let iconKey in category)
				flatIcons[iconKey] = category[iconKey];
		}
		return flatIcons;
	}

	// Change label if switching between regular shape and item shape.
	function changeLabel(shapeType, shapeLayout)
	{
		if (shapeLayout.current.startsWith('item') && !shapeLayout.previous.startsWith('item')) {
			return ibmConfig.ibmFonts.itemLabel;
		}	
		else if (shapeLayout.previous.startsWith('item') && !shapeLayout.current.startsWith('item')) {
			return ibmConfig.ibmFonts.shapeLabel;
		}
		else {
			return null;
		}
	}
};

/**
 * Get line style (dashed, double, strikethrough, multiplicity) called by event handler.
 * @param {*} cStyleStr
 * @param {*} pStyle
 * @param {*} cStyle
 * @returns 
 */
mxIBMShapeBase.prototype.getLineStyle = function (cStyleStr, pStyle, cStyle) {
	var shapeType = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.SHAPE_TYPE, mxIBMShapeBase.prototype.cst.SHAPE_TYPE_DEFAULT);
	var shapeLayout = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.SHAPE_LAYOUT,mxIBMShapeBase.prototype.cst.SHAPE_TYPE_LAYOUT);
	var styleDashed = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.STYLE_DASHED, mxIBMShapeBase.prototype.cst.STYLE_DASHED_DEFAULT);
	var styleDouble = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.STYLE_DOUBLE, mxIBMShapeBase.prototype.cst.STYLE_DOUBLE_DEFAULT);
	var styleStrikethrough = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.STYLE_STRIKETHROUGH, mxIBMShapeBase.prototype.cst.STYLE_STRIKETHROUGH_DEFAULT);
	var styleMultiplicity = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.STYLE_MULTIPLICITY, mxIBMShapeBase.prototype.cst.STYLE_MULTIPLICITY_DEFAULT);

	// Get properties corresponding to line style change.
	var properties = getLineProperties(styleDashed, styleDouble, styleStrikethrough, styleMultiplicity);

	// Build styles object from styles string.
	var stylesObj = getStylesObj(properties);

	// Update styles string from styles object.
	cStyleStr = updateStylesStr(stylesObj, cStyleStr);

	return cStyleStr;

	// Get properties for line style change ensuring only one of dashed, double, or strikethrough is set at time,
	// for example if user previously selected dashed and later selects double then dashed is auto-deselected.
	function getLineProperties(styleDashed, styleDouble, styleStrikethrough, styleMultiplicity) 
	{
		let properties = '';

		let changed = styleDashed.isChanged || styleDouble.isChanged || styleStrikethrough.isChanged || styleMultiplicity.isChanged;
		if (!changed)
			return properties;

		// Ensure styles are not applied to zones or subsystems.
		
		if (shapeType.current === 'sub' || shapeType.current === 'zone') {
			if (styleDashed.isChanged)
				properties += 'ibmDashed=null;';

			else if (styleDouble.isChanged)
				properties += 'ibmDouble=null;';

			else if (styleStrikethrough.isChanged)
				properties += 'ibmStrikethrough=null;';

			else if (styleMultiplicity.isChanged)
				properties += 'ibmMultiplicity=null;';

			return properties;
		}

		// Set properties to the desired change for dashed, double, or strikethrough.

		if (styleDashed.isChanged)
			properties = (styleDashed.current === '1') ? ibmConfig.ibmSystemProperties.styleDashedOn : ibmConfig.ibmSystemProperties.styleDashedOff;

		else if (styleDouble.isChanged)
			properties = (styleDouble.current === '1') ? ibmConfig.ibmSystemProperties.styleDoubleOn : ibmConfig.ibmSystemProperties.styleDoubleOff;

		else if (styleStrikethrough.isChanged)
			properties = (styleStrikethrough.current === '1') ? ibmConfig.ibmSystemProperties.styleStrikethroughOn : ibmConfig.ibmSystemProperties.styleStrikethroughOff;

		return properties;
	}
}

/**
 * Get color style called by event handler.
 * @param {*} cStyleStr
 * @param {*} pStyle
 * @param {*} cStyle
 * @returns 
 */
mxIBMShapeBase.prototype.getColorStyle = function (cStyleStr, pStyle, cStyle) {
	var shapeType = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.SHAPE_TYPE, mxIBMShapeBase.prototype.cst.SHAPE_TYPE_DEFAULT);
	var shapeLayout = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.SHAPE_LAYOUT, mxIBMShapeBase.prototype.cst.SHAPE_TYPE_LAYOUT);
	var container = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.CONTAINER, mxIBMShapeBase.prototype.cst.CONTAINER_DEFAULT);

	var lineColor = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.LINE_COLOR, mxIBMShapeBase.prototype.cst.LINE_COLOR_DEFAULT);
	var fillColor = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.FILL_COLOR, mxIBMShapeBase.prototype.cst.FILL_COLOR_DEFAULT);
	var fontColor = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.FONT_COLOR, mxIBMShapeBase.prototype.cst.FONT_COLOR_DEFAULT);
	var badgeColor = getStyleValues(pStyle, cStyle, mxIBMShapeBase.prototype.cst.BADGE_COLOR, mxIBMShapeBase.prototype.cst.BADGE_COLOR_DEFAULT);

	// Get properties corresponding to color change.
	var properties = getColorProperties(shapeType, shapeLayout, lineColor, fillColor, fontColor, badgeColor, container);

	// Build styles object from styles string.
	var stylesObj = getStylesObj(properties);

	// Update styles string from styles object.
	cStyleStr = updateStylesStr(stylesObj, cStyleStr);

	return cStyleStr;

	// Get properties for color change ensuring proper use of IBM Color Palette.
	function getColorProperties(shapeType, shapeLayout, lineColor, fillColor, fontColor, badgeColor, container) 
	{
		let properties = '';

		let changed = lineColor.isChanged || fillColor.isChanged || fontColor.isChanged || badgeColor.isChanged || shapeLayout.isChanged;
		if (!changed)
			return properties;

		if (lineColor.isChanged || fillColor.isChanged) {
			let colorReset = false;

			// If not valid line color and fill color combination then reset.
			if (!validColorCombination(lineColor, fillColor)) {	
				colorReset = true;

				if (!validColor(lineColor.previous, 'Line') || 
		    		    !validColor(fillColor.previous, 'Fill'))
					return defaultColorCombination(shapeType, shapeLayout, lineColor, fillColor, fontColor, ibmConfig.ibmColors.coolgray);

				if (lineColor.isChanged && !fillColor.isChanged && validColor(lineColor.current, 'Line'))
					return defaultColorCombination(shapeType, shapeLayout, lineColor, fillColor, fontColor, lineColor.current);

				if (lineColor.isChanged)
					properties += 'strokeColor=' + lineColor.previous + ';';

				if (fillColor.isChanged)
					properties += 'fillColor=' + fillColor.previous + ';';

				if (fontColor.isChanged)
					properties += 'fontColor=' + fontColor.previous + ';';
			}

			// If not valid font color then reset.
			if (fontColor.isChanged && !colorReset) {
				if (!validColor(fontColor.current, 'Font'))
					properties += 'fontColor=' + fontColor.previous + ';';
			}
		}

		// If not valid badge color then reset (future use).
		if (badgeColor.isChanged) {
			if (!validColor(badgeColor.current, 'Line'))
				properties += 'ibmBadgeColor=' + badgeColor.previous + ';';
		}

		// If shape layout changed then normalize font color for target system shape.
		if (shapeLayout.isChanged || fillColor.isChanged) {
			if (shapeType.current === 'target') {
				if (shapeLayout.current === 'collapsed')
					properties += 'fontColor=' + ibmConfig.ibmColors.black + ';';
				else if (shapeLayout.current.startsWith('expanded')) {
					if (validColor(fillColor.current, 'No Fill'))
						properties += 'fontColor=' + ibmConfig.ibmColors.white + ';';
					else
						properties += 'fontColor=' + ibmConfig.ibmColors.black + ';';
				}
			}
		}

		return properties;
	}

	// Check that color is valid according to searchName.
	function validColor(colorValue, searchName) {
		var colorName = getColorName(colorValue);
		return colorName.indexOf(searchName) != -1;
	}

	// Check that line color and fill color are from same family, or fill color is transparent or white, or black line with gray fill.
	function validColorCombination(lineColor, fillColor) {
		var lineColorName = getColorName(lineColor.current);
		var lineColorFamily = getColorFamily(lineColorName);
		var fillColorName = getColorName(fillColor.current);
		var fillColorFamily = getColorFamily(fillColorName);

		return (validColor(lineColor.current, 'Line') &&
			validColor(fillColor.current, 'Fill') &&
			(fillColorName.startsWith('Transparent') || fillColorName.startsWith('White') || 
			 fillColorFamily == lineColorFamily || (lineColorFamily === 'Black' && fillColorFamily.indexOf('Gray') !== -1)));
	}

	// Return default color combination for invalid previous colors.
	function defaultColorCombination(shapeType, shapeLayout, lineColor, fillColor, fontColor, newLineColor) {
		let properties = '';
		let defaultFill = false;

		var lineColorName = getColorName(lineColor.previous);
		var lineColorFamily = getColorFamily(lineColorName);
		var fillColorName = getColorName(fillColor.previous);
		var fillColorFamily = getColorFamily(fillColorName);

		if (lineColor.previous != newLineColor)
			properties += 'strokeColor=' + newLineColor + ';';

		// Set fill color.
		if (shapeLayout.current === 'collapsed' || (shapeLayout.current === 'expanded' && shapeType.current === 'target')) {
			if (fillColor.previous != ibmConfig.ibmColors.none) {
				properties += ibmConfig.ibmSystemProperties.noFill;
			}
		}
		else {
			if (fillColor.previous != ibmConfig.ibmColors.default &&
			    fillColor.previous != ibmConfig.ibmColors.white) {
				defaultFill = true;
				properties += ibmConfig.ibmSystemProperties.defaultFill;
			}
		}

		// Set font color.
		if (!defaultFill && shapeLayout.current === 'expanded' && shapeType.current === 'target') {
			if (fontColor.current != ibmConfig.ibmColors.white)
				properties += 'fontColor=' + ibmConfig.ibmColors.white + ';';
		}
		else {
			if (fontColor.current != ibmConfig.ibmColors.black)
				properties += 'fontColor=' + ibmConfig.ibmColors.black + ';';
		}

		return properties;
	}
}

// https://jgraph.github.io/mxgraph/docs/js-api/files/handler/mxVertexHandler-js.html#mxVertexHandler.union
var vertexHandlerUnion = mxVertexHandler.prototype.union;
mxVertexHandler.prototype.union = function (bounds, dx, dy, index, gridEnabled, scale, tr, constrained) {
	let rect = vertexHandlerUnion.apply(this, arguments);
	if (this.state.style['shape'] === mxIBMShapeBase.prototype.cst.SHAPE) {
		rect = mxIBMShapeBase.prototype.getNewGeometryRect(this.state.style, rect, true);
	}	
	return rect;
};

//**********************************************************************************************************************************************************
// Legends
//**********************************************************************************************************************************************************

function mxIBMShapeLegend(bounds, fill, stroke, strokewidth) {
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

mxUtils.extend(mxIBMShapeLegend, mxShape);

mxIBMShapeLegend.prototype.cst = ibmConfig.ibmLegendConstants;

mxIBMShapeLegend.prototype.customProperties = ibmConfig.ibmLegendProperties;

mxIBMShapeLegend.prototype.init = function (container) {
	if (this.node == null) {
		this.node = this.create(container);
		if (container != null) {
			container.appendChild(this.node);
		}
		// Define custom event handler
		this.customEventsHandler = mxUtils.bind(this, function (sender, event) {
			if (event.properties.change && event.properties.change.cell && event.properties.change.cell.id === this.state.cell.id) {
				if ("mxStyleChange" === event.properties.change.constructor.name) {
					this.styleChangedEventsHandler(this.state.view.graph, event);
				}
				if ("mxGeometryChange" === event.properties.change.constructor.name) {
					var cell = event.properties.change.cell;
					var graph = this.state.view.graph;
					var cStyle = getStylesObj(cell.style);
					var geometry = cell.getGeometry();
					var geometryRect = this.getNewGeometryRect(graph, cell, cStyle, new mxRectangle(geometry.x, geometry.y, geometry.width, geometry.height));
					geometry.height = geometryRect.height;
					geometry.width = geometryRect.width;
					graph.model.setGeometry(cell, geometry);
				}
			}
		})
		this.state.view.graph.model.addListener('executed', this.customEventsHandler);
	}
}

mxIBMShapeLegend.prototype.styleChangedEventsHandler = function (graph, event) {		
	var cell = event.properties.change.cell;
	var cStyle = getStylesObj(event.properties.change.style);

	var changes = {};
	changes.style = this.getNewStyles(cStyle);

	var geometry = cell.getGeometry();
	var geometryRect = this.getNewGeometryRect(graph, cell, cStyle, new mxRectangle(geometry.x, geometry.y, geometry.width, geometry.height));
	geometry.height = geometryRect.height;
	geometry.width = geometryRect.width;
	changes.geometry = geometry;

	graph.model.beginUpdate();
	try {
		graph.model.setStyle(cell, changes.style);
		graph.model.setGeometry(cell, changes.geometry);
	} finally {
		graph.model.endUpdate();
	}
}

mxIBMShapeLegend.prototype.paintVertexShape = function (c, x, y, w, h) {
	var properties = this.getProperties(this.state.style);
	c.setFillColor(properties.fillColor);
	c.setStrokeColor(properties.strokeColor);
	c.rect(x, y, w, h);
	c.fillAndStroke();
}

mxIBMShapeLegend.prototype.getProperties = function (style) {
	var properties = {}
	properties = ibmConfig.ibmShapeSizes.legend;
	properties.shapeType = mxUtils.getValue(style, this.cst.SHAPE_TYPE, this.cst.SHAPE_TYPE_DEFAULT);
	properties.fillColor = mxUtils.getValue(style, this.cst.FILL_COLOR, this.cst.FILL_COLOR_DEFAULT);
	properties.strokeColor = mxUtils.getValue(style, this.cst.LINE_COLOR, this.cst.LINE_COLOR_DEFAULT);
	properties.fontColor = mxUtils.getValue(style, this.cst.FONT_COLOR, this.cst.FONT_COLOR_DEFAULT);
	properties.ibmNoHeader = mxUtils.getValue(style, this.cst.HIDE_HEADER, this.cst.HIDE_HEADER_DEFAULT);
	return properties;
}

mxIBMShapeLegend.prototype.getCellStyles = function (shapeType, ibmNoHeader) {
	let properties = '';
	
	if (shapeType === "legendh") {
		if (ibmNoHeader == 1) {
			properties = ibmConfig.ibmSystemProperties.legendStack + ibmConfig.ibmSystemProperties.legendhStackNoHeader;
		} else {
			properties = ibmConfig.ibmSystemProperties.legendStack + ibmConfig.ibmSystemProperties.legendhStack;
		}
	} else if (shapeType === "legendv") {
		if (ibmNoHeader == 1) {
			properties = ibmConfig.ibmSystemProperties.legendStack + ibmConfig.ibmSystemProperties.legendvStackNoHeader;
		} else {
			properties = ibmConfig.ibmSystemProperties.legendStack + ibmConfig.ibmSystemProperties.legendvStack;
		}
	}

	return getStylesObj(properties);
}

/**
 * get new style of mxIBMShapeLegend
 * @param {*} style 
 */
mxIBMShapeLegend.prototype.getNewStyles = function (style) {
	var shapeType = mxUtils.getValue(style, this.cst.SHAPE_TYPE, this.cst.SHAPE_TYPE_DEFAULT);
	var cNoHeader = mxUtils.getValue(style, this.cst.HIDE_HEADER, this.cst.HIDE_HEADER_DEFAULT);

	var cellStyles = this.getCellStyles(shapeType, cNoHeader);
	for (let key in cellStyles) {
		style[key] = cellStyles[key];
	}
	return getStylesStr(style);
}

/**
 * get new size of mxIBMShapeLegend
 * @param {*} style 
 * @param {*} rect 
 * @returns 
 */
mxIBMShapeLegend.prototype.getNewGeometryRect = function (graph, cell, style, rect) {
	// Get child's geometry	
	var childWidth = 0;
	var childHeight = 0;
	var childMinWidth = 64;
	var childMinHeight = 16;
	var cells = graph.getChildCells(cell, true, false);
	if (cells.length > 0) {
		for (var i = 0; i < cells.length; i++) {
			var tmpGeometry = cells[i].getGeometry();
			childWidth = Math.max(tmpGeometry.width, childWidth, childMinWidth);
			childHeight = Math.max(tmpGeometry.height, childHeight, childMinHeight);
		}
		for (var i = 0; i < cells.length; i++) {
			var tmpGeometry = cells[i].getGeometry();
			tmpGeometry.width = childWidth;
			tmpGeometry.height = childHeight;
			graph.model.setGeometry(cells[i], tmpGeometry);
		}
	}
	// Get parent's geometry	
	var properties = this.getProperties(style);	
	if (properties.shapeType == 'legendh') {
		rect.width = style.marginLeft * 1 + (childWidth + style.marginRight * 1 ) * cells.length;
		rect.height = style.marginTop * 1 + childHeight + style.marginBottom * 1;
	} else {
		rect.width = style.marginLeft * 1 + childWidth + style.marginRight * 1;
		rect.height = style.marginTop * 1 + (childHeight + style.marginBottom * 1) * cells.length;
	}
	rect.width = Math.max(rect.width, properties.minWidth);
	rect.height = Math.max(rect.height, properties.minHeight);
	
	return rect;
}

mxIBMShapeLegend.prototype.getLabelBounds = function (rect) {
	const legendPadding = 8;
	const legendTitleHeight = 16;
	return new mxRectangle(rect.x + legendPadding * this.scale, rect.y + legendPadding * this.scale, rect.width - (2 * legendPadding * this.scale), legendTitleHeight * this.scale);
};

//**********************************************************************************************************************************************************
// Deployment Units
//**********************************************************************************************************************************************************

function mxIBMShapeUnit(bounds, fill, stroke, strokewidth) {
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

mxUtils.extend(mxIBMShapeUnit, mxShape);

mxIBMShapeUnit.prototype.cst = ibmConfig.ibmUnitConstants;

mxIBMShapeUnit.prototype.customProperties = ibmConfig.ibmUnitProperties;

mxIBMShapeUnit.prototype.paintVertexShape = function (c, x, y, w, h) {
	var properties = this.getProperties();
	
	c.translate(x, y);

	// draw container
	c.setFillColor(properties.fillColor);
	c.setStrokeColor('none');
	c.rect(0, 0, w, h);
	c.fillAndStroke();

	// draw stencil
	this.drawStencil(c, properties);
}

mxIBMShapeUnit.prototype.getProperties = function () {
	var properties = {}
	properties = ibmConfig.ibmShapeSizes.unit;
	properties.shapeType = mxUtils.getValue(this.state.style, this.cst.SHAPE_TYPE, this.cst.SHAPE_TYPE_DEFAULT);
	properties.fillColor = mxUtils.getValue(this.state.style, this.cst.FILL_COLOR, this.cst.FILL_COLOR_DEFAULT);
	properties.fontColor = mxUtils.getValue(this.state.style, this.cst.FONT_COLOR, this.cst.FONT_COLOR_DEFAULT);
	// properties.strokeColor = mxUtils.getValue(this.state.style, this.cst.LINE_COLOR, this.cst.LINE_COLOR_DEFAULT);
	return properties;
}

/**
 * Draw stencil
 * @param {*} c 
 * @param {*} properties 
 */
 mxIBMShapeUnit.prototype.drawStencil = function (c, properties) {
	var prIcon = "";
	switch (properties.shapeType) {
		case "unite": prIcon = "execution"; break;
		case "uniti": prIcon = "installation"; break;
		case "unitp": prIcon = "presentation"; break;
		case "unittd": prIcon = "technical--data"; break;
		case "unitte": prIcon = "technical--execution"; break;
		case "unitti": prIcon = "technical--installation"; break;
		case "unittp": prIcon = "technical--presentation"; break;
		case "unitd": prIcon = "data"; break;
		default: prIcon = "data";
	}
	var prStencil = mxStencilRegistry.getStencil('mxgraph.ibmicons.deployment-unit--' + prIcon);
	if (prStencil == null) {
		prStencil = mxStencilRegistry.getStencil('mxgraph.ibmicons.undefined');
	}
	c.setFillColor(properties.fontColor);
	c.setStrokeColor('none');
	c.setDashed(false);
	c.strokewidth = 1;
	prStencil.drawShape(c, this, properties.iconAlign, properties.iconAlign, properties.iconSize, properties.iconSize);	
}

mxIBMShapeUnit.prototype.getLabelBounds = function (rect) {
	var properties = this.getProperties();
	var offSet = properties.labelAlign;
	return new mxRectangle(rect.x + offSet * this.scale, rect.y, rect.width - properties.labelAlign * this.scale, properties.labelHeight * this.scale);
};

mxCellRenderer.registerShape(mxIBMShapeBase.prototype.cst.SHAPE, mxIBMShapeBase);
mxCellRenderer.registerShape(mxIBMShapeLegend.prototype.cst.SHAPE, mxIBMShapeLegend);
mxCellRenderer.registerShape(mxIBMShapeUnit.prototype.cst.SHAPE, mxIBMShapeUnit);

//**********************************************************************************************************************************************************
// Common Functions
//**********************************************************************************************************************************************************

// Convert string to styles substituting 'null' in strings for null value.
function getStylesObj(stylesStr) {
	var styles = {};
	// Remove trailing semicolon.
	if(stylesStr && stylesStr.endsWith(';')) {
		stylesStr = stylesStr.slice(0, -1);
	}
	let array = stylesStr.split(';');
	for (var index = 0; index < array.length; index++) {
		element = array[index].split('=');
		if (element[1] === 'null')
			styles[element[0]] = null;
		else
			styles[element[0]] = element[1];
	}
	return styles;
}

// Convert styles to string.
function getStylesStr(stylesObj) {
	var stylesStr = '';
	for (var key in stylesObj) {
		stylesStr += key + '=' + stylesObj[key] + ';'
	}
	return stylesStr;
} 

// Convert styles to string and update existing styles string.
function updateStylesStr(stylesObj, stylesStr) {
	for (let key in stylesObj)
		stylesStr = mxUtils.setStyle(stylesStr, key, stylesObj[key]);

	return stylesStr;
}

// Build object for current and previous values.
function getStyleValues (pStyle, cStyle, key, keyDefault) {
	var current = mxUtils.getValue(cStyle, key, keyDefault);
	var previous = mxUtils.getValue(pStyle, key, keyDefault);
	return { current, previous, isChanged: current !== previous };
}


// Calculate label spacing from number of lines in primary label and secondary text.
function getLabelSpacing(primaryLabel, secondaryText)
{
	let lines = (primaryLabel ? 1 : 0) + (secondaryText ? 1 : 0)
		
	if (primaryLabel) {
		lines += (primaryLabel.match(/\r|\n|<br>/gi) || []).length;
	}
	if (secondaryText) {
		lines += (secondaryText.match(/\r|\n|<br>/gi) || []).length;
	}

	return lines > 2 ? (lines * (lines + (lines-2))) : 0;
}

// Get name of color from rbg/hex value.
function getColorName(color) {
	var colorHex = rgb2hex(color);
	var colorUpper = colorHex.toUpperCase();
	var colorName = ibmConfig.colorNames[colorUpper === "NONE" ? "NONE" : colorUpper.substring(1)];
	//if it's undefined, give the default value
	if (!colorName) {		
		colorName = ibmConfig.colorNames['FFFFFF']; 
	}
	return colorName;
}

function getColorFamily(colorName) {
	var colorSegments = colorName.split(' ');
	var colorFamily = colorSegments[1] === "Gray" ? colorSegments[0] + " " + colorSegments[1] : colorSegments[0];
	return colorFamily;
}

function getLightColor(color) {
	var colorName = getColorName(color);
	var lightColorName = getColorFamily(colorName) + " 10";
	var colorNames = ibmConfig.colorNames;
	for (let hex in colorNames) {
		let colorName = colorNames[hex];
		if (colorName.startsWith(lightColorName)) {
			return '#' + hex.toLowerCase();
		}
	}
	return '#ffffff';
}

// Convert RGB values to hex values.
function rgb2hex(color) {
	if (color.toUpperCase().startsWith('RGB')) {
		let rgb = color.split(',');
		let r = parseInt(rgb[0].substring(4));
		let g = parseInt(rgb[1]);
		let b = parseInt(rgb[2]);
		var rhex = Number(r).toString(16)
		rhex = (rhex.length < 2) ? "0" + rhex : rhex;
		var ghex = Number(r).toString(16)
		ghex = (ghex.length < 2) ? "0" + ghex : ghex;
		var bhex = Number(r).toString(16)
		bhex = (bhex.length < 2) ? "0" + bhex : bhex;
		return "#" + rhex.toString() + ghex.toString() + bhex.toString();
	}
	else if (color.toUpperCase() === 'DEFAULT')
		return ibmConfig.ibmColors.white;
	else
		return color;
}

})();
