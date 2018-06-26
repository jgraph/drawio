/**
 * Copyright (c) 2006-2018, JGraph Ltd
 * Copyright (c) 2006-2018, Gaudenz Alder
 */
/**
 * Class: mxWebColaLayout
 *
 * Extends <mxGraphLayout> to implement a WebCola-based layout.
 *
 * Example:
 *
 * (code)
 * var layout = new mxWebColaLayout(graph);
 * layout.execute(graph.getDefaultParent());
 * (end)
 *
 * Constructor: mxWebColaLayout
 *
 * Constructs a new WebCola-based layout for the graph.
 *
 * Arguments:
 *
 * graph - <mxGraph> that contains the cells.
 *
 **/
function mxWebColaLayout(graph, layoutType)
/**
 * Constructs a WebCola-based layout
 * @param graph <mxGraph> that contains the cells.
 * @param layoutType Type of WebCola layout
 */
{
  mxGraphLayout.call(this, graph);
  this.layoutType = layoutType;
};

mxWebColaLayout.prototype = new mxGraphLayout();
mxWebColaLayout.prototype.constructor = mxWebColaLayout;

mxWebColaLayout.prototype.layoutType = null;

mxWebColaLayout.prototype.execute = function(parent)
  /**
   * Runs re-layouting of the portion of a graph from a given starting cell
   * @param parent starting cell
   */
{
  var movableVertices = this.getReachableVertices(parent);
  this.layout = new mxWebColaAdaptor(this.graph, [600, 600], movableVertices);
  var self = this;
  var update = function () {
    console.log("mxColaLayout: update");
    self.updateGraph();
  };
  this.layout.updatePositions = update;
  this.resetGraph(this.graph);
  var finalLayout = this.computePositions(this.layout);
};

mxWebColaLayout.prototype.getReachableVertices = function(parent)
  /***
   * Finds all vertices reachable from a given parent
   * @param parent starting cell of a search
   * @returns dictionary of vertice IDs that are reachable in the form of {id: True}
   *          if undefined is returned, it means parent was not provided and it should be interpreted as all vertices
   *          are reachable
   */
{
  if (parent == undefined)
    return undefined;
  // first, get all incidental edges in a sub-tree (or a connected component if with loops)
  var edges = this.graph.getEdges(parent, null, true, true, true, true);
  // now all vertices that are reachable are subject to change; unreachable should be fixed
  var reachableVertices = void(0);
  if (edges.length != 0)
  {
    var reachableVertices = {};
    for (var i = 0; i < edges.length; i++)
    {
      var edge = edges[i];
      reachableVertices[edge.source.id] = true;
      reachableVertices[edge.target.id] = true;
    }
  }
  // vertices connected by returned edges must be allowed to move, rest must be fixed in place
  return reachableVertices;
}

mxWebColaLayout.prototype.computePositions = function()
  /**
   * Executes layout to compute positions
   */
{
  return this.layout.run();
}

mxWebColaLayout.prototype.resetGraph = function(graph)
  /**
   * Resets initial vertex positions
   */
{
  var model = graph.getModel();
  var cells = model.cells;
  var view = graph.getView();
  for (var id in cells)
  {
    var cell = cells[id];
    var state = view.getState(cell);
    var bounds = view.getBoundingBox(state, true);
    var isFirst = true;
    if (cell.isVertex()) {
      var geometry = model.getGeometry(cell);
      if (geometry != null && typeof geometry != "undefined")
      {
        geometry = geometry.clone();
        geometry.offset = null;
        model.setGeometry(cell, geometry);
      }
    }
  }
}

mxWebColaLayout.prototype.getGroupBounds = function(model, groupCell)
  /**
   * Computes bounds of a group as boundary encompassing all children of a group
   * @param model graph model
   * @param groupCell starting group
   * @returns boundaries of all children inside a group
   */
{
  var minX =  1000000;
  var minY =  1000000;
  var maxX = -1000000;
  var maxY = -1000000;
  if (groupCell.children == null || groupCell.children.length == 0)
    return null;
  var cellsToVisit = [];
  cellsToVisit = cellsToVisit.concat(groupCell.children);
  while (cellsToVisit.length > 0)
  {
    var child = cellsToVisit.shift();
    if (child.isVertex())
    {
      if (this.layout.isLeafOrCollapsed(child))
      {
        var geometry = model.getGeometry(child);
        if (geometry != null && typeof geometry != "undefined")
        {
          if (geometry.x < minX)
          {
            minX = geometry.x;
          }
          if (geometry.y < minY)
          {
            minY = geometry.y;
          }
          if (geometry.x + geometry.width > maxX)
          {
            maxX = geometry.x + geometry.width;
          }
          if (geometry.y + geometry.height > maxY)
          {
            maxY = geometry.y + geometry.height;
          }
        }
      }
      else
      {
        cellsToVisit = cellsToVisit.concat(child.children);
      }
    }
  }
  var bounds = model.getGeometry(groupCell).clone();
  bounds.x = minX;
  bounds.y = minY;
  bounds.width = maxX - minX;
  bounds.height = maxY - minY;
  return bounds;
}

mxWebColaLayout.prototype.adjustChildOffsets = function(model, groupCell)
  /**
   * Adjusts offset of child vertices to be relative to parent groups
   * @param model graph model
   * @param groupCell starting group cell
   */
{
  if (groupCell.children == null || groupCell.children.length == 0)
    return;
  var groupBounds = model.getGeometry(groupCell);
  var offsetX = groupBounds.x;
  var offsetY = groupBounds.y;
  var cellsToVisit = [];
  cellsToVisit = cellsToVisit.concat(groupCell.children);
  while (cellsToVisit.length > 0)
  {
    var child = cellsToVisit.shift();
    if (child.isVertex())
    {
      if (this.layout.isLeafOrCollapsed(child))
      {
        var geometry = model.getGeometry(child);
        if (geometry != null && typeof geometry != "undefined")
        {
          geometry = geometry.clone();
          geometry.x = geometry.x - offsetX;
          geometry.y = geometry.y - offsetY;
          model.setGeometry(child, geometry);
        }
      }
      else
      {
        cellsToVisit = cellsToVisit.concat(child.children);
      }
    }
  }
}

mxWebColaLayout.prototype.updateGraph = function()
  /**
   * Updates graph based on layout's vertex/group positions
   */
{
  console.log("updating graph");
  // find X, Y ranges first
  var minX = 1000000;
  var maxX = -1000000;
  var minY = 1000000;
  var maxY = -1000000;

  for (var i = 0; i < this.layout.adaptor._nodes.length; i++)
  {
    var node = this.layout.adaptor._nodes[i];
    var x = node.x;
    var y = node.y;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  var spanX = maxX - minX;
  var spanY = maxY - minY;

  var model = this.graph.getModel();
  model.beginUpdate();
  try
  {
    var cells = model.cells;
    var view = this.graph.getView();
    // scan leaves and edges
    for (var id in cells)
    {
      var cell = cells[id];
      var state = view.getState(cell);
      var bounds = view.getBoundingBox(state, true);
      if (cell.isVertex() && this.layout.isLeafOrCollapsed(cell))
      {
        var nodeId = this.layout.cellToNode[id];
        if (typeof nodeId == "undefined")
          continue;
        var node = this.layout.adaptor._nodes[nodeId];
        var geometry = model.getGeometry(cell);
        if (geometry != null && typeof geometry != "undefined")
        {
          geometry = geometry.clone();
          geometry.x = node.x - minX;
          geometry.y = node.y - minY;
          model.setGeometry(cell, geometry);
        }
        else
        {
          alert("vertex cell id:" + id + " has no geometry!");
        }
      }
      else if (cell.isEdge())
      {
        this.graph.resetEdge(cell);
      }
    }
    // scan groups
    for (var id in cells)
    {
      var cell = cells[id];
      var state = view.getState(cell);
      var bounds = view.getBoundingBox(state, true);
      if (cell.isVertex() && !this.layout.isLeafOrCollapsed(cell))
      {
        var bounds = this.getGroupBounds(model, cell);
        if (bounds != null && typeof bounds != "undefined")
        {
          model.setGeometry(cell, bounds);
          this.adjustChildOffsets(model, cell);
        }
      }
    }
  }
  finally
  {
    model.endUpdate();
  }

}
