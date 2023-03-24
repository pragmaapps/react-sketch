/*eslint no-unused-vars: 0*/

import FabricCanvasTool from './fabrictool'
import {linearDistance} from './utils';

const fabric = require('fabric').fabric;

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
    // canvas.forEachObject((o) => o.selectable = o.evented = false);
    this._width = props.lineWidth;
    this._color = props.lineColor;
    this._fill = props.fillColor;
    this.count = 1;

  }

  Point(x, y) {
    this.x = x;
    this.y = y;
  }


  doMouseDown(options, props) {
    if (this.drawMode) {
          let canvas = this._canvas;
          let roiTypes = ['rect','ellipse','polygon']; 
          let objects = canvas.getObjects();
          objects = objects.filter(object => object.id !== undefined && roiTypes.includes(object.type))
          if(objects.length >= 5){
            const { notificationShow } = props;
            notificationShow();
            console.log(`%c[ROI]%c , maximum 5 roi shapes allowed `, "color:blue; font-weight:bold;", "color:black;");
            return ;
          }
      if (options.target && options.target.id === this.pointArray[0].id) {
          // when click on the first point
            this.generatePolygon(this.pointArray);
      } else {
            this.addPoint(options);
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

  addPoint = (options) => {
    let canvas = this._canvas;
    const pointOption = {
        id: new Date().getTime(),
        radius: 5,
        fill: '#ffffff',
        stroke: '#333333',
        strokeWidth: 0.5,
        left: options.e.layerX / canvas.getZoom(),
        top: options.e.layerY / canvas.getZoom(),
        selectable: false,
        hasBorders: false,
        hasControls: false,
        originX: 'center',
        originY: 'center',
        objectCaching: false,
    };
    const point = new fabric.Circle(pointOption);

    if (this.pointArray.length === 0) {
        // fill first point with red color
        point.set({
            fill: 'red'
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
        fill: '#999999',
        stroke: '#999999',
        originX: 'center',
        originY: 'center',
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false,
        objectCaching: false,
    };
    const line = new fabric.Line(linePoints, lineOption);
    line.class = 'line';

    if (this.activeShape) {
        const pos = canvas.getPointer(options.e);
        const points = this.activeShape.get('points');
        points.push({
            x: pos.x,
            y: pos.y
        });
        const polygon = new fabric.Polygon(points, {
            stroke: '#333333',
            strokeWidth: 1,
            fill: '#cccccc',
            opacity: 0.3,
            selectable: false,
            hasBorders: false,
            hasControls: false,
            evented: false,
            objectCaching: false,
        });
        canvas.remove(this.activeShape);
        canvas.add(polygon);
        this.activeShape = polygon;
        canvas.renderAll();
    } else {
        const polyPoint = [{
            x: options.e.layerX / canvas.getZoom(),
            y: options.e.layerY / canvas.getZoom(),
        }, ];
        const polygon = new fabric.Polygon(polyPoint, {
            stroke: '#333333',
            strokeWidth: 1,
            fill: '#cccccc',
            opacity: 0.3,
            selectable: false,
            hasBorders: false,
            hasControls: false,
            evented: false,
            objectCaching: false,
        });
        this.activeShape = polygon;
        canvas.add(polygon);
    }

    this.activeLine = line;
    this.pointArray.push(point);
    this.lineArray.push(line);

    canvas.add(line);
    canvas.add(point);
}

  doMouseMove(options) {
    if (!this.isDown) return;
    let canvas = this._canvas;
    if (this.isDragging) {
      var e = options.e;
      let obj = e.target;
      if(obj.height > obj.canvas.height || obj.width > obj.canvas.width){
        return;
      } 
      this.viewportTransform[4] += e.clientX - this.lastPosX;
        this.viewportTransform[5] += e.clientY - this.lastPosY;
        canvas.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
    } 
    if (this.drawMode) {
        if (this.activeLine && this.activeLine.class === 'line') {
            const pointer = this.canvas.getPointer(options.e);
            this.activeLine.set({
                x2: pointer.x,
                y2: pointer.y
            });
            const points = this.activeShape.get('points');
            points[pointArray.length] = {
                x: pointer.x,
                y: pointer.y,
            };
            this.activeShape.set({
                points
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
    const { onShapeAdded } = props;
    onShapeAdded();
  }

  generatePolygon = (pointArray) => {
    let canvas = this._canvas;
    let objects = canvas.getObjects();
    let roiTypes = ['rect','ellipse','polygon']; 
    let findIdForObject = objects.filter(object => object.id !== undefined && roiTypes.includes(object.type));
    let name = `ROI#${findIdForObject.length + 1}`;
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

    // // remove selected Shape and Line 
    canvas.remove(this.activeShape).remove(this.activeLine);

    // create polygon from collected points
    const polygon = new fabric.Polygon(points, {
        id: new Date().getTime(),
        fill: this._fill,
        objectCaching: false,
        moveable: false,
        strokeWidth: this._width,
        stroke: this._color,
        transparentCorners: false,
        // cornerColor: 'blue',
        centeredRotation: false,
        centeredScaling: false,
        perPixelTargetFind: true,
        name: name,
        selectable: false,
        evented: false
    });
    // if(this.count === 1){
      canvas.add(polygon);
      this.toggleDrawPolygon();
      this.editPolygon(polygon);
    // }
    // this.count = 2;
}

toggleDrawPolygon = () => {
  let canvas = this._canvas;
  if (this.drawMode) {
      // stop draw mode
      this.activeLine = null;
      this.activeShape = null;
      this.lineArray = [];
      this.pointArray = [];
      this.canvas.selection = true;
      this.drawMode = false;
  } else {
      // start draw mode
      canvas.selection = false;
      this.drawMode = true;
  }
}

editPolygon = (polygon) => {
  let canvas = this._canvas;
  let activeObject = canvas.getActiveObject();
  if (!activeObject) {
      activeObject = polygon;
      canvas.setActiveObject(activeObject);
  }

  activeObject.edit = true;
  activeObject.objectCaching = false;

  const lastControl = activeObject.points.length - 1;
  activeObject.cornerStyle = 'circle';
  activeObject.controls = activeObject.points.reduce((acc, point, index) => {
    // this.pointIndex = index;
    acc['p' + index] = new fabric.Control({
      pointIndex: index,
      positionHandler: (dim, finalMatrix, fabricObject) =>{
        const transformPoint = {
          x: fabricObject.points[index].x - fabricObject.pathOffset.x,
          y: fabricObject.points[index].y - fabricObject.pathOffset.y,
          };
          return fabric.util.transformPoint(transformPoint, fabricObject.calcTransformMatrix());
      },
      actionHandler: this.anchorWrapper(index > 0 ? index - 1 : lastControl, this.actionHandler),
      actionName: 'modifyPolygon'
    });
    return acc;
  }, {});

  activeObject.hasBorders = false;

  canvas.requestRenderAll();
  
}

polygonPositionHandler = (dim, finalMatrix, fabricObject) => {
  const transformPoint = {
      x: fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x,
      y: fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y,
  };
  return fabric.util.transformPoint(transformPoint, fabricObject.calcTransformMatrix());
}

anchorWrapper = (anchorIndex, fn) => {
  return (eventData, transform, x, y) => {
      const fabricObject = transform.target;
      const point = {
          x: fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
          y: fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y,
      };

      // update the transform border
      fabricObject._setPositionDimensions({});

      // Now newX and newY represent the point position with a range from
      // -0.5 to 0.5 for X and Y.
      const newX = point.x / fabricObject.width;
      const newY = point.y / fabricObject.height;

      // Fabric supports numeric origins for objects with a range from 0 to 1.
      // This let us use the relative position as an origin to translate the old absolutePoint.
      const absolutePoint = fabric.util.transformPoint(point, fabricObject.calcTransformMatrix());
      fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);

      // action performed
      return fn(eventData, transform, x, y);
  };
}

actionHandler = (eventData, transform, x, y) => {
  const polygon = transform.target;
  const currentControl = polygon.controls[polygon.__corner];
  const mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center');
  const size = polygon._getTransformedDimensions(0, 0);
  const finalPointPosition = {
      x: (mouseLocalPosition.x * polygon.width) / size.x + polygon.pathOffset.x,
      y: (mouseLocalPosition.y * polygon.height) / size.y + polygon.pathOffset.y,
  };
  polygon.points[currentControl.pointIndex] = finalPointPosition;
  return true;
}
}

export default Polygon;