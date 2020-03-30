function mxOrgChart(editorUi)
{
	Bridge.define('ChartApp',
    {
        statics: {
            config: {
                init: function() {

                }
            },
            main: function (editorUi) {
                Bridge.Console.log = console.log;
                Bridge.Console.error = console.error;
                Bridge.Console.debug = console.debug;

                ChartApp.editorUi = editorUi;
                ChartApp.buildChart(true);
            },

            diagram: {},
            dataSource: {},
            //suppressRootBox: false,
            //totalBoxCount: 20,
            //percentAssistants: 10,

            /*boxClick: function(boxId) {
                var box = ChartApp.diagram.getBoxes().getBoxesById().getItem(boxId);
                box.IsCollapsed = !box.IsCollapsed;
                ChartApp.positionBoxes();
            },*/

            buildChart: function (initData) {
                if (initData) {
                    ChartApp.initDiagram();
                }
                ChartApp.positionBoxes();
            },

            collapseAllBoxes: function(boxContainer, isCollapsed) {
                var en = boxContainer.getBoxesById().getValues().getEnumerator();
                while (en.moveNext()) {
                    var box = en.getCurrent();
                    if (!box.IsSpecial) {
                        box.IsCollapsed = isCollapsed;
                    }
                }
            },

            generateData: function () {
                
            	
            	/*var count = ChartApp.totalBoxCount;
                var percentAssistants = ChartApp.percentAssistants;

                var dataSource = new OrgChart.Test.TestDataSource();
                (new OrgChart.Test.TestDataGen()).GenerateDataItems(dataSource, count, percentAssistants);

                if (ChartApp.suppressRootBox) {
                    dataSource.Items.remove('0');
                    var en = dataSource.Items.getValues().getEnumerator();
                    while (en.moveNext()) {
                        var dataItem = en.getCurrent();
                        if (dataItem.ParentId === "0") {
                            dataItem.ParentId = null;
                        }
                    }
                }*/

            	var dataSource = new OrgChart.Test.TestDataSource();
            	
                var graph = ChartApp.editorUi.editor.graph;
                var cells = graph.model.cells;
                var defParent = graph.getDefaultParent();
                //var dataSource = {"Items": {"comparer": {}, "entries": {}}};
                
                for (var id in cells)
               	{
                	var cell = cells[id];
                	
                	if (cell.geometry != null && cell.vertex && cell.parent == defParent) //TODO First level only?
                	{
                		// Find cell parent. If it has more than one parent, take first parent (should be an error?)
                		var parentId = null;
                		
                		var incomingEdge = graph.getIncomingEdges(cell)[0];
                		
                		if (incomingEdge != null && incomingEdge.source != null)
               			{
                			parentId = incomingEdge.source.id;
               			}
                		
                		var item = new OrgChart.Test.TestDataItem();
                		item.Id = id;
                		item.ParentId = parentId;
                		dataSource.Items.add(item.getId(), item);
//	                	dataSource.Items.entries[id] = [{
//	               			"key": id,
//	                        "value": {
//	                            "Id": id
//	                        },
//	                        "ParentId": parentId
//	                	}];
                	}
               	}
                
                return dataSource;
            },

            initDiagram: function () {
               // $("#myDiagramDiv").html('');
               // $("#myDiagramDiv").append('<div id="myConnectors" class="chartConnectorsPlane"/>')

                var dataSource = ChartApp.generateData();

                ChartApp.dataSource = dataSource;

                var boxContainer = new OrgChart.Layout.BoxContainer.$ctor1(dataSource);
                //OrgChart.Test.TestDataGen.GenerateBoxSizes(boxContainer);

               /* if ($("#CollapseAllOnRebuild")[0].checked) {
                    ChartApp.collapseAllBoxes(boxContainer, true);
                }*/

                ChartApp.diagram = new OrgChart.Layout.Diagram();

                var diagram = ChartApp.diagram;
                diagram.setBoxes(boxContainer);

                var linearLayoutStrategy = new OrgChart.Layout.LinearLayoutStrategy();
                linearLayoutStrategy.ParentAlignment = OrgChart.Layout.BranchParentAlignment.Center;
                diagram.LayoutSettings.LayoutStrategies.add("linear", linearLayoutStrategy);

                var multiLineHangerLayoutStrategy = new OrgChart.Layout.MultiLineHangerLayoutStrategy();
                multiLineHangerLayoutStrategy.ParentAlignment = OrgChart.Layout.BranchParentAlignment.Center;
                multiLineHangerLayoutStrategy.MaxSiblingsPerRow = 2;
                diagram.LayoutSettings.LayoutStrategies.add("hanger2", multiLineHangerLayoutStrategy);

                multiLineHangerLayoutStrategy = new OrgChart.Layout.MultiLineHangerLayoutStrategy();
                multiLineHangerLayoutStrategy.ParentAlignment = OrgChart.Layout.BranchParentAlignment.Center;
                multiLineHangerLayoutStrategy.MaxSiblingsPerRow = 4;
                diagram.LayoutSettings.LayoutStrategies.add("hanger4", multiLineHangerLayoutStrategy);

                var singleColumnLayoutStrategy = new OrgChart.Layout.SingleColumnLayoutStrategy();
                singleColumnLayoutStrategy.ParentAlignment = OrgChart.Layout.BranchParentAlignment.Right;
                diagram.LayoutSettings.LayoutStrategies.add("singleColumnRight", singleColumnLayoutStrategy);

                singleColumnLayoutStrategy = new OrgChart.Layout.SingleColumnLayoutStrategy();
                singleColumnLayoutStrategy.ParentAlignment = OrgChart.Layout.BranchParentAlignment.Left;
                diagram.LayoutSettings.LayoutStrategies.add("singleColumnLeft", singleColumnLayoutStrategy);

                var fishboneLayoutStrategy = new OrgChart.Layout.MultiLineFishboneLayoutStrategy();
                fishboneLayoutStrategy.ParentAlignment = OrgChart.Layout.BranchParentAlignment.Center;
                fishboneLayoutStrategy.MaxGroups = 1;
                diagram.LayoutSettings.LayoutStrategies.add("fishbone1", fishboneLayoutStrategy);

                fishboneLayoutStrategy = new OrgChart.Layout.MultiLineFishboneLayoutStrategy();
                fishboneLayoutStrategy.ParentAlignment = OrgChart.Layout.BranchParentAlignment.Center;
                fishboneLayoutStrategy.MaxGroups = 2;
                diagram.LayoutSettings.LayoutStrategies.add("fishbone2", fishboneLayoutStrategy);

                var hstackLayoutStrategy = new OrgChart.Layout.StackingLayoutStrategy();
                hstackLayoutStrategy.ParentAlignment = OrgChart.Layout.BranchParentAlignment.InvalidValue;
                hstackLayoutStrategy.Orientation = OrgChart.Layout.StackOrientation.SingleRowHorizontal;
                hstackLayoutStrategy.ParentChildSpacing = 10;
                diagram.LayoutSettings.LayoutStrategies.add("hstack", hstackLayoutStrategy);

                var vstackLayoutStrategy = new OrgChart.Layout.StackingLayoutStrategy();
                vstackLayoutStrategy.ParentAlignment = OrgChart.Layout.BranchParentAlignment.InvalidValue;
                vstackLayoutStrategy.Orientation = OrgChart.Layout.StackOrientation.SingleColumnVertical;
                vstackLayoutStrategy.ParentChildSpacing = 10;
                diagram.LayoutSettings.LayoutStrategies.add("vstack", vstackLayoutStrategy);

                vstackLayoutStrategy = new OrgChart.Layout.StackingLayoutStrategy();
                vstackLayoutStrategy.ParentAlignment = OrgChart.Layout.BranchParentAlignment.InvalidValue;
                vstackLayoutStrategy.Orientation = OrgChart.Layout.StackOrientation.SingleColumnVertical;
                vstackLayoutStrategy.SiblingSpacing = 20;
                diagram.LayoutSettings.LayoutStrategies.add("vstackMiddle", vstackLayoutStrategy);

                vstackLayoutStrategy = new OrgChart.Layout.StackingLayoutStrategy();
                vstackLayoutStrategy.ParentAlignment = OrgChart.Layout.BranchParentAlignment.InvalidValue;
                vstackLayoutStrategy.Orientation = OrgChart.Layout.StackOrientation.SingleColumnVertical;
                vstackLayoutStrategy.SiblingSpacing = 50;
                diagram.LayoutSettings.LayoutStrategies.add("vstackTop", vstackLayoutStrategy);

                var assistantsLayoutStrategy = new OrgChart.Layout.FishboneAssistantsLayoutStrategy();
                assistantsLayoutStrategy.ParentAlignment = OrgChart.Layout.BranchParentAlignment.Center;
                diagram.LayoutSettings.LayoutStrategies.add("assistants", assistantsLayoutStrategy);

                diagram.LayoutSettings.DefaultLayoutStrategyId = "vstack";
                diagram.LayoutSettings.DefaultAssistantLayoutStrategyId = "assistants";
                //diagram.LayoutSettings.setBranchSpacing(5);
            },

            getBoxLevel: function(boxContainer, box) {
                var level = 0;
                var obj = {};
                while (box.ParentId > 0) {
                    if (!boxContainer.getBoxesById().tryGetValue(box.ParentId, obj)) {
                        break;
                    }
                    box = obj.v;
                    level++;
                }

                return level;
            },

            onLayoutStateChanged: function (sender, args) {
                if (args.State.getCurrentOperation() === OrgChart.Layout.LayoutState.Operation.PreprocessVisualTree) {
                    // When layout algorithm is ready to preprocess the tree,
                    // we need to have box sizes ready -> hence have to render visible boxes in HTML.
                    // Rendering can happen at earlier time, but it's just more convenient to do it here,
                    // to utilize some readily available information about visual tree.
                    ChartApp.renderBoxes();
                }
            },
            
            renderBoxes: function () {
                //var boxContainer = ChartApp.diagram.getBoxes();
                //var dataSource = ChartApp.dataSource;
                
                //var expanderHtml = '<div id="exp{0}" class="expander" onclick="ChartApp.boxClick({0})">?</div>';
                //var boxHtml = '<div id="box{0}" class="{2}" style="width: 150px; height: auto;" onclick="ChartApp.boxClick({0})"><p><b>{3}</b></p>Box #{0}, Data #{1}, Asst: {4}</div>';

                var visitorFunc = function (node) {
                    var box = node.Element;

                    if (box.getIsDataBound()) {
                        // we're being run when nodes have already been marked as visible or hidden,
                        // based on IsCollapsed attribute of each Box
                        // so use this knowledge to prevent unnecessary rendering of invisible branches
                        /*var existing = $('#box' + box.Id);
                        if (existing.length > 0) {
                            var exp = $('#exp' + box.Id);
                            if (node.State.IsHidden) {
                                existing.hide();
                                if (exp.length > 0) exp.hide();
                            } else {
                                existing.show();
                                if (exp.length > 0) exp.show();
                            }
                            return true;
                        } else */ 
                        if (node.State.IsHidden) {
                            return true;
                        }

                        //var level = ChartApp.getBoxLevel(boxContainer, box);
                        //var dataItem = dataSource.GetDataItem(box.DataId);

                        // level 0 is always for the BoxContainer.SystemRoot
                        // normal boxes are under it, so they start at level 1
                        /* if (level === 1) {
                            $("#myDiagramDiv")
                                .append(boxHtml.format(box.Id, box.DataId, "chartBoxTop", "Top", box.IsAssistant));
                        } else if (level === 2) {
                            $("#myDiagramDiv")
                                .append(boxHtml.format(box.Id, box.DataId, "chartBoxMiddle", "Middle", box.IsAssistant));
                        } else if (level === 3) {
                            $("#myDiagramDiv")
                                .append(boxHtml.format(box.Id, box.DataId, "chartBoxLower", "Lower", box.IsAssistant));
                        } else {
                            $("#myDiagramDiv")
                                .append(boxHtml.format(box.Id, box.DataId, "chartBoxLowest", "Lowest ({0})".format(level), box.IsAssistant));
                        }

                        if (node.getChildCount() > 0 || node.AssistantsRoot != null) {
                            $("#myDiagramDiv")
                                .append(expanderHtml.format(box.Id));
                        } */

                        // now store element size, as rendered by browser
                        box.Size = ChartApp.getBoxElementSize(box.DataId);
                    }

                    return true;
                }

                ChartApp.diagram.getVisualTree().IterateParentFirst(visitorFunc);
            },

            //TODO implement this
            getBranchOptimizerFunc: function () {
//                var value = $("input[name='SelectBranchOptimizer']:checked").val();
                var func = ChartApp['branchOptimizer' + 'AllHanger4'];
                return func;
            },

            branchOptimizerAllLinear: function(node) {
                return node.getIsAssistantRoot() ? null : "linear";
            },
            
            branchOptimizerAllHanger2: function(node) {
                return node.getIsAssistantRoot() ? null : "hanger2";
            },
            
            branchOptimizerAllHanger4: function(node) {
                return node.getIsAssistantRoot() ? null : "hanger4";
            },
            
            branchOptimizerAllFishbone1: function(node) {
                return node.getIsAssistantRoot() ? null : "fishbone1";
            },

            branchOptimizerAllFishbone2: function (node) {
                return node.getIsAssistantRoot() ? null : "fishbone2";
            },

            branchOptimizerAllSingleColumnLeft: function (node) {
                return node.getIsAssistantRoot() ? null : "singleColumnRight";
            },

            branchOptimizerAllSingleColumnRight: function (node) {
                return node.getIsAssistantRoot() ? null : "singleColumnLeft";
            },

            branchOptimizerStackers: function(node) {
                if (node.getIsAssistantRoot()) {
                    return null;
                }
                return node.Level === 0 // this is Node for boxContainer.SystemRoot, which is not visible itself
                    ? "vstackTop"
                    : node.Level === 1 // this is children of SystemRoot - they appear as roots in the diagram
                    ? "vstackMiddle"
                    : "hstack";

            },

            branchOptimizerSmart: function(node) {
                if (node.getIsAssistantRoot()) {
                    return null;
                }

                var childCount = node.getChildCount();

                if (childCount <= 1) {
                    return "vstack";
                }

                var nonLeafChildren = 0;
                for (var i = 0; i < childCount; i++) {
                    if (node.Children.getItem(i).getChildCount() > 0) {
                        nonLeafChildren++;
                    }
                }

                if (nonLeafChildren <= 1) {
                    if (childCount <= 4) {
                        return "vstack";
                    }
                    if (childCount <= 8) {
                        return "fishbone1";
                    }
                    return "fishbone2";
                }

                return "hanger4";
            },

            boxSizeFunc: function (dataId) {
                // ChartLayoutAlgorithm requires this function to accept data ID
                // so have to convert it to Box ID first, to get rendered visual element
                var boxId = ChartApp.diagram.getBoxes().getBoxesByDataId().getItem(dataId).Id;
                return ChartApp.diagram.getBoxes().getBoxesById().getItem(boxId).Size;
            },

            getBoxElementSize: function (boxId) {
                /* var div = $('#box' + boxId);
                if (div.length > 0) {
                    return new OrgChart.Layout.Size.$ctor1(div.outerWidth(), div.outerHeight());
                } else { */
            		var geo = ChartApp.editorUi.editor.graph.model.cells[boxId].geometry;
            		return new OrgChart.Layout.Size.$ctor1(geo.width, geo.height);
                //}
            },

            positionBoxes: function () {
                //$('#myConnectors').html('');

                //var boxContainer = ChartApp.diagram.getBoxes();
                //var dataSource = ChartApp.dataSource;
                var diagram = ChartApp.diagram;

                var state = new OrgChart.Layout.LayoutState(diagram);

                state.addOperationChanged(ChartApp.onLayoutStateChanged);
                state.BoxSizeFunc = Bridge.fn.bind(this, ChartApp.boxSizeFunc, null, true);
                state.LayoutOptimizerFunc = Bridge.fn.bind(this, ChartApp.getBranchOptimizerFunc(), null, true);

                OrgChart.Layout.LayoutAlgorithm.Apply(state);

                var diagramBoundary = OrgChart.Layout.LayoutAlgorithm.ComputeBranchVisualBoundingRect(diagram.getVisualTree());
console.log(diagramBoundary)
                //$("#myDiagramDiv").width(diagramBoundary.Size.Width);
                //$("#myDiagramDiv").height(diagramBoundary.Size.Height);

//                var viewPort = $("#myDiagramDiv").offset();
                var offsetx = -diagramBoundary.getLeft() + diagramBoundary.getTop(); //-diagramBoundary.getLeft() + viewPort.left;
//                var offsety = -diagramBoundary.getTop() + viewPort.top;

				var graph = ChartApp.editorUi.editor.graph;
                var cells = graph.model.cells;
                
                var visitorFunc = function (node) {
                    if (node.State.IsHidden) {
                        return false;
                    }

                    var box = node.Element;

                    if (box.getIsDataBound()) {
                        var cell = cells[box.DataId];
                        cell.geometry.x = node.State.TopLeft.X + offsetx;
                        cell.geometry.y = node.State.TopLeft.Y; 
//                        // All boxes have already been rendered before the chart layout,
//                        // to have all box sizes available before layout.
//                        // So now we only have to position them.
//                        // Connectors, however, are not rendered until layout is complete (see next block).
//						console.log(node.State.TopLeft, node.State);
//                        /* var div = $('#box' + box.Id);
//                         if (div.length > 0) {*/
//
//                            var x = node.State.TopLeft.X + offsetx;
//                            var y = node.State.TopLeft.Y + offsety;
//
//                           /*  div.offset({ left: x, top: y });
//                            div.css("width", node.State.Size.Width);
//                             div.css("height", node.State.Size.Height);*/
//
//                            if (node.getChildCount() > 0 || node.AssistantsRoot != null) {
//                               // var exp = $('#exp' + box.Id);
//                               // if (exp.length > 0) {
//                                    x = node.State.getRight() + offsetx - 15;
//                                    y = node.State.getBottom() + offsety - 15;
//                               //     exp.offset({ left: x, top: y });
//
//                              /*      if (box.IsCollapsed) {
//                                        exp.text('▼');
//                                    } else {
//                                        exp.text('△');
//                                    }
//                                }*/
//                            }
//                        //}
                    }

                    //TODO apply to draw.io edges
                    // Render connectors
                    if (node.State.Connector != null) {
                    	var incomingEdge = graph.getIncomingEdges(cell)[0];
                    	var outgoingEdge = graph.getOutgoingEdges(cell);
                    	for (var j = 0; j < outgoingEdge.length; j++)
                		{
                    		outgoingEdge[j].geometry.points = null;
                		}
                    	
                        for (var ix = 0; ix < node.State.Connector.Segments.length; ix++) {
                            var edge = node.State.Connector.Segments[ix];
                            var edgeType;
                            var topLeft;
                            var width;
                            var height;
                            console.log(edge, edge.From, edge.To, node.State.Connector.Segments.length, outgoingEdge.length);
                            if (edge.From.Y === edge.To.Y) {
                                edgeType = "chartHLine";
                                height = 1;
                                if (edge.From.X < edge.To.X) {
                                    topLeft = edge.From;
                                    width = edge.To.X - edge.From.X;
                                } else {
                                    topLeft = edge.To;
                                    width = edge.From.X - edge.To.X;
                                }
                            } else {
                                edgeType = "chartVLine";
                                if (edge.From.Y < edge.To.Y) {
                                    topLeft = edge.From;
                                    height = edge.To.Y - edge.From.Y;
                                } else {
                                    topLeft = edge.To;
                                    height = edge.From.Y - edge.To.Y;
                                }
                            }

                            if (node.getIsAssistantRoot()) {
                                edgeType = edgeType + "Dotted";
                            }

//                            $("#myConnectors")
//                                .append('<div class="' +
//                                    edgeType +
//                                    '" style="top:' +
//                                    (topLeft.Y + offsety) +
//                                    'px; left:' +
//                                    (topLeft.X + offsetx) +
//                                    'px; width:' +
//                                    width +
//                                    'px; height:' +
//                                    height +
//                                    'px;"/>');
                        }
                    }

                    return true;
                }

                diagram.getVisualTree().IterateParentFirst(visitorFunc);
            }

        }
    });

    // First, checks if it isn't implemented yet.
//    if (!String.prototype.format) {
//        String.prototype.format = String.prototype.f = function () {
//            var s = this,
//                i = arguments.length;
//
//            while (i--) {
//                s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
//            }
//            return s;
//        };
//    }

    Bridge.init();
    ChartApp.main(editorUi);

//    function changedSuppressRootBox(cb) {
//        ChartApp.suppressRootBox = cb.checked;
//        ChartApp.buildChart(true);
//    }
//
//    function clickCollapseAll(bt) {
//        ChartApp.collapseAllBoxes(ChartApp.diagram.getBoxes(), true);
//        ChartApp.buildChart(false);
//    }
//
//    function clickExpandAll(bt) {
//        ChartApp.collapseAllBoxes(ChartApp.diagram.getBoxes(), false);
//        ChartApp.buildChart(false);
//    }
//
//    function clickOptimizer(rd) {
//        ChartApp.buildChart(false);
//    }

//    function clickDataCounts(rd) {
//        var value = rd.value;
//        if (value === "small") {
//            ChartApp.totalBoxCount = 20;
//            ChartApp.percentAssistants = 0;
//        } else if (value === "small-a") {
//            ChartApp.totalBoxCount = 20;
//            ChartApp.percentAssistants = 10;
//        }  else if (value === "large") {
//            ChartApp.totalBoxCount = 200;
//            ChartApp.percentAssistants = 0;
//        }  else if (value === "large-a") {
//            ChartApp.totalBoxCount = 200;
//            ChartApp.percentAssistants = 10;
//        }  else if (value === "huge-a") {
//            ChartApp.totalBoxCount = 1000;
//            ChartApp.percentAssistants = 5;
//        } 
//        ChartApp.buildChart(true);
//    }
};