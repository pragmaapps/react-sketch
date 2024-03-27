/*eslint no-unused-vars: 0*/

import FabricCanvasTool from "./fabrictool";
import { linearDistance } from "./utils";

const fabric = require("fabric").fabric;
const geometric = require("geometric");

var svgData = '<svg xmlns="http://www.w3.org/2000/svg" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-uqopch" viewBox="0 0 24 24" focusable="false" aria-hidden="true" data-testid="Rotate90DegreesCwIcon"><path fill="red" d="M4.64 19.37c3.03 3.03 7.67 3.44 11.15 1.25l-1.46-1.46c-2.66 1.43-6.04 1.03-8.28-1.21-2.73-2.73-2.73-7.17 0-9.9C7.42 6.69 9.21 6.03 11 6.03V9l4-4-4-4v3.01c-2.3 0-4.61.87-6.36 2.63-3.52 3.51-3.52 9.21 0 12.73zM11 13l6 6 6-6-6-6-6 6z"></path></svg>';

var rotateIcon = 'data:image/svg+xml,' + encodeURIComponent(svgData);
var img = document.createElement('img');
img.src = rotateIcon;

function renderIcon(ctx, left, top, styleOverride, fabricObject) {
  var size = this.cornerSize;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
}

class Polygon extends FabricCanvasTool {
  activeLine;
  activeShape;
  canvas = this._canvas;
  lineArray = [];
  pointArray = [];
  drawMode = true;

  configureCanvas(props) {
    let canvas = this._canvas;
    canvas.isDrawingMode = canvas.selection = false;
    this._width = props.lineWidth;
    this._color = props.lineColor;
    this._fill = props.fillColor;
    this.count = 1;
    this.objectAdd = false;
  }

  Point(x, y) {
    this.x = x;
    this.y = y;
  }

  doMouseDown(options, props) {
    if (this.drawMode) {
      if(options.target && this.pointArray.length === 1 && options.target.id === this.pointArray[0].id){
        return;
      }
      if (
        options.target &&
        this.pointArray[0] &&
        options.target.id === this.pointArray[0].id
      ) {
        this.objectAdd = true;
        this.generatePolygon(this.pointArray, props);
      } else {
        this.addPoint(options, props);
      }
    }

    var evt = options.e;
    if (evt.altKey === true) {
      this.isDragging = true;
      this.selection = false;
      this.lastPosX = evt.clientX;
      this.lastPosY = evt.clientY;
    }
  }

  addPoint = (options, props) => {
    let canvas = this._canvas;
    let boundaryObject = this.getboudaryCoords();
    
    const pointOption = {
      id: new Date().getTime(),
      radius: 2,
      fill: "#ffffff",
      stroke: "#333333",
      strokeWidth: 0.5,
      left: options.e.layerX / canvas.getZoom(),
      top: options.e.layerY / canvas.getZoom(),
      selectable: false,
      hasBorders: false,
      hasControls: false,
      originX: "center",
      originY: "center",
      objectCaching: false,
    };
    const point = new fabric.Circle(pointOption);
    if(boundaryObject && (point.left > (boundaryObject.width * boundaryObject.scaleX) + boundaryObject.left || point.top > (boundaryObject.height * boundaryObject.scaleY) + boundaryObject.top || point.left < boundaryObject.left || point.top < boundaryObject.top)){
      return;
    }

    if (this.pointArray.length === 0) {
      // fill first point with red color
      point.set({
        fill: "red",
      });
    }

    const linePoints = [
      options.e.layerX / canvas.getZoom(),
      options.e.layerY / canvas.getZoom(),
      options.e.layerX / canvas.getZoom(),
      options.e.layerY / canvas.getZoom(),
    ];
    const lineOption = {
      strokeWidth: 2,
      fill: "#999999",
      stroke: "#999999",
      originX: "center",
      originY: "center",
      selectable: false,
      hasBorders: false,
      hasControls: false,
      evented: false,
      objectCaching: false,
    };
    const line = new fabric.Line(linePoints, lineOption);
    line.class = "line";

    if (this.activeShape) {
      const pos = canvas.getPointer(options.e);
      const points = this.activeShape.get("points");
      points.push({
        x: pos.x,
        y: pos.y,
      });
      const polygon = new fabric.Polygon(points, {
        stroke: "#333333",
        strokeWidth: 1,
        fill: this._fill,
        opacity: 0.3,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false,
        objectCaching: false,
        visible: false
      });
      canvas.remove(this.activeShape);
      canvas.add(polygon);
      this.activeShape = polygon;
      canvas.renderAll();
    } else {
      const polyPoint = [
        {
          x: options.e.layerX / canvas.getZoom(),
          y: options.e.layerY / canvas.getZoom(),
        },
      ];
      const polygon = new fabric.Polygon(polyPoint, {
        stroke: "#333333",
        strokeWidth: 1,
        fill: "#cccccc",
        opacity: 0.3,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false,
        objectCaching: false,
        visible: false
      });
      this.activeShape = polygon;
      canvas.add(polygon);
    }

    this.activeLine = line;
    this.pointArray.push(point);
    this.lineArray.push(line);

    canvas.add(line);
    canvas.add(point);
  };

  doMouseMove(options, props) {
    //if (!this.isDown) return;
    let canvas = this._canvas;
    let pointer = canvas.getPointer(options.e);
    let boundary = this.getboudaryCoords();
    if(boundary && (pointer.y > (boundary.height * boundary.scaleY) + boundary.top  || pointer.x > (boundary.width * boundary.scaleX) + boundary.left  || pointer.x < boundary.left || pointer.y < boundary.top)){
        
      return;
    }   
    if (this.isDragging) {
      var e = options.e;
      let obj = e.target;
      this.viewportTransform[4] += e.clientX - this.lastPosX;
      this.viewportTransform[5] += e.clientY - this.lastPosY;
      canvas.requestRenderAll();
      this.lastPosX = e.clientX;
      this.lastPosY = e.clientY;
    }
    if (this.drawMode) {
      if (this.activeLine && this.activeLine.class === "line") {
        const pointer = this.canvas.getPointer(options.e);
        this.activeLine.set({
          x2: pointer.x,
          y2: pointer.y,
        });
        const points = this.activeShape.get("points");
        points[this.pointArray.length] = {
          x: pointer.x,
          y: pointer.y,
        };
        this.activeShape.set({
          points,
        });
      }
      canvas.renderAll();
    }
  }

  doMouseUp(o, props) {
    this.isDown = false;
    let canvas = this._canvas;
    canvas.selection = true;
    this.isDragging = false;
    this.selection = true;
    this.drawMode = true;
  }

  generatePolygon = (pointArray, props) => {
    let canvas = this._canvas;
    let name = "polygon";
    let defaultName = "polygon";
    let points = [];
    // collect points and remove them from canvas
    for (const point of pointArray) {
      points.push({
        x: point.left,
        y: point.top,
      });
      canvas.remove(point);
    }

    // // remove lines from canvas
    for (const line of this.lineArray) {
      canvas.remove(line);
    }

    // remove selected Shape and Line
    canvas.remove(this.activeShape).remove(this.activeLine);

    // create polygon from collected points
    const polygon = new fabric.Polygon(points, {
      id: new Date().getTime(),
      fill: this._fill,
      strokeWidth: this._width,
      stroke:  props.lineColor,
      transparentCorners: false,
      name: name,
      defaultName: defaultName,
      selectable: false,
      evented: false,
      enable: true,
      description: "",
      strokeUniform: true,
      rotate: false
    });
    canvas.add(polygon);
    this.toggleDrawPolygon();
    this.editPolygon(polygon, true);
    polygon.setCoords();
  };

  toggleDrawPolygon = () => {
    let canvas = this._canvas;
    if (this.drawMode) {
      // stop draw mode
      this.activeLine = null;
      this.activeShape = null;
      this.lineArray = [];
      this.pointArray = [];
      this.canvas.selection = true;
      // this.drawMode = false;
    } else {
      // start draw mode
      canvas.selection = false;
      this.drawMode = true;
    }
  };

  editPolygon = (polygon, editForRotate) => {
    let canvas = this._canvas;
    let activeObject;
    if (!activeObject) {
      activeObject = polygon;
      // canvas.setActiveObject(activeObject);
    }

    activeObject.edit = !polygon.edit;
    activeObject.objectCaching = false;
    const lastControl = activeObject.points.length - 1;
    activeObject.cornerStyle = "circle";
    activeObject.controls = activeObject.points.reduce((acc, point, index) => {
      // this.pointIndex = index;
      acc["p" + index] = new fabric.Control({
        pointIndex: index,
        positionHandler: (dim, finalMatrix, fabricObject) => {
          var x = fabricObject.points[index].x - fabricObject.pathOffset.x,
            y = fabricObject.points[index].y - fabricObject.pathOffset.y;
          return fabric.util.transformPoint(
            { x: x, y: y },
            fabric.util.multiplyTransformMatrices(
              fabricObject.canvas.viewportTransform,
              fabricObject.calcTransformMatrix()
            )
          );
        },
        actionHandler: this.anchorWrapper(
          index > 0 ? index - 1 : lastControl,
          this.actionHandler
        ),
        actionName: "modifyPolygon",
      });
      return acc;
    }, {});
    let controlsVisibility = {};
    Object.keys(activeObject.controls).map(ob => ob === "mtr" ? controlsVisibility[ob] = false : controlsVisibility[ob] = true);
    activeObject.setControlsVisibility(controlsVisibility);
    if(editForRotate){
      activeObject.controls.mtr = new fabric.Control({
        x: 0,
        y: -0.5,
        offsetY: -40,
        cursorStyle: 'crosshair',
        actionHandler: fabric.controlsUtils.rotationWithSnapping,
        actionName: 'rotate',
        render: renderIcon,
        cornerSize: 16,
        withConnection: true
      });
      let controlsVisibility = {};
      // Object.keys(activeObject.controls).map(ob => ob === "mtr" ? controlsVisibility[ob] = true : controlsVisibility[ob] = false)
      activeObject.setControlsVisibility(controlsVisibility);
  }

    activeObject.hasBorders = true;
    activeObject.setCoords();
    canvas.requestRenderAll();
  };

  polygonPositionHandler = (dim, finalMatrix, fabricObject) => {
    const transformPoint = {
      x: fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x,
      y: fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y,
    };
    return fabric.util.transformPoint(
      transformPoint,
      fabricObject.calcTransformMatrix()
    );
  };

  anchorWrapper = (anchorIndex, fn) => {
    return (eventData, transform, x, y) => {
      var fabricObject = transform.target,
        absolutePoint = fabric.util.transformPoint(
          {
            x: fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
            y: fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y,
          },
          fabricObject.calcTransformMatrix()
        ),
        actionPerformed = fn(eventData, transform, x, y),
        newDim = fabricObject._setPositionDimensions({}),
        polygonBaseSize = this.getObjectSizeWithStroke(fabricObject),
        newX =
          (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
          polygonBaseSize.x,
        newY =
          (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
          polygonBaseSize.y;

      fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
      return actionPerformed;
    };
  };

  actionHandler = (eventData, transform, x, y) => {
    let canvas = this._canvas;
    boundary = this.getboudaryCoords();
    var polygon = transform.target,
      currentControl = polygon.controls[polygon.__corner],
      mouseLocalPosition = polygon.toLocalPoint(
        new fabric.Point(x, y),
        "center",
        "center"
      ),
      polygonBaseSize = this.getObjectSizeWithStroke(polygon),
      size = polygon._getTransformedDimensions(0, 0),
      finalPointPosition = {
        x:
          (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
          polygon.pathOffset.x,
        y:
          (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
          polygon.pathOffset.y,
      };
      if(boundary && (y > (boundary.height * boundary.scaleY) + boundary.top  || x > (boundary.width * boundary.scaleX) + boundary.left  || x < boundary.left || y < boundary.top)){
        
        return false;
      }
    let tempPolygon =  JSON.parse(JSON.stringify(polygon));
    tempPolygon.points[currentControl.pointIndex] = finalPointPosition;
    // if(!this.checkForMinDistance(tempPolygon)){
    //   polygon.points[currentControl.pointIndex]  = polygon.points[currentControl.pointIndex];
    //   return true;
    // } 
    polygon.points[currentControl.pointIndex] = finalPointPosition;
    return true;
  };
  
  getObjectSizeWithStroke = (object) => {
    var stroke = new fabric.Point(
      object.strokeUniform ? 1 / object.scaleX : 1,
      object.strokeUniform ? 1 / object.scaleY : 1
    ).multiply(object.strokeWidth);
    return new fabric.Point(object.width + stroke.x, object.height + stroke.y);
  };

  checkForMinDistance = (polygon, props) =>{
    const minArea = 100;
    let totalArea = geometric.polygonArea(this.getPolygonCoords(polygon))
    if (totalArea < minArea) {
        if(props)
        props.setSelected(polygon, true);
        return false;
    }
    return true;
  }

  getboudaryCoords = () =>{
    let canvas = this._canvas;
    let cords = {};
    cords["width"] = canvas.getWidth();
    cords["height"] = canvas.getHeight();
    cords["left"] = 0;
    cords["top"] = 0;
    cords["scaleX"] = 1;
    cords["scaleY"] = 1;
    return cords;
  }

  getPolygonCoords =(obj) => {
    const coords = [];
    for (let i = 0; i < obj.points.length; i++) {
      const point = obj.points[i];
      const x = point.x;
      const y = point.y;
      coords.push([x, y]);
    }
    return coords;
  }

}

export default Polygon;
