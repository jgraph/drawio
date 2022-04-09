function MiroImporter()
{
    var stencilsMap = {

    };

    var typeStylesMap = {

    };

    function colorNum2Hex(color)
    {
        return  color == -1 ? 'none' : 
                '#' + ('0' + (color >> 16).toString(16)).slice(-2) +
                ('0' + ((color >> 8) & 0xFF).toString(16)).slice(-2) +
                ('0' + (color & 0xFF).toString(16)).slice(-2);
    };

    fontNameMap = {
        0: 'Arial',
        2: 'Abril Fatface',
        3: 'Bangers',
        4: 'EB Garamond',
        5: 'Georgia',
        6: 'Graduate',
        7: 'Gravitas One',
        8: 'Fredoka One',
        9: 'Nixie One',
        10: 'OpenSans',
        11: 'Permanent Marker',
        12: 'PT Sans',
        13: 'PT Sans Narrow',
        14: 'PT Serif',
        15: 'Rammetto One',
        16: 'Roboto',
        17: 'Roboto Condensed',
        18: 'Roboto Slab',
        19: 'Caveat',
        20: 'Times New Roman',
        21: 'Titan One',
        22: 'Lemon Tuesday',
        23: 'Roboto Mono',
        24: 'Noto Sans',
        25: 'IBM Plex Sans',
        26: 'IBM Plex Serif',
        27: 'IBM Plex Mono',
        28: 'Spoof',
        29: 'Tiempos Text',
    };

    var shapesMap = {
        3: '',
        

    };

    function getTypeStyle(type, obj)
    {
        if (type == 'shape')
        {

        }
        var style = typeStylesMap[type];

        if (typeof style == 'function')
        {
            return style;
        }

        return style;
    };

    function parseStyles(style)
    {
        var style = [];

        try
        {
            var styleMap = JSON.parse(style);
            var fontStyle = 0;

            for (var key in styleMap)
            {
                var val = styleMap[key];

                if (val === null) continue;

                switch (key)
                {
                    case 'sbc': //Fill Color
                    case 'bc':
                        style.push('fillColor=' + colorNum2Hex(val));
                        break;
                    case 'fs': //Font Size
                        style.push('fontSize=' + val);
                        break;
                    case 'fsc': //Font Color?
                        break;
                    case 'fsa': //Font Style?
                        break;
                    case 'ffn': //Font Family
                        val = fontNameMap[val];

                        if (val) 
                        {
                            style.push('fontFamily=' + val);
                        }
                        break;
                    case 'ta': //Text Align
                        style.push('align=' + (val == 't' ? 'left' : 
                            (val == 'r'? 'right' : 'center')));
                        break;
                    case 'tav': //Text Vertical Align
                        style.push('verticalAlign=' + (val == 't' ? 'top' : 
                            (val == 'b'? 'bottom' : 'middle')));
                        break;
                    case 'taw': //Text Wrap?
                        break;
                    case 'tah': //Text Height?
                        break;
                    case 'lh': //Line Height?
                        break;
                    case 'bo': //Fill Opacity
                        style.push('opacity=' + (val * 100));
                        break;
                    case 'ss': //Stroke Size?
                        break;
                    case 'st': //Stroke Type?
                        break;
                    case 'brw': //Stroke width
                        style.push('strokeWidth=' + val);
                        break;
                    case 'brc': //Stroke Color
                        style.push('strokeColor=' + colorNum2Hex(val));
                        break;
                    case 'bro': //Stroke Opacity
                        style.push('strokeOpacity=' + (val * 100));
                        break;
                    case 'brs': //Stroke Style
                        //1 dashed, 0 dotted, 2 solid
                        style.push(val == 2? '' : ('dashed=1;' + (val == 0? 'dashPattern=1 4' : '')));
                        break;
                    case 'b': //Bold
                        fontStyle |= 1;
                        break;
                    case 'i': //Italic
                        fontStyle |= 2;
                        break;
                    case 'u': //Underline
                        fontStyle |= 4;
                        break;
                    case 's': //Stroke throw
                        fontStyle |= 8;
                        break;
                    case 'hl': //Highlight color
                        style.push('labelBackgroundColor=' + val);
                        break;
                    case 'tc': //Text Color
                        style.push('fontColor=' + colorNum2Hex(val));
                        break;
                    case 'sc': //Shadow Color?
                        break;
                }
            }
        }
        catch (e)
        {
            console.error(e);
        }

        if (fontStyle)
        {
            style.push('fontStyle=' + fontStyle);
        }

        return style.join(';');
    }

    function getCellStyle(cell, obj, type)
    {
        var style = '';

        if (obj.rotation)
        {
            style += 'rotation=' + obj.rotation + ';';
        }

        cell.style += style;
    };

    function importVertex(obj, type, graph)
    {
        var style = getTypeStyle(type, obj), vertex;

        if (typeof style == 'function')
        {
            vertex = style(obj, graph);
        }
        else
        {
            var scale = obj.scale.scale; //TODO Check this is the correct use of the scale
            vertex = new mxCell(obj.text, new mxGeometry(obj.position.x, obj.position.y,
                                obj.size.width * scale, obj.size.height * scale), style);
        }

        getCellStyle(vertex, obj, type);
        vertex.setVertex(true);
        graph.addCell(vertex);
        return vertex;
    };

    function createGraph()
	{
		var graph = new Graph();
        graph.setExtendParents(false);
        graph.setExtendParentsOnAdd(false);
        graph.setConstrainChildren(false);
        graph.setHtmlLabels(true);
        graph.getModel().maintainEdgeParent = false;
        return graph;
	};

    function importMiroJson(data)
    {
        try
        {
            var graph = createGraph();
            //Currently this handles version 2
            if (data.version != 2)
            {
                throw new Error('Unsupported Version');
            }

            var objects = data.data.objects;
            var edges = [];
            var vertexes = {};

            for (var i = 0; i < objects.length; i++)
            {
                var obj = objects[i].widgetData;
                var type = obj.type;
                obj = obj.json;

                if (type == 'line')
                {
                    edges.push(obj);
                }
                else
                {
                    vertexes[i] = importVertex(obj, type, graph);
                }
            }
        }
        catch (e)
        {
            console.error(e);
        }
    }
}