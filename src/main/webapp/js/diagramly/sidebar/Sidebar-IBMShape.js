/**
 * $Id: Sidebar-IBMShape.js,v 1.0 2022/06/01 17:00:00 mate Exp $
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
	let ibmConfig;
	let ibmLanguage = (new URLSearchParams(window.location.search)).get('lang') || 'en';

	Sidebar.prototype.createIBMPalette = function(sidebarID, sidebarFile) 
	{
		let jsonURL = (new RegExp(/^.*\//)).exec(window.location.href)[0] + 'js/diagramly/sidebar/ibm/' + sidebarFile;
		let jsonText = `{"id": "${sidebarID}", "name": "IBM" , "url": "${jsonURL}" }`;
		this.GenerateIBMShapePalette([JSON.parse(jsonText)]);
	}

	Sidebar.prototype.addIBMShapePalette = function() 
	{
		ibmConfig = ibmConfig || 
			JSON.parse(mxUtils.load((new RegExp(/^.*\//)).exec(window.location.href)[0] + 'js/diagramly/sidebar/ibm/IBMConfig.json').getText());
		
		this.createIBMPalette('ibmshape', 'IBMIcons.json'); 
		this.createIBMPalette('ibmshape', 'IBMShapes.json');
		this.createIBMPalette('ibmshape', 'IBMCloud.json'); 
		this.createIBMPalette('ibmshape', 'IBMCore.json'); 
		this.createIBMPalette('ibmshape', 'IBMHelpers.json');
		this.createIBMPalette('ibmshape', 'IBMStarters.json'); 
	}

	Sidebar.prototype.addIBMShapeEditorExtensions = function()
	{
		if (Editor.config != null && Editor.config[ibmConfig.ibmBaseConstants.SHAPE])
		{
			let iconStencilLibraries = Editor.config[ibmConfig.ibmBaseConstants.SHAPE].icon_stencil_libraries;
			for (stencilLibrary in iconStencilLibraries) {
				mxStencilRegistry.loadStencilSet(iconStencilLibraries[stencilLibrary]);
			}

			let sideBars = Editor.config[ibmConfig.ibmBaseConstants.SHAPE].sidebars;
			
			return {
				IconStencils: iconStencilLibraries,
				Sidebars: sideBars
			};
		}
	}

	Sidebar.prototype.GenerateIBMShapePalette = function(sidebarConfigFileURLs)
	{
		let shapesEditorExtensions = Sidebar.prototype.addIBMShapeEditorExtensions() || [];

		sidebarConfigFileURLs = sidebarConfigFileURLs || [];

		if (shapesEditorExtensions.Sidebars != null)
		{
			for(let sidebarExtension in shapesEditorExtensions.Sidebars)
			{
				sidebarConfigFileURLs.push(shapesEditorExtensions.Sidebars[sidebarExtension]);
			}	
		}

		const dt = 'ibm shape ';

		for(let filenameIndex in sidebarConfigFileURLs)
		{
			let filename = sidebarConfigFileURLs[filenameIndex].url;
			let sidebarID = sidebarConfigFileURLs[filenameIndex].id;
			let sidebarMainName = sidebarConfigFileURLs[filenameIndex].name;

			try
			{
				let sidebarFileText = mxUtils.load(filename).getText();
				let sidebarConfigs = JSON.parse(sidebarFileText);
				let sidebarVariables = sidebarConfigs.Variables;
				
				for(let sidebarKey in sidebarConfigs.Sidebars)
				{
					let sidebar = sidebarConfigs.Sidebars[sidebarKey]; 
					let sbEntries = [];
		
					for (let section in sidebar)
					{
						for(let shapeKey in sidebar[section])
						{
							let shape = sidebar[section][shapeKey];
		
							for(let prop in shape)
							{
								if (sidebarVariables[prop])
								{
									for(let newProp in sidebarVariables[prop])
									{
										shape[newProp] = sidebarVariables[prop][newProp]; 
									}
								}
							}
		
							for(let prop in shape)
							{
								if (typeof(shape[prop]) === 'string' && sidebarVariables[shape[prop]])
									shape[prop] = sidebarVariables[shape[prop]]; 
							}
						}
		
						if (section != '*')
							sbEntries.push(this.addEntry(dt + section.toLowerCase(), this.createSection(section)));
			
						let shapes = sidebar[section];
			
						for (let shapeName in shapes) {
							let shape = shapes[shapeName];
							if (shape.ignore) continue;

							sbEntries.push(this.addEntry(dt + shapeName.toLowerCase(), function() {
								const shape = shapes[shapeName];

			                                        shapeName = shapeName.substring(shapeName.indexOf("=")+1);

								var bg = Sidebar.prototype.addIBMShapeVertexTemplateFactory(shapeName, shape);

								if (shape.members != null)
									addIBMShapePaletteMembers(shapeName, shape, shapes, bg);

								let showLabel = (shape.format.type.startsWith('legend') || 
										 (!shape.format.type.startsWith('unit') && 
											 shape.format.layout != 'itemShape' && 
											 shape.format.layout.startsWith('expanded')));
								
								return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, shapeName, showLabel);
							}));
						}
					}
			
					const sidebarFullName = sidebarMainName + " " + sidebarKey;
					this.setCurrentSearchEntryLibrary(sidebarID, sidebarID + sidebarKey);
					this.addPaletteFunctions(sidebarID + sidebarKey, sidebarFullName, false, sbEntries);
				}
			}
			catch (exception){
				console.log(exception);
			}
		}
		this.setCurrentSearchEntryLibrary();
		return;

		function addIBMShapePaletteMembers(shapeName, shape, shapes, bg)
		{
			let maxName = shapeName.length;
			let memberList = shape.members;
			for (var index = 0; index < memberList.length; index++)
			{
				let memberName = memberList[index];
				let memberShape = shapes[memberName];

				var bgmember = Sidebar.prototype.addIBMShapeVertexTemplateFactory(memberName, memberShape);

				if (memberShape.members != null)
					addIBMShapePaletteMembers(memberName, memberShape, shapes, bgmember);

				bg.insert(bgmember);

				if (memberShape.geometry != null)
				{
					bgmember.geometry.x = memberShape.geometry[0];
					bgmember.geometry.y = memberShape.geometry[1];
					bgmember.geometry.width = memberShape.geometry[2];
					bgmember.geometry.height = memberShape.geometry[3];
				}
				else if (memberName.length > maxName)
					maxName = memberName.length;
			}

			if (shape.geometry != null)
			{
				bg.geometry.x = shape.geometry[0];
				bg.geometry.y = shape.geometry[1];
				bg.geometry.width = shape.geometry[2];
				bg.geometry.height = shape.geometry[3];
			}
			else
				bg.geometry.width = bg.geometry.width + (maxName * 2);
		}
	};

	Sidebar.prototype.addIBMShapeVertexTemplateFactory = function(name, data)
	{
		let text = data.text ? data.text : name;
		let subText = data.subtext ? data.subtext : "";
		let iconName = data.icon ? data.icon : "undefined";
		let noIcon = !data.icon;

		let shapeType = data.format.type;
		let shapeLayout = data.format.layout;
		let shapeWeight = data.format.weight;
		let shapeContainer = data.format.container;
		let noShapeHeader = !data.format.header;

		let shapeLine = data.color.line;
		let shapeFill = data.color.fill;
		let shapeFont = data.color.font;

		let badgeForm = data.badge.form;
		let badgeLine = data.badge.line;
		let badgeText = data.badge.text ? data.badge.text : "";;

		let styleDashed = data.style.dashed;
		let styleDouble = data.style.double;
		let styleStrikethrough = data.style.strikethrough;
		let styleMultiplicity = data.style.multiplicity;

		let headProperties = '';
		let coreProperties = '';
		let systemProperties = '';
		let fontProperties = ''; 

		let shapeWidth = 0;
		let shapeHeight = 0;

		if (shapeType.startsWith('legend'))
			headProperties += 'shape=' + ibmConfig.ibmLegendConstants.SHAPE + ';ibmType=' + shapeType + ';';
		else if (shapeType.startsWith('unit'))
			headProperties += 'shape=' + ibmConfig.ibmUnitConstants.SHAPE + ';ibmType=' + shapeType + ';';
		else
			headProperties += 'shape=' + ibmConfig.ibmBaseConstants.SHAPE + ';ibmType=' + shapeType + ';ibmLayout=' + shapeLayout + ';';

		if (shapeLine)
			headProperties += "strokeColor=" + ibmConfig.ibmColors[shapeLine] + ';';

		if (shapeFill)
			headProperties += "fillColor=" + ibmConfig.ibmColors[shapeFill] +';';
		else if (shapeContainer)
			headProperties += ibmConfig.ibmSystemProperties.defaultFill;
		else
			headProperties += ibmConfig.ibmSystemProperties.noFill;

		if (shapeFont)
			headProperties += "fontColor=" + ibmConfig.ibmColors[shapeFont] + ';';

		if (shapeWeight)
			headProperties += "strokeWidth=" + shapeWeight + ';';

		if (badgeForm)
			coreProperties += "ibmBadge=" + badgeForm + ';';

		if (badgeLine)
			coreProperties += "ibmBadgeColor=" + ibmConfig.ibmColors[badgeLine] + ';';

		if (noIcon && !shapeType.startsWith('unit'))
			coreProperties += "ibmNoIcon=1;";

		if (noShapeHeader)
			coreProperties += "ibmNoHeader=1;";

		if (styleDashed)
			coreProperties += "ibmDashed=1;";

		if (styleDouble)
			coreProperties += "ibmDouble=1;";

		if (styleStrikethrough)
			coreProperties += "ibmStrikethrough=1;";

		if (styleMultiplicity)
			coreProperties += "ibmMultiplicity=1;";

		if (shapeType.startsWith('legend')) {
			shapeWidth = ibmConfig.ibmShapeSizes.legend.defaultWidth;
			shapeHeight = ibmConfig.ibmShapeSizes.legend.defaultHeight;

			if (noShapeHeader)
				systemProperties += ibmConfig.ibmSystemProperties.legendStack + ibmConfig.ibmSystemProperties[shapeType + "StackNoHeader"];
			else
				systemProperties += ibmConfig.ibmSystemProperties.legendStack + ibmConfig.ibmSystemProperties[shapeType + "Stack"] +
							ibmConfig.ibmSystemProperties.legendLabel;

			fontProperties = ibmConfig.ibmFonts.largeFont;

			if (shapeContainer)
				systemProperties += ibmConfig.ibmSystemProperties.container;
		}
		else if (shapeType.startsWith('unit')) {
			shapeWidth = ibmConfig.ibmShapeSizes.unit.defaultWidth;
			shapeHeight = ibmConfig.ibmShapeSizes.unit.defaultHeight;

			fontProperties = ibmConfig.ibmFonts.largeFont;
			systemProperties += ibmConfig.ibmSystemProperties.unitLabel;
		}
		else {  // base
			coreProperties += ibmConfig.ibmSystemProperties.noImage;

			if (shapeLayout === 'collapsed') {
				if (shapeType === 'target') {
					shapeWidth = ibmConfig.ibmShapeSizes.collapsedTarget.defaultWidth;
					shapeHeight = ibmConfig.ibmShapeSizes.collapsedTarget.defaultHeight;
				}
				else if (shapeType === 'actor') {
					shapeWidth = ibmConfig.ibmShapeSizes.collapsedActor.defaultWidth;
					shapeHeight = ibmConfig.ibmShapeSizes.collapsedActor.defaultHeight;
				}
				else {
					shapeWidth = ibmConfig.ibmShapeSizes.collapsed.defaultWidth;
					shapeHeight = ibmConfig.ibmShapeSizes.collapsed.defaultHeight;
				}

				fontProperties = ibmConfig.ibmFonts.largeFont;
				systemProperties += ibmConfig.ibmSystemProperties.collapsedLabel;
			}
			else if (shapeLayout.startsWith('expanded')) {
				if (shapeType === 'target') {
					shapeWidth = ibmConfig.ibmShapeSizes.expandedTarget.defaultWidth;
					shapeHeight = ibmConfig.ibmShapeSizes.expandedTarget.defaultHeight;
				}
				else if (shapeType.startsWith('group') || shapeType === 'sub' || shapeType === 'zone') {
					shapeWidth = ibmConfig.ibmShapeSizes.group.defaultWidth;
					shapeHeight = ibmConfig.ibmShapeSizes.group.defaultHeight;
				}
				else {
					shapeWidth = ibmConfig.ibmShapeSizes.expanded.defaultWidth;
					shapeHeight = ibmConfig.ibmShapeSizes.expanded.defaultHeight;
				}

				fontProperties = ibmConfig.ibmFonts.largeFont;
				systemProperties += ibmConfig.ibmSystemProperties.expandedLabel;

				if (shapeLayout === 'expandedStack')
					systemProperties += ibmConfig.ibmSystemProperties.expandedStack;

				if (shapeContainer)
					systemProperties += ibmConfig.ibmSystemProperties.container;

			}
			else { // item
				if (shapeLayout === 'itemBadge') {
					shapeWidth = ibmConfig.ibmShapeSizes.itemBadge.defaultWidth;
					shapeHeight = ibmConfig.ibmShapeSizes.itemBadge.defaultHeight;
				}
				else if (shapeLayout === 'itemColor') {
					shapeWidth = ibmConfig.ibmShapeSizes.itemColor.defaultWidth;
					shapeHeight = ibmConfig.ibmShapeSizes.itemColor.defaultHeight;
				}
				else if (shapeLayout === 'itemStyle') {
					shapeWidth = ibmConfig.ibmShapeSizes.itemStyle.defaultWidth;
					shapeHeight = ibmConfig.ibmShapeSizes.itemStyle.defaultHeight;
				}
				else if (shapeLayout === 'itemIcon' && shapeType === 'target') {
					shapeWidth = ibmConfig.ibmShapeSizes.itemTarget.defaultWidth;
					shapeHeight = ibmConfig.ibmShapeSizes.itemTarget.defaultHeight;
				}
				else if (shapeLayout === 'itemIcon' && shapeType === 'actor') {
					shapeWidth = ibmConfig.ibmShapeSizes.itemActor.defaultWidth;
					shapeHeight = ibmConfig.ibmShapeSizes.itemActor.defaultHeight;
				}
				else if (shapeLayout === 'itemIcon') {
					shapeWidth = ibmConfig.ibmShapeSizes.itemIcon.defaultWidth;
					shapeHeight = ibmConfig.ibmShapeSizes.itemIcon.defaultHeight;
				}
				else { // itemShape
					shapeWidth = ibmConfig.ibmShapeSizes.itemShape.defaultWidth;
					shapeHeight = ibmConfig.ibmShapeSizes.itemShape.defaultHeight;
				}

				fontProperties = ibmConfig.ibmFonts.smallFont;
				systemProperties += ibmConfig.ibmSystemProperties.itemLabel;
			}
		}

		headProperties += ibmConfig.ibmSystemProperties.basic + 
					fontProperties.replace(/FONTFAMILY/g, ibmConfig.ibmFonts[ibmLanguage]);

		var bg = new mxCell('', new mxGeometry(0, 0, shapeWidth, shapeHeight), headProperties + coreProperties + systemProperties);
		bg.vertex = true;

		bg.setValue(mxUtils.createXmlDocument().createElement('UserObject'));
		bg.setAttribute('placeholders', '1');
		if (shapeType.startsWith('legend')) {
			let label = ibmConfig.ibmFonts.legendLabel;
			bg.setAttribute('label', label);
			bg.setAttribute('Legend-Title', text);
		}
		else if (shapeType.startsWith('unit')) {
			let label = ibmConfig.ibmFonts.unitLabel;
			bg.setAttribute('label', label);
			bg.setAttribute('Primary-Label', text);
		}
		else if (shapeLayout.startsWith('item')) {
			let label = ibmConfig.ibmFonts.itemLabel;
			bg.setAttribute('label', label);
			bg.setAttribute('Icon-Name', iconName);
			bg.setAttribute('Primary-Label', text);
			bg.setAttribute('Secondary-Text', subText);
		}
		else {
			let label = ibmConfig.ibmFonts.shapeLabel;
			bg.setAttribute('label', label);
			bg.setAttribute('Badge-Text', badgeText);
			bg.setAttribute('Icon-Name', iconName);
			bg.setAttribute('Primary-Label', text);
			bg.setAttribute('Secondary-Text', subText);
		}
		
		return bg;
	}
})();
