/*eslint no-unused-vars: 0*/

import FabricCanvasTool from "./fabrictool";

const fabric = require("fabric").fabric;

class Rectangle extends FabricCanvasTool {
  configureCanvas(props) {
    let canvas = this._canvas;
    canvas.isDrawingMode = canvas.selection = false;
    // canvas.forEachObject((o) => o.selectable = o.evented = false);
    this._width = props.lineWidth;
    this._color = props.lineColor;
    this._fill = props.fillColor;
    this.isDown = true;
    this.isDragging = false;
    this.objectAdd = false;
  }

  doMouseDown(options, props) {
    if (!this.isDown) return;
    const { notificationShow, addROIDefaultName, removeColorInDefaultShapeColors, roiDefaultNames } = props;
    let objects = this._canvas.getObjects().filter(obj => obj.id !== "trackingArea");
    if (objects.length >= 5 && roiDefaultNames.length === 0 ) {
      notificationShow();
      console.log(
        `Maximum five shapes allowed `,
        "color:blue; font-weight:bold;",
        "color:black;"
      );
      this.objectAdd = false;
      return;
    }
    this.objectAdd = true;
    this.genrateRect(options, props);
    removeColorInDefaultShapeColors(props.defaultShapeColors);
    addROIDefaultName(props.roiDefaultNames);
  }

  genrateRect = (options, props) => {
    let canvas = this._canvas;
    this.isDown = true;
    let pointer = canvas.getPointer(options.e);
    let boundary = canvas.getObjects().find(ob => ob.id === "trackingArea");
    if (boundary && (pointer.y > (boundary.height * boundary.scaleY) + boundary.top || pointer.x > (boundary.width * boundary.scaleX) + boundary.left || pointer.x < boundary.left || pointer.y < boundary.top)) {
      return false;
    }
    let objects = canvas.getObjects();
    let name = props.roiDefaultNames[0];
    let defaultName = props.roiDefaultNames[0];
    this.startX = pointer.x;
    this.startY = pointer.y;
    this.rect = new fabric.Rect({
      left: this.startX,
      top: this.startY,
      originX: "left",
      originY: "top",
      width: 20,
      height: 20,
      stroke: props.defaultShapeColors[0],
      strokeWidth: this._width,
      fill: this._fill,
      transparentCorners: false,
      name: name,
      defaultName: defaultName,
      selectable: false,
      evented: false,
      id: new Date().getTime(),
      hasBorders: false,
      cornerSize: 6,
      angle: 0,
      enable: true,
      description: "",
    });
    canvas.add(this.rect);
    // this.containInsideBoundary(options);
    this.isDragging = true;
    this.rect.edit = true;
  };

  doMouseMove(o) {
    if (!this.isDown) return;
    let canvas = this._canvas;
    if (this.isDragging) {
      let pointer = canvas.getPointer(o.e);
      let boundary = canvas.getObjects().find(ob => ob.id === "trackingArea");
      if (boundary && (pointer.y > (boundary.height * boundary.scaleY) + boundary.top || pointer.x > (boundary.width * boundary.scaleX) + boundary.left || pointer.x < boundary.left || pointer.y < boundary.top)) {
        return false;
      }
      if (this.startX > pointer.x) {
        this.rect.set({ left: Math.abs(pointer.x) });
      }
      if (this.startY > pointer.y) {
        this.rect.set({ top: Math.abs(pointer.y) });
      }
      this.rect.set({ width: Math.abs(this.startX - pointer.x) });
      this.rect.set({ height: Math.abs(this.startY - pointer.y) });
      this.rect.setCoords();
      // this.containInsideBoundary(o);
      canvas.renderAll();
    }
  }

  doMouseUp(o, props) {
    // this.containInsideBoundary(o);
    this.isDown = true;
    this.isDragging = false;
    const { onShapeAdded, checkForOverlap } = props;
    if(this.objectAdd){
      // checkForOverlap();
      onShapeAdded();
      this.objectAdd = false;
    }
  }

  checkWithinBoundary = (o) => {
    let canvas = this._canvas;
    let pointer = canvas.getPointer(o.e);
    let boundary = canvas.getObjects().find(ob => ob.id === "trackingArea");
    if (boundary && (pointer.y > boundary.height + boundary.top || pointer.x > boundary.width + boundary.left || pointer.x < boundary.left || pointer.y < boundary.top)) {
      return false;
    }
    return true
  }

  containInsideBoundary = (o) => {
    let canvas = this._canvas;
    var canvasTL = new fabric.Point(0, 0);
    var canvasBR = new fabric.Point(canvas.getWidth(), canvas.getHeight());
    let pointer = canvas.getPointer(o.e);
    if (this.startX > pointer.x) {
      this.rect.set({ left: Math.abs(pointer.x) });
    }
    if (this.startY > pointer.y) {
      this.rect.set({ top: Math.abs(pointer.y) });
    }
    if (!this.rect.isContainedWithinRect(canvasTL, canvasBR)) {
      var objBounds = this.rect.getBoundingRect();
      this.rect.setCoords();
      var objTL = this.rect.getPointByOrigin("left", "top");
      var left = objTL.x;
      var top = objTL.y;

      if (objBounds.left < canvasTL.x) left = 0;
      if (objBounds.top < canvasTL.y) top = 0;
      if (objBounds.top + objBounds.height > canvasBR.y)
        top = canvasBR.y - objBounds.height;
      if (objBounds.left + objBounds.width > canvasBR.x)
        left = canvasBR.x - objBounds.width;

      this.rect.setPositionByOrigin(new fabric.Point(left, top), "left", "top");
      this.rect.setCoords();
      canvas.renderAll();
    }
  };

  genrateTrackingArea = () => {
    let canvas = this._canvas;
    this.isDown = true;
    let width = canvas.getWidth() -1;
    let height = canvas.getHeight() -1;
    let name = "trackingArea";
    let defaultName = "trackingArea";
    this.rect = new fabric.Rect({
      left: 0,
      top: 0,
      originX: "left",
      originY: "top",
      width: width,
      height: height,
      stroke: "red",
      strokeWidth: 1,
      fill: this._fill,
      transparentCorners: false,
      name: name,
      defaultName: defaultName,
      selectable: true,
      evented: true,
      id: "trackingArea",
      hasBorders: false,
      cornerSize: 6,
      angle: 0,
      enable: true,
      description: "",
    });
    canvas.add(this.rect).setActiveObject(this.rect);
    // this.containInsideBoundary(options);
    this.rect.edit = true;
  };
}

export default Rectangle;
