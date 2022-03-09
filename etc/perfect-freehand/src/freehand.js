import { getStroke } from "perfect-freehand";

global.PerfectFreehand = {};

PerfectFreehand.getStroke = function(points, options) 
{ 
  return getStroke(points, options);
}

PerfectFreehand.getSvgPathFromStroke = function(points, options)
{
  let stroke = getStroke(points, options);
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length]
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
      return acc
    },
    ["M", ...stroke[0], "Q"]
  )

  d.push("Z")
  return d.join(" ")
}