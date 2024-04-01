import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import History from './history'
import { uuid4 } from './utils'
import Select from './select'
import Pencil from './pencil'
import Line from './line'
import Arrow from './arrow'
import Rectangle from './rectangle'
import Circle from './circle'
import Pan from './pan'
import Tool from './tools'
import RectangleLabel from './rectangle-label'
import DefaultTool from './defaul-tool'
import ReactResizeDetector from 'react-resize-detector'
import NvistaRoiSettings from './NvistaRoiSettingsPanel'
import Ellipse from './ellipse'
import Polygon from './polygon'
import FreeDrawLine from './freedrawline';
const geometric = require("geometric");
import { isInside, getOverlapPoints, getOverlapSize, getOverlapAreas } from "overlap-area";

let fabric = require('fabric').fabric;
let controlsVisible = {
  mtr: false,
};
let executeCanvasResize = false;
fabric.Object.prototype.noScaleCache = false;
//fabric.Object.prototype.setControlsVisibility(controlsVisible);
var svgData = '<svg xmlns="http://www.w3.org/2000/svg" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-uqopch" viewBox="0 0 24 24" focusable="false" aria-hidden="true" data-testid="Rotate90DegreesCwIcon"><path fill="red" d="M4.64 19.37c3.03 3.03 7.67 3.44 11.15 1.25l-1.46-1.46c-2.66 1.43-6.04 1.03-8.28-1.21-2.73-2.73-2.73-7.17 0-9.9C7.42 6.69 9.21 6.03 11 6.03V9l4-4-4-4v3.01c-2.3 0-4.61.87-6.36 2.63-3.52 3.51-3.52 9.21 0 12.73zM11 13l6 6 6-6-6-6-6 6z"></path></svg>';

var rotateIcon = 'data:image/svg+xml,' + encodeURIComponent(svgData);
var img = document.createElement('img');
img.src = rotateIcon;

// here's where your custom rotation control is defined
// by changing the values you can customize the location, size, look, and behavior of the control
fabric.Object.prototype.controls.mtr = new fabric.Control({
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

// here's where the render action for the control is defined
function renderIcon(ctx, left, top, styleOverride, fabricObject) {
  var size = this.cornerSize;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
}

fabric.Object.prototype.set({
  cornerSize: 6,
  cornerColor : 'red',
  cornerStyle : 'circle',
  strokeUniform: true,
});
fabric.Object.NUM_FRACTION_DIGITS = 17;

/**
 * Sketch Tool based on FabricJS for React Applications
 */
class NvisionSketchField extends PureComponent {
  static propTypes = {
    // the color of the line
    lineColor: PropTypes.string,
    // The width of the line
    lineWidth: PropTypes.number,
    // the fill color of the shape when applicable
    fillColor: PropTypes.string,
    // the background color of the sketch
    backgroundColor: PropTypes.string,
    // the opacity of the object
    opacity: PropTypes.number,
    // number of undo/redo steps to maintain
    undoSteps: PropTypes.number,
    // The tool to use, can be pencil, rectangle, circle, brush;
    tool: PropTypes.string,
    // image format when calling toDataURL
    imageFormat: PropTypes.string,
    // Sketch data for controlling sketch from
    // outside the component
    value: PropTypes.object,
    // Set to true if you wish to force load the given value, even if it is the same
    forceValue: PropTypes.bool,
    // Specify some width correction which will be applied on auto resize
    widthCorrection: PropTypes.number,
    // Specify some height correction which will be applied on auto resize
    heightCorrection: PropTypes.number,
    // Specify action on change
    onChange: PropTypes.func,
    // Default initial value
    defaultValue: PropTypes.object,
    // Sketch width
    width: PropTypes.number,
    // Sketch height
    height: PropTypes.number,
    // event object added
    onObjectAdded: PropTypes.func,
    // event object modified
    onObjectModified: PropTypes.func,
    // event object removed
    onObjectRemoved: PropTypes.func,
    // event mouse down
    onMouseDown: PropTypes.func,
    // event mouse move
    onMouseMove: PropTypes.func,
    // event mouse up
    onMouseUp: PropTypes.func,
    // event mouse out
    onMouseOut: PropTypes.func,
    // event object move
    onObjectMoving: PropTypes.func,
    // event object scale
    onObjectScaling: PropTypes.func,
    // event object rotating
    onObjectRotating: PropTypes.func,
    // Class name to pass to container div of canvas
    className: PropTypes.string,
    // Style options to pass to container div of canvas
    style: PropTypes.object,

    //add image
    image: PropTypes.string,
    //resize
    callResize: PropTypes.bool
  }

  static defaultProps = {
    lineColor: 'black',
    lineWidth: 10,
    fillColor: 'transparent',
    backgroundColor: 'transparent',
    opacity: 1.0,
    undoSteps: 25,
    tool: null,
    widthCorrection: 0,
    heightCorrection: 0,
    forceValue: false,
    image: null,
    callResize: false,
    onObjectAdded: () => null,
    onObjectModified: () => null,
    onObjectRemoved: () => null,
    onMouseDown: () => null,
    onMouseMove: () => null,
    onMouseUp: () => null,
    onMouseOut: () => null,
    onObjectMoving: () => null,
    onObjectScaling: () => null,
    onObjectRotating: () => null
  }

  state = {
    parentWidth: 550,
    action: true,
    imageUrl: null,
    scaleFactor: 1,
    rotation: 0,
    flipApplied: false,
    crosshairMode: false,
    crosshairMoveMode: false,
    crosshairDeleteMode: false,
    deleteAllLandmarks: false,
    resetAllLandmarks: false,
    frontEnd: [],
    canvasHeight:512,
    canvasWidth:800,
    strokeWidth:2,
    updateLandmarksForOtherWindow: false,
    scaleHeightMultiplier: 1,
    scaleMultiplier: 1,
    lmColorUsed: ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000'],
    resolutionHeight: 1080,
    resolutionWidth: 1920
  }

  _fc = null
  childRef = React.createRef();
  left1 = 0;
  top1 = 0 ;
  scale1x = 0 ;    
  scale1y = 0 ;    
  width1 = 0 ;    
  height1 = 0 ;
  angle1=0;

  _initTools = fabricCanvas => {
    this._tools = {}
    this._tools[Tool.Select] = new Select(fabricCanvas)
    this._tools[Tool.Pencil] = new Pencil(fabricCanvas)
    this._tools[Tool.Line] = new Line(fabricCanvas)
    this._tools[Tool.Arrow] = new Arrow(fabricCanvas)
    this._tools[Tool.Rectangle] = new Rectangle(fabricCanvas)
    this._tools[Tool.RectangleLabel] = new RectangleLabel(fabricCanvas)
    this._tools[Tool.Circle] = new Circle(fabricCanvas)
    this._tools[Tool.Pan] = new Pan(fabricCanvas)
    this._tools[Tool.DefaultTool] = new DefaultTool(fabricCanvas)
    this._tools[Tool.Ellipse] = new Ellipse(fabricCanvas)
    this._tools[Tool.Polygon] = new Polygon(fabricCanvas)
    this._tools[Tool.FreeDrawLine] = new FreeDrawLine(fabricCanvas)
  }

  /**
  * Enable touch Scrolling on Canvas
  */
  enableTouchScroll = () => {
    let canvas = this._fc
    if (canvas.allowTouchScrolling) return
    canvas.allowTouchScrolling = true
  }

  /**
  * Disable touch Scrolling on Canvas
  */
  disableTouchScroll = () => {
    let canvas = this._fc
    if (canvas.allowTouchScrolling) {
      canvas.allowTouchScrolling = false
    }
  }

  /**
  * Add an image as object to the canvas
  *
  * @param dataUrl the image url or Data Url
  * @param options object to pass and change some options when loading image, the format of the object is:
  *
  * {
  * left: <Number: distance from left of canvas>,
  * top: <Number: distance from top of canvas>,
  * scale: <Number: initial scale of image>
  * }
  */
  addImg = (dataUrl, options = {}) => {
    let canvas = this._fc
    // canvas.clear();
    // let canvas = this._fc = new fabric.Canvas("roi-canvas", { centeredRotation: true, centeredScaling: true });
    canvas.clear()
    this._resize()
    fabric.Image.fromURL(dataUrl, oImg => {
      let widthFactor = canvas.getWidth() / oImg.width

      let heightFactor = canvas.getHeight() / oImg.height

      let scaleFactor = Math.min(widthFactor, heightFactor)

      oImg.set({
        //width:window.canvas.getWidth(),
        //height:window.canvas.getHeight(),
        selectable: false,
        hasControls: false,
        hasBorders: false,
        hasRotatingPoint: false
      })

      // let opts = {
      // left: Math.random() * (canvas.getWidth() - oImg.width * 0.5),
      // top: Math.random() * (canvas.getHeight() - oImg.height * 0.5),
      // scale: 0.5
      // };
      // Object.assign(opts, options);
      oImg.scale(scaleFactor)
      // oImg.set({
      // 'left': opts.left,
      // 'top': opts.top
      // });
      canvas.add(oImg)
      this.setState({
        scaleFactor: scaleFactor
      })
      canvas.renderAll()
    })
    // if (this.state.rotation > 0) {
    // setTimeout(() => {
    // this.rotateAndScale(this._fc.item(0), -this.state.rotation, this._fc, this.state.scaleFactor);
    // canvas.renderAll();
    // }, 100);
    // }
  }

  /**
  * Action when an object is added to the canvas
  */
  _onObjectAdded = e => {
    const { onObjectAdded } = this.props
    if (!this.state.action) {
      this.setState({ action: true })
      return
    }
    let obj = e.target;
    if(obj.id === "trackingArea"){
      this.left1 =obj.left;
      this.top1 =obj.top;
      this.scale1x = obj.scaleX;
      this.scale1y=obj.scaleY;
      this.width1=obj.width;
      this.height1=obj.height;
    }
    // obj.__version = 1
    // // record current object state as json and save as originalState
    // let objState = obj.toJSON()
    // obj.__originalState = objState
    // let state = JSON.stringify(objState)
    // object, previous state, current state
    // this._history.keep([obj, state, state])
    onObjectAdded(e)
  }

  /**
  * Action when an object is moving around inside the canvas
  */
  _onObjectMoving = e => {
    const { onObjectMoving } = this.props;
    let obj = e.target;
    let roiTypes = ["rect", "ellipse", "polygon"];
    let boundary = this.getboudaryCoords();
    var brNew = obj.getBoundingRect();
    if (boundary && ((brNew.height +brNew.top) > (boundary.height * boundary.scaleY) + boundary.top  || (brNew.width +brNew.left) > (boundary.width * boundary.scaleX) + boundary.left  || brNew.left < boundary.left || brNew.top < boundary.top)) return;
    if(obj.id !== "trackingArea" && roiTypes.includes(obj.type)){
      this.left1 =obj.left;
      this.top1 =obj.top;
      this.scale1x = obj.scaleX;
      this.scale1y=obj.scaleY;
      this.width1=obj.width;
      this.height1=obj.height;
    }
    onObjectMoving(e)
  }

  getboudaryCoords = () =>{
    let canvas = this._fc;
    let cords = {};
    cords["width"] = canvas.getWidth();
    cords["height"] = canvas.getHeight();
    cords["left"] = 0;
    cords["top"] = 0;
    cords["scaleX"] = 1;
    cords["scaleY"] = 1;
    return cords;
  }
  /**
  * Action when an object is scaling inside the canvas
  */
  _onObjectScaling = e => {
    const { onObjectScaling } = this.props;
    var obj = e.target;
    obj.setCoords();
    var brNew = obj.getBoundingRect();
    let canvas = this._fc;
    if(obj.id !== "trackingArea"){
      let boundary = this.getboudaryCoords();
      let pointer = canvas.getPointer(e.e)
      if (boundary && ((brNew.height +brNew.top) > (boundary.height * boundary.scaleY) + boundary.top  || (brNew.width +brNew.left) > (boundary.width * boundary.scaleX) + boundary.left  || brNew.left < boundary.left || brNew.top < boundary.top)) {
        obj.left = this.left1;
        obj.top=this.top1;
        obj.scaleX=this.scale1x;
        obj.scaleY=this.scale1y;
        obj.width=this.width1;
        obj.height=this.height1;
      }else if(!this.checkForMinTotalArea(obj, "edit")){
        console.log("[nVision Sketch Field] [On Object Scaling] The zone size should not be less than 100px of the total area.","color:blue; font-weight: bold;",
        "color: black;");
        obj.left = this.left1;
        obj.top=this.top1;
        obj.scaleX=this.scale1x;
        obj.scaleY=this.scale1y;
        obj.width=this.width1;
        obj.height=this.height1;
      }else{   
          this.left1 =obj.left;
          this.top1 =obj.top;
          this.scale1x = obj.scaleX;
          this.scale1y=obj.scaleY;
          this.width1=obj.width;
          this.height1=obj.height;
        }
      return;
    }

    
    brNew = obj;
    if ((((brNew.width * brNew.scaleX) + brNew.left) > canvas.getWidth() -1 ) || (((brNew.height * brNew.scaleY) + brNew.top) > canvas.getHeight() - 1) || ((brNew.left<0) || (brNew.top<0))) {
    obj.left = this.left1 <= 0 ? obj.left : this.left1;
    obj.top=this.top1 <= 0 ? obj.top : this.top1;
    obj.scaleX=this.scale1x === 0 ? obj.scaleX : this.scale1x;
    obj.scaleY=this.scale1y === 0 ? obj.scaleY : this.scale1y;
    obj.width=this.width1 === 0 ? obj.width : this.width1;
    obj.height=this.height1 === 0 ? obj.height : this.height1;
    obj.setCoords();
  }else if(!this.checkForMinTotalArea(obj, "edit", true)){
    console.log("[nVision Sketch Field] [On Object Scaling] The tracking area should not be less than 200px width and height respectively.","color:blue; font-weight: bold;",
    "color: black;");
    obj.left = this.left1;
    obj.top=this.top1;
    obj.scaleX=this.scale1x;
    obj.scaleY=this.scale1y;
    obj.width=this.width1;
    obj.height=this.height1;
  }
    else{    
      this.left1 =obj.left;
      this.top1 =obj.top;
      this.scale1x = obj.scaleX;
      this.scale1y=obj.scaleY;
      this.width1=obj.width;
      this.height1=obj.height;
    }

    onObjectScaling(e)
  }

  /**
  * Action when an object is rotating inside the canvas
  */
  _onObjectRotating = e => {
    const { onObjectRotating } = this.props;
    let roiTypes = ["rect", "ellipse", "polygon"];
    var obj = e.target;
    obj.setCoords();
    var brNew = obj.getBoundingRect();
    if(obj.id !== "trackingArea" && roiTypes.includes(obj.type)){
      let boundary = this.getboudaryCoords();
      if (boundary && ((brNew.height +brNew.top) > (boundary.height * boundary.scaleY) + boundary.top  || (brNew.width +brNew.left) > (boundary.width * boundary.scaleX) + boundary.left  || brNew.left < boundary.left || brNew.top < boundary.top)) {
        obj.angle = this.angle1;
        obj.left = this.left1;
        obj.top=this.top1;
        obj.scaleX=this.scale1x;
        obj.scaleY=this.scale1y;
        obj.width=this.width1;
        obj.height=this.height1;
      }else{  
        this.angle1 = obj.angle;
        this.left1 =obj.left;
        this.top1 =obj.top;
        this.scale1x = obj.scaleX;
        this.scale1y=obj.scaleY;
        this.width1=obj.width;
        this.height1=obj.height;
        }
      return;
    }
    onObjectRotating(e)
  }

  _onObjectModified = e => {
    let obj = e.target;
    let boundaryObj = this.getboudaryCoords();   
    var canvasTL = new fabric.Point(boundaryObj.left, boundaryObj.top);
    var canvasBR = new fabric.Point(boundaryObj.left + (boundaryObj.width * boundaryObj.scaleX) , (boundaryObj.height * boundaryObj.scaleY) + boundaryObj.top);
    if (!obj.isContainedWithinRect(canvasTL, canvasBR, true, true)) {
      var vertices = obj.getCoords(); // Get the transformed vertices
    
      // Define the boundaries
      var boundaryLeft = canvasTL.x;
      var boundaryTop = canvasTL.y;
      var boundaryRight = canvasBR.x;
      var boundaryBottom = canvasBR.y;
    
      var leftAdjustment = 0;
      var topAdjustment = 0;
      var rightAdjustment = 0;
      var bottomAdjustment = 0;
    
      // Check each vertex
      vertices.forEach(function (vertex) {
        if (vertex.x < boundaryLeft) {
          leftAdjustment = Math.max(leftAdjustment, boundaryLeft - vertex.x);
        }
        if (vertex.x > boundaryRight) {
          rightAdjustment = Math.max(rightAdjustment, vertex.x - boundaryRight);
        }
        if (vertex.y < boundaryTop) {
          topAdjustment = Math.max(topAdjustment, boundaryTop - vertex.y);
        }
        if (vertex.y > boundaryBottom) {
          bottomAdjustment = Math.max(bottomAdjustment, vertex.y - boundaryBottom);
        }
      });
    
      // Apply adjustments to the object's position
      var newLeft = obj.left + leftAdjustment - rightAdjustment;
      var newTop = obj.top + topAdjustment - bottomAdjustment;
    
      obj.set({
        left: newLeft,
        top: newTop
      });
    
      obj.setCoords();
      this._fc.renderAll();
    }
    
    
    
    
    obj.setCoords();
    this.checkForOverlap(obj);
    obj.__version += 1
    let prevState = JSON.stringify(obj.__originalState)
    let objState = obj.toJSON()
    // record current object state as json and update to originalState
    obj.__originalState = objState
    let currState = JSON.stringify(objState)
    // this._history.keep([obj, prevState, currState]);
  }

  trackingAreaModified = (obj) =>{    
    let canvas = this._fc;
    var canvasTL = new fabric.Point(0, 0);
    var canvasBR = new fabric.Point(canvas.getWidth() -1, canvas.getHeight() -1);
    if (!obj.isContainedWithinRect(canvasTL, canvasBR, true, true)) {
      console.log("%c[nVision Sketch Field]%c [Traking Area] Modified outside the canvas","color:blue; font-weight: bold;",
      "color: black;",obj);
      var objBounds = obj.getBoundingRect();
      obj.setCoords();
      var objTL = obj.getPointByOrigin("left", "top");
      var left = objTL.x;
      var top = objTL.y;

      if (objBounds.left < canvasTL.x) left = 0;
      if (objBounds.top < canvasTL.y) top = 0;
      if ((objBounds.top + objBounds.height) > canvasBR.y) top = canvasBR.y - objBounds.height;
      if ((objBounds.left + objBounds.width) > canvasBR.x) left = canvasBR.x - objBounds.width;
      if(top < 0) top = 0;
      if(left < 0) left = 0;
      obj.setPositionByOrigin(new fabric.Point(left, top), "left", "top");
      obj.setCoords();
      this._fc.renderAll();
      // this.checkWithInBoundary();
    }else{
      console.log("%c[nVision Sketch Field]%c [Traking Area] Modified with in canvas","color:blue; font-weight: bold;",
      "color: black;",obj);
      // this.checkWithInBoundary();
    }
  }

  checkForOverlap = (overlappedObj) =>{
      const { onOverlap } = this.props;
      let canvas = this._fc;
      let allowedtypes = ["rect", "polygon", "ellipse"];
      var objects = canvas.getObjects().filter(ob => allowedtypes.includes(ob.type));
      let isOveralaping = false;
      var lastObject = overlappedObj === undefined ? objects[objects.length - 1] : overlappedObj;
      lastObject !== undefined ? lastObject.setCoords() : "";
      for (var i = 0; i < objects.length; i++) {
        objects[i].setCoords();
        if(lastObject !== objects[i] && (lastObject.intersectsWithObject(objects[i]) || objects[i].intersectsWithObject(lastObject))){
          if(this.areShapesOverlapping(lastObject, objects[i]) || this.areShapesOverlapping(objects[i], lastObject)){
            isOveralaping = true;
            // canvas.remove(lastObject);
            // lastObject.set({"stroke":"yellow"});
            onOverlap();
            console.log("%c[nVision Sketch Field]%c Deleted overlapped zone","color:blue; font-weight: bold;",
            "color: black;",lastObject, "overlapped with", objects[i]);
            break;
          }
        }
        lastObject.set({"stroke":"black"});
      }
      canvas.renderAll();
      return isOveralaping;
  }

  downloadAsImage = (filename = 'canvas-image.png') => {
    let canvas = this._fc;
    const imageDataUrl = canvas.toDataURL({ format: 'png' });
    const downloadLink = document.createElement('a');
    downloadLink.href = imageDataUrl;
    downloadLink.download = filename;
    downloadLink.click();
  }

  downloadCanvasDataAsJson = (filename = 'canvas-data.json') => {
    let canvas = this._fc;
    const objects = canvas.getObjects().map(object => object.toJSON());
    const jsonData = { objects };
    const jsonString = JSON.stringify(jsonData, null, 2);
    const downloadLink = document.createElement('a');
    downloadLink.href = `data:application/json;charset=utf-8,${encodeURIComponent(jsonString)}`;
    downloadLink.download = filename;
    downloadLink.click();
  }

  checkForMinTotalArea = (obj="",from="") =>{
      let canvas = this._fc;
      let canvasObject = canvas.getObjects();
      if(!canvasObject.length) return true;
      if(obj === ""){
        obj = canvasObject[canvasObject.length-1];
      }
      if(obj.type === "rect"){
        const objHeight = obj.height * obj.scaleY;
        const objWidth = obj.width * obj.scaleX;
        const minTotalArea = 100;
        let area = objHeight  * objWidth;
        if (area < minTotalArea) {
          if(from !== "edit")
           canvas.remove(obj);
          return false;
        }
      }
      if(obj.type === "ellipse"){
        const objRx = obj.rx * obj.scaleX;
        const objRy = obj.ry * obj.scaleY;
        const minTotalArea = 100;
        let area = objRx * objRy * 3.14;
        if (area < minTotalArea) {
          if(from !== "edit")
          canvas.remove(obj);
          return false;
        }
      }

      if(obj.type === "polygon"){
        const minArea = 100;
        let totalArea = geometric.polygonArea(this.getPolygonCoords(obj))
        if (totalArea < minArea) {
            if(from !== "polygon")
            canvas.remove(obj);
            return false;
        }
        return true;
      }
      return true;
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

  getCenterPoint = (obj) => {
    let selectedObj = this._fc.getObjects().find(ob => ob.defaultName === obj.defaultName);
    if(selectedObj){
      return selectedObj.getCenterPoint();
    }
    return obj.centerPoint;
  }

  areShapesOverlapping = (obj1, obj2) => {
    let allowedtypes = ["rect", "polygon", "ellipse"];
    if(!allowedtypes.includes(obj1.type) || !allowedtypes.includes(obj2.type)) return false;
    let shape1Points = this.convertShapeToPolygon(obj1);
    let shape2Points = this.convertShapeToPolygon(obj2);
    console.log(getOverlapAreas(shape1Points,shape2Points).length > 0,"isOverlap");
    let isOverlap = getOverlapAreas(shape1Points,shape2Points).length > 0 ? true : false;
    return isOverlap;
  }

  generateEllipsePoints = (ellipse) => {
    const points = [];
    const center = ellipse.getCenterPoint();
    const radiusX = ellipse.rx * ellipse.scaleX;
    const radiusY = ellipse.ry * ellipse.scaleY;
    const angle = ellipse.angle * (Math.PI / 180); // Convert angle to radians
    const numPoints = 32; // Adjust as needed
    for (let i = 0; i < numPoints; i++) {
        const angleIncrement = (i / numPoints) * 2 * Math.PI;
        const x = center.x + radiusX * Math.cos(angleIncrement);
        const y = center.y + radiusY * Math.sin(angleIncrement);
        points.push({x, y})
    }
  
    // Rotate all points
    const rotatedPoints = []
    points.map(point => {
        const rotatedX = center.x + (point.x - center.x) * Math.cos(angle) - (point.y - center.y) * Math.sin(angle);
        const rotatedY = center.y + (point.x - center.x) * Math.sin(angle) + (point.y - center.y) * Math.cos(angle);
        rotatedPoints.push([rotatedX,rotatedY]);
    });
    return rotatedPoints;
  };

  convertShapeToPolygon = (shape) => {
    switch (shape.type) {
      case 'rect':
        const x1 = shape.oCoords.tl.x;
        const y1 = shape.oCoords.tl.y;
        const x2 = shape.oCoords.tr.x;
        const y2 = shape.oCoords.tr.y;
        const x3 = shape.oCoords.br.x;
        const y3 = shape.oCoords.br.y;
        const x4 = shape.oCoords.bl.x;
        const y4 = shape.oCoords.bl.y;
  
        return [[x1,y1],[x2,y2],[x3,y3],[x4,y4]];
  
      case 'ellipse':
        return this.generateEllipsePoints(shape);
  
        case 'polygon':
          let points = []
          Object.keys(shape.oCoords).map(p => {
            if(p !== "mtr"){
              let tempObj = JSON.parse(JSON.stringify(shape.oCoords[p]));
              let obj = [
                tempObj.x, 
                tempObj.y
              ];
              points.push(obj);
            }
          });
          return points;
    
  
      default:
        throw new Error(`Unknown shape type: ${shape.type}`);
    }
  }

  removeUnCompletedShapes = () =>{
    let canvas = this._fc; 
    let roiTypes = ["rect", "ellipse", "polygon"];
    canvas.getObjects().forEach((shape) => {
      if(shape.id !== "calibratedLine" && !roiTypes.includes(shape.type)) 
        canvas.remove(shape);
    });   
    canvas.renderAll();
  }

  checkForMinDistance = (polygon) =>{
    const points = polygon.points;
    const minDistance = 10;
    let distance;
    for (let i = 0; i < points.length - 1; i++) {
      distance = Math.sqrt(
        Math.pow(points[i + 1].x - points[i].x, 2) +
        Math.pow(points[i + 1].y - points[i].y, 2)
      );
      if (distance < minDistance) {
          return true;
      }
    }
    return false;
  }

  /**
  * Action when an object is removed from the canvas
  */
  _onObjectRemoved = e => {
    const { onObjectRemoved } = this.props
    let obj = e.target
    if (obj.__removed) {
      obj.__version += 1
      return
    }
    obj.__version = 0
    onObjectRemoved(e)
  }

  /**
  * Action when the mouse button is pressed down
  */
  _onMouseDown = e => {
    const { onMouseDown } = this.props
    this._selectedTool.doMouseDown(e, this.props, this)
    onMouseDown(e)
  }

  /**
  * Action when the mouse cursor is moving around within the canvas
  */
  _onMouseMove = e => {
    const { onMouseMove } = this.props
    this._selectedTool.doMouseMove(e, this.props, this)
    onMouseMove(e)
  }

  /**
  * Action when the mouse cursor is moving out from the canvas
  */
  _onMouseOut = e => {
    const { onMouseOut } = this.props
    this._selectedTool.doMouseOut(e)
    if (this.props.onChange) {
      let onChange = this.props.onChange
      setTimeout(() => {
        onChange(e.e)
      }, 10)
    }
    onMouseOut(e)
  }

  _onMouseUp = e => {
    const { onMouseUp } = this.props
    this._selectedTool.doMouseUp(e, this.props, this)
    // Update the final state to new-generated object
    // Ignore Path object since it would be created after mouseUp
    // Assumed the last object in canvas.getObjects() in the newest object
    if (this.props.tool !== Tool.Pencil) {
      const canvas = this._fc
      const objects = canvas.getObjects()
      const newObj = objects[objects.length - 1]
      if (newObj && newObj.__version === 1) {
        newObj.__originalState = newObj.toJSON()
      }
    }
    if (this.props.onChange) {
      let onChange = this.props.onChange
      setTimeout(() => {
        onChange(e.e)
      }, 10)
    }
    onMouseUp(e)
  }

  /**
  * Track the resize of the window and update our state
  *
  * @param e the resize event
  * @private
  */

  getOverlayDimensions  = () => {
    let canvas = this._fc;
    const { resolutionHeight, resolutionWidth } = this.state;
    if (canvas && canvas.upperCanvasEl) {
      var overlayWidth = document.getElementById("onep-twop-container-2").offsetWidth;
    }
    else {
      var overlayWidth = document.getElementById("oneptwop-container").offsetWidth;
    }
    let resolutionRatio = resolutionWidth / resolutionHeight;
    if(resolutionHeight === 1080 && resolutionWidth === 1920){
      var overlayHeight = Math.ceil(resolutionHeight / (resolutionWidth / overlayWidth));
    }else{
      //var overlayHeight = Math.ceil(document.getElementById("video-container-3").offsetHeight);
      //var overlayWidth = overlayHeight * resolutionRatio;
      var overlayHeight = document.getElementById("video-container-3").offsetHeight;
      var overlayWidth = Math.ceil(resolutionWidth / (resolutionHeight / overlayHeight));
    }
    console.log('[nVision Sketch Field][Tracking Area] Canvas Overlay Width:', overlayWidth, overlayHeight);
    return { overlayWidth: overlayWidth,overlayHeight: overlayHeight }
  }

  _resize = (e, canvasWidth = null, canvasHeight = null) => {
    let {overlayWidth, overlayHeight} = this.getOverlayDimensions();
    this.getCanvasAtResoution(overlayWidth, overlayHeight, false);
  };


  resizeOverlayAndCanvasOnCompoentMount = (e, canvasWidth = null, canvasHeight = null) => {
    let {overlayWidth, overlayHeight} = this.getOverlayDimensions();
    this.getCanvasAtComponentMount(overlayWidth, overlayHeight, false);
  };

  getCanvasAtResoution = (newWidth, newHeight, scaleLandmarks = false) => {
    let canvas = this._fc;
    let cWidth =  canvas.getWidth();
    let cHeight = canvas.getHeight();
    if(this.state.resolutionHeight === 1080 && this.state.resolutionWidth === 1920){
      //cHeight = canvas.getHeight() - this.state.strokeWidth;
    }
    console.log("[nVision Sketch Field][Sketch Field][getCanvasAtResoution]: Overlay container new width and new height", newWidth, newHeight );
    console.log("[nVision Sketch Field][Sketch Field][getCanvasAtResoution]: Canvas width and height after removing 2 px", cWidth, cHeight );
    if (canvas && cWidth !== newWidth  && canvas.upperCanvasEl) {
    //if (canvas && canvas.upperCanvasEl) {
      var scaleMultiplier = newWidth / cWidth;
      var scaleHeightMultiplier = newHeight / cHeight;
      var objects = canvas.getObjects();
      for (var i in objects) {
        //objects[i].width = objects[i].width * scaleMultiplier;
        //objects[i].height = objects[i].height * scaleHeightMultiplier;
        objects[i].left = objects[i].left * scaleMultiplier;
        objects[i].top = objects[i].top * scaleMultiplier;
        objects[i].scaleX = objects[i].scaleX * scaleMultiplier;
        objects[i].scaleY = objects[i].scaleY * scaleMultiplier;
        objects[i].cnWidth = Math.round(cWidth * scaleMultiplier);
        objects[i].cnHeight = Math.round(cHeight * scaleHeightMultiplier);
        objects[i].setCoords();
        var scaleFactor = this.state.scaleFactor * scaleMultiplier;
        this.setState({ scaleFactor });
        console.log("[nVision Sketch Field][Sketch Field][getCanvasAtResoution]: object details after resizing", objects[i]);
      }
      console.log("[nVision Sketch Field][Sketch Field][getCanvasAtResoution]: Canvas Dimensions after resize", cHeight * scaleMultiplier, cWidth * scaleHeightMultiplier);
      canvas.discardActiveObject();
      canvas.setWidth(cWidth * scaleMultiplier);
      canvas.setHeight(cHeight * scaleHeightMultiplier);
      canvas.renderAll();
      canvas.calcOffset();
      this.setState({canvasHeight:canvas.height,canvasWidth:canvas.width, scaleHeightMultiplier, scaleMultiplier},()=>{
              });
    }
  }

  scaleObject = (object, scaleMultiplier, scaleHeightMultiplier,cWidth, cHeight, updateCanvasDimensions = false) =>{
    object.left = object.left * scaleMultiplier;
    object.top = object.top * scaleMultiplier;
    object.scaleX = object.scaleX * scaleMultiplier;
    object.scaleY = object.scaleY * scaleMultiplier;
    if(object.type === "polygon"){
      let canvas = this._fc;
      let selectedObject = canvas.getObjects().find(ob => ob.defaultName === object.defaultName);
      if(selectedObject){
        let oCoords = {};
        oCoords = JSON.parse(JSON.stringify(selectedObject.oCoords));
        object.oCoords = oCoords;
      }else{
        let oCoords = {};
        Object.keys(object.oCoords).forEach((key) => {
          oCoords[key] = {
            ...object.oCoords[key],
            x: object.oCoords[key].x * scaleMultiplier,
            y: object.oCoords[key].y * scaleMultiplier,
          };
        });
        object.oCoords = oCoords;
      }
    }
    if(updateCanvasDimensions){
      object.cnWidth = Math.round(cWidth * scaleMultiplier);
      object.cnHeight = Math.round(cHeight * scaleHeightMultiplier);
    }
    return object;
  }


  getCanvasAtComponentMount = (newWidth, newHeight, scaleLandmarks = false) => {
    let canvas = this._fc;
    let cWidth =  canvas.getWidth();
    let cHeight = canvas.getHeight();
    var scaleMultiplier = newWidth / cWidth;
    var scaleHeightMultiplier = newHeight / cHeight;
    console.log("[nVision Sketch Field][getCanvasAtComponentMount][component mount] Resize Canvas Dimensions to: ", cHeight * scaleHeightMultiplier, cWidth * scaleMultiplier);
    canvas.setWidth(cWidth * scaleMultiplier);
    canvas.setHeight(cHeight * scaleHeightMultiplier);
    canvas.renderAll();
    canvas.calcOffset();
    this.setState({canvasHeight:canvas.height,canvasWidth:canvas.width},()=>{
          });
    this.resizeCanvas(true, false);
  }

  resizeCanvas = (addDimension = false, resize = true) => {
    let currCanvas = this._fc;
    let {overlayWidth, overlayHeight} = this.getOverlayDimensions();
    console.log("[nVision Sketch Field][resize Canvas][Current width and height of overlay container] :", overlayWidth, overlayHeight);
    console.log("[nVision Sketch Field][resize Canvas][Current width and height of canvas] :", currCanvas.getWidth(),currCanvas.getHeight());
    if(resize){
      this._resize();
    }
    let newCanvasWidth = overlayWidth;
    let newCanvasHeight = overlayHeight;
    // if(addDimension){
    //   newCanvasWidth = this.getActualCanvasDimensions(overlayWidth, overlayHeight, true).width;
    //   newCanvasHeight = this.getActualCanvasDimensions(overlayWidth,overlayHeight,true).height;
    // }
    // currCanvas.setHeight(newCanvasHeight);
    // currCanvas.setWidth(newCanvasWidth);
    currCanvas.requestRenderAll();
        console.log("[nVision Sketch Field][resize Canvas][width and height of canvas after resize] :", currCanvas.getWidth(),currCanvas.getHeight());
  }

  setCanvasWidthHeightInRedux = () => {
    let currCanvas = this._fc;
  }

  getActualCanvasDimensions = (width, height, fullWidth=true) => {
    let canvas = this._fc;
    let obj = { width:width, height:height };
    obj.width = width + this.state.strokeWidth;
    obj.height = height + ( fullWidth ? this.state.strokeWidth : (this.state.strokeWidth +0) );
    return obj;
  }
  /**
  * Sets the background color for this sketch
  * @param color in rgba or hex format
  */
  _backgroundColor = color => {
    if (!color) return
    let canvas = this._fc
    canvas.setBackgroundColor(color, () => canvas.renderAll())
  }

  /**
  * Zoom the drawing by the factor specified
  *
  * The zoom factor is a percentage with regards the original, for example if factor is set to 2
  * it will double the size whereas if it is set to 0.5 it will half the size
  *
  * @param factor the zoom factor
  */
  zoom = factor => {
    let canvas = this._fc
    let objects = canvas.getObjects()
    for (let i in objects) {
      objects[i].scaleX = objects[i].scaleX * factor
      objects[i].scaleY = objects[i].scaleY * factor
      objects[i].left = objects[i].left * factor
      objects[i].top = objects[i].top * factor
      objects[i].setCoords()
    }
    canvas.renderAll()
    canvas.calcOffset()
  }

  /**
  * Perform an undo operation on canvas, if it cannot undo it will leave the canvas intact
  */
  undo = () => {
    let history = this._history
    let [obj, prevState, currState] = history.getCurrent()
    history.undo()
    if (obj.__removed) {
      this.setState({ action: false }, () => {
        this._fc.add(obj)
        obj.__version -= 1
        obj.__removed = false
      })
    } else if (obj.__version <= 1) {
      this._fc.remove(obj)
    } else {
      obj.__version -= 1
      obj.setOptions(JSON.parse(prevState))
      obj.setCoords()
      this._fc.renderAll()
    }
    if (this.props.onChange) {
      this.props.onChange()
    }
  }

  /**
  * Perform a redo operation on canvas, if it cannot redo it will leave the canvas intact
  */
  redo = () => {
    let history = this._history
    if (history.canRedo()) {
      let canvas = this._fc
      //noinspection Eslint
      let [obj, prevState, currState] = history.redo()
      if (obj.__version === 0) {
        this.setState({ action: false }, () => {
          canvas.add(obj)
          obj.__version = 1
        })
      } else {
        obj.__version += 1
        obj.setOptions(JSON.parse(currState))
      }
      obj.setCoords()
      canvas.renderAll()
      if (this.props.onChange) {
        this.props.onChange()
      }
    }
  }

  /**
  * Delegation method to check if we can perform an undo Operation, useful to disable/enable possible buttons
  *
  * @returns {*} true if we can undo otherwise false
  */
  canUndo = () => {

    // return this._history.canUndo()
  }

  /**
  * Delegation method to check if we can perform a redo Operation, useful to disable/enable possible buttons
  *
  * @returns {*} true if we can redo otherwise false
  */
  canRedo = () => {

    return this._history.canRedo()
  }

  /**
  * Exports canvas element to a dataurl image. Note that when multiplier is used, cropping is scaled appropriately
  *
  * Available Options are
  * <table style="width:100%">
  *
  * <tr><td><b>Name</b></td><td><b>Type</b></td><td><b>Argument</b></td><td><b>Default</b></td><td><b>Description</b></td></tr>
  * <tr><td>format</td> <td>String</td> <td><optional></td><td>png</td><td>The format of the output image. Either "jpeg" or "png"</td></tr>
  * <tr><td>quality</td><td>Number</td><td><optional></td><td>1</td><td>Quality level (0..1). Only used for jpeg.</td></tr>
  * <tr><td>multiplier</td><td>Number</td><td><optional></td><td>1</td><td>Multiplier to scale by</td></tr>
  * <tr><td>left</td><td>Number</td><td><optional></td><td></td><td>Cropping left offset. Introduced in v1.2.14</td></tr>
  * <tr><td>top</td><td>Number</td><td><optional></td><td></td><td>Cropping top offset. Introduced in v1.2.14</td></tr>
  * <tr><td>width</td><td>Number</td><td><optional></td><td></td><td>Cropping width. Introduced in v1.2.14</td></tr>
  * <tr><td>height</td><td>Number</td><td><optional></td><td></td><td>Cropping height. Introduced in v1.2.14</td></tr>
  *
  * </table>
  *
  * @returns {String} URL containing a representation of the object in the format specified by options.format
  */
  toDataURL = options => this._fc.toDataURL(options)

  /**
  * Returns JSON representation of canvas
  *
  * @param propertiesToInclude Array <optional> Any properties that you might want to additionally include in the output
  * @returns {string} JSON string
  */
  toJSON = propertiesToInclude => this._fc.toJSON(propertiesToInclude)

  /**
  * Populates canvas with data from the specified JSON.
  *
  * JSON format must conform to the one of fabric.Canvas#toDatalessJSON
  *
  * @param json JSON string or object
  */
  fromJSON = json => {
    if (!json) return
    let canvas = this._fc;
    setTimeout(() => {
      canvas.loadFromJSON(json, () => {
        // if (this.props.tool === Tool.DefaultTool) {
          canvas.isDrawingMode = canvas.selection = false
          canvas.forEachObject((o) => {
            o.selectable = o.evented = false;
            if (o.type === "polygon") {
              this._tools[o.type].editPolygon(o, true);
            }
          })

        // }
        canvas.renderAll()
        if (this.props.onChange) {
          this.props.onChange()
        }
      })
    }, 100)
  }

  /**
  * Clear the content of the canvas, this will also clear history but will return the canvas content as JSON to be
  * used as needed in order to undo the clear if possible
  *
  * @param propertiesToInclude Array <optional> Any properties that you might want to additionally include in the output
  * @returns {string} JSON string of the canvas just cleared
  */
  clear = propertiesToInclude => {
    let discarded = this.toJSON(propertiesToInclude)
    this._fc.clear()
    // this._history.clear()
    return discarded
  }


  /**
  * Remove selected object from the canvas
  */
  removeSelected = () => {
    let canvas = this._fc
    let activeObj = canvas.getActiveObject()
    if (activeObj) {
      let selected = []
      if (activeObj.type === 'activeSelection') {
        activeObj.forEachObject(obj => selected.push(obj))
      } else {
        selected.push(activeObj)
      }
      selected.forEach(obj => {
        obj.__removed = true
        let objState = obj.toJSON()
        obj.__originalState = objState
        let state = JSON.stringify(objState)
        // this._history.keep([obj, state, state])
        canvas.remove(obj)
      })
      canvas.discardActiveObject()
      canvas.requestRenderAll()
    }
  }

  copy = () => {
    let canvas = this._fc
    canvas.getActiveObject().clone(cloned => (this._clipboard = cloned))
  }

  paste = () => {

    // clone again, so you can do multiple copies.
    this._clipboard.clone(clonedObj => {
      let canvas = this._fc
      canvas.discardActiveObject()
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true
      })
      if (clonedObj.type === 'activeSelection') {
        // active selection needs a reference to the canvas.
        clonedObj.canvas = canvas
        clonedObj.forEachObject(obj => canvas.add(obj))
        clonedObj.setCoords()
      } else {
        canvas.add(clonedObj)
      }
      this._clipboard.top += 10
      this._clipboard.left += 10
      canvas.setActiveObject(clonedObj)
      canvas.requestRenderAll()
    })
  }

  /**
  * Sets the background from the dataUrl given
  *
  * @param dataUrl the dataUrl to be used as a background
  * @param options
  */
  setBackgroundFromDataUrl = (dataUrl, options = {}) => {
    let canvas = this._fc
    if (options.stretched) {
      delete options.stretched
      Object.assign(options, {
        width: canvas.width,
        height: canvas.height
      })
    }
    if (options.stretchedX) {
      delete options.stretchedX
      Object.assign(options, {
        width: canvas.width
      })
    }
    if (options.stretchedY) {
      delete options.stretchedY
      Object.assign(options, {
        height: canvas.height
      })
    }
    let img = new Image()
    img.setAttribute('crossOrigin', 'anonymous')
    img.onload = () =>
      canvas.setBackgroundImage(
        new fabric.Image(img),
        () => canvas.renderAll(),
        options
      )
    img.src = dataUrl
  }

  addText = (text, options = {}) => {
    let canvas = this._fc
    let iText = new fabric.IText(text, options)
    let opts = {
      left: (canvas.getWidth() - iText.width) * 0.5,
      top: (canvas.getHeight() - iText.height) * 0.5
    }
    Object.assign(options, opts)
    iText.set({
      left: options.left,
      top: options.top
    })

    canvas.add(iText)
  }

  callEvent = (e, eventFunction) => {
    if (this._selectedTool)
      eventFunction(e);
  }

  componentDidMount = () => {
    let {
      tool,
      value,
      undoSteps,
      defaultValue,
      backgroundColor,
      image
    } = this.props

    let canvas = (this._fc = new fabric.Canvas(
      this._canvas,
      {
        centeredRotation: true,
        centeredScaling: false,
      }
    ))
    canvas.centeredScaling = false;
    this._initTools(canvas)

    this._backgroundColor(backgroundColor)

    let selectedTool = this._tools[tool]
    if (selectedTool) selectedTool.configureCanvas(this.props)
    this._selectedTool = selectedTool

    // Events binding
    canvas.on('object:added', e => this.callEvent(e, this._onObjectAdded))
    canvas.on('object:modified', e => this.callEvent(e, this._onObjectModified))
    canvas.on('object:removed', e => this.callEvent(e, this._onObjectRemoved))
    canvas.on('mouse:down', e => this.callEvent(e, this._onMouseDown))
    canvas.on('mouse:move', e => this.callEvent(e, this._onMouseMove))
    canvas.on('mouse:up', e => this.callEvent(e, this._onMouseUp))
    canvas.on('mouse:out', e => this.callEvent(e, this._onMouseOut))
    canvas.on('object:moving', e => this.callEvent(e, this._onObjectMoving))
    canvas.on('object:scaling', e => this.callEvent(e, this._onObjectScaling))
    canvas.on('object:rotating', e => this.callEvent(e, this._onObjectRotating))
    // IText Events fired on Adding Text
    // canvas.on("text:event:changed", console.log)
    // canvas.on("text:selection:changed", console.log)
    // canvas.on("text:editing:entered", console.log)
    // canvas.on("text:editing:exited", console.log)

    this.disableTouchScroll()

    this.resizeOverlayAndCanvasOnCompoentMount();
      // initialize canvas with controlled value if exists
      ; (value || defaultValue) && this.fromJSON(value || defaultValue)

  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this._resize)
    executeCanvasResize = false;
  }
    

  componentDidUpdate = (prevProps, prevState) => {
    let canvas = this._fc
    if (
      this.state.parentWidth !== prevState.parentWidth ||
      this.props.width !== prevProps.width ||
      this.props.height !== prevProps.height
    ) {
    //   this._resize();
    // this.resizeCanvas(true);
    }

    if (this.props.tool !== prevProps.tool) {
      this._selectedTool = this._tools[this.props.tool]
      //Bring the cursor back to default if it is changed by a tool
      this._fc.defaultCursor = 'default'
      if (this._selectedTool) {
        this._selectedTool.configureCanvas(this.props);
      }
    }

    if (this.props.backgroundColor !== prevProps.backgroundColor) {
      this._backgroundColor(this.props.backgroundColor)
    }

    if(this.props.resolutionHeight && this.props.resolutionWidth && (this.state.resolutionHeight !== this.props.resolutionHeight || this.state.resolutionWidth !== this.props.resolutionWidth)){
      this.setState({resolutionHeight:this.props.resolutionHeight, resolutionWidth:this.props.resolutionWidth});
    }


    if (this.props.image !== this.state.imageUrl) {
      this.addImg(this.props.image)
      this.setState({
        imageUrl: this.props.image,
        scaleFactor: this.state.scaleFactor,
        rotation: this.props.oneptwop.inscopix.adapter_lsm.rotation,
        flipApplied: this.props.oneptwop.inscopix.adapter_lsm.flip_horizontal
      })
    }

    if (
      this.props.value !== prevProps.value ||
      (this.props.value && this.props.forceValue)
    ) {
      this.fromJSON(this.props.value)
    }

    // if (this.props.callResize !== this.state.callResize) {
    // this._resize();
        // this.setState({ callResize: this.props.callResize });
    // }
  }
  onChangeSize = (width, height) => {
    // this._resize();
    this.resizeCanvas(true);
  }

  removeAddOrMoveMode = () => {
    let canvas = this._fc;
    if (canvas.upperCanvasEl) {
      canvas.discardActiveObject();
      canvas.forEachObject(function (o) {
        o.selectable = false;
      });
      canvas.off('mouse:up');
      canvas.hoverCursor = canvas.defaultCursor = 'default';
      canvas.renderAll();
    }
  }

  createRect = () =>{
    let canvas = this._fc;
    let updatedheight =  canvas.getHeight();
    let updatedWidth = canvas.getWidth();
    let rect = new fabric.Rect({
      left: 0,
      top: 0,
      originX: "left",
      originY: "top",
      strokeWidth: this.state.strokeWidth,
      transparentCorners: false,
      name: "trackingArea",
      defaultName: "trackingArea",
      width: updatedWidth,
      height: updatedheight,
      id: "trackingArea",
      fill: "transparent",
      stroke: '#ff0000',
      selectable: true,
      evented: true,
      hasBorders: false,
      cornerSize: 6,
      enable: true,
      description: "",
      angle: 0
    });
    canvas.add(rect);
  }

  render = () => {
    let { className, style, width, height } = this.props

    

    let canvasDivStyle = Object.assign(
      {},
      style ? style : {},
      width ? { width: '100%' } : { width: '100%' },
      //width ? { width: this.state.canvasWidth } : { width: this.state.canvasWidth },
      height ? { height: this.state.canvasHeight } : { height: this.state.canvasHeight }
    )

    return (
      <div
        className={className}
        ref={c => (this._container = c)}
        style={canvasDivStyle}
        id="onep-twop-container-2"
      >
        <ReactResizeDetector handleWidth handleHeight skipOnMount ={true} onResize={this.onChangeSize.bind(this)} />
        <div style={{ position: 'absolute' }}>
          <canvas
            //id={uuid4()}
            id="tracking-canvas"
            // style={{
            // margin: "0 auto",
            // position: "absolute",
            // opacity: 1,
            // width: "100%",
            // height: "100%",
            // maxHeight: 800,
            // maxWidth: 1280,
            // backgroundRepeat: "no-repeat",
            // backgroundPosition: "center",
            // backgroundSize: "contain",
            // zIndex: 1
            // }}
            ref={c => (this._canvas = c)}
          >
          </canvas>
          </div>
        {/* </ReactResizeDetector> */}

      </div>
    )
  }
}

export default NvisionSketchField