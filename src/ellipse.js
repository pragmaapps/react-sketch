/*eslint no-unused-vars: 0*/

import FabricCanvasTool from "./fabrictool";
import { linearDistance } from "./utils";

const fabric = require("fabric").fabric;

class Ellipse extends FabricCanvasTool {
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
    if(this.objectAdd) {
      // console.log("[Animal Tracking][Ellipse] Object has not added/removed and do not called mouse up function");
      this._canvas.off("mouse:up");
      this._canvas.on("mouse:up", function () {});
      return;
    }
    // console.log("[Animal Tracking][Ellipse] Object has added and called mouse up function.");
    this._canvas.off("mouse:up");
    this._canvas.on("mouse:up", (e) => this.doMouseUp(e, props));
    if (!this.isDown) return;
    const { notificationShow, roiDefaultNames } = props;
    let objects = this._canvas.getObjects().filter(obj => obj.id !== "trackingArea" && obj.id !== "calibratedLine");
    if (objects.length >= 5 && roiDefaultNames.length === 0) {
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
    this.genrateEllipse(options, props);
  }

  genrateEllipse = (options, props) => {
    const { addROIDefaultName, removeColorInDefaultShapeColors } = props;
    let canvas = this._canvas;
    this.isDown = true;
    let pointer = canvas.getPointer(options.e);
    let objects = canvas.getObjects();
    let name = props.roiDefaultNames[0];
    let defaultName = props.roiDefaultNames[0];
    [this.startX, this.startY] = [pointer.x, pointer.y];
    let boundary = props.getboudaryCoords();
    if (boundary && (pointer.y > (boundary.height * boundary.scaleY) + boundary.top || pointer.x > (boundary.width * boundary.scaleX) + boundary.left || pointer.x < boundary.left || pointer.y < boundary.top)) {
      return false;
    }
    this.ellipse = new fabric.Ellipse({
      left: this.startX,
      top: this.startY,
      originX: "left",
      originY: "top",
      rx: 20,
      ry: 20,
      strokeWidth: this._width,
      stroke: props.defaultShapeColors[0],
      fill: this._fill,
      name: name,
      defaultName: defaultName,
      selectable: false,
      evented: false,
      transparentCorners: false,
      id: new Date().getTime(),
      enable: true,
      description: "",
      strokeUniform: true,
    });
    canvas.add(this.ellipse);
    this.ellipse.setCoords();
    // this.containInsideBoundary(options);
    this.isDragging = true;
    this.ellipse.edit = true;
    removeColorInDefaultShapeColors(props.defaultShapeColors);
    addROIDefaultName(props.roiDefaultNames);
  };

  doMouseMove(o, props) {
    if (!this.isDown) return;
    let canvas = this._canvas;
    if (this.isDragging) {
      let pointer = canvas.getPointer(o.e);
      let boundary = props.getboudaryCoords();
      if (boundary && (pointer.y > (boundary.height * boundary.scaleY) + boundary.top || pointer.x > (boundary.width * boundary.scaleX) + boundary.left || pointer.x < boundary.left || pointer.y < boundary.top)) {
        return false;
      }
      var rx = Math.abs(this.startX - pointer.x) / 2;
      var ry = Math.abs(this.startY - pointer.y) / 2;
      if (this.startX > pointer.x) {
        this.ellipse.set({ left: Math.abs(pointer.x) });
      }
      if (this.startY > pointer.y) {
        this.ellipse.set({ top: Math.abs(pointer.y) });
      }
      if (rx > this.ellipse.strokeWidth) {
        rx -= this.ellipse.strokeWidth / 2;
      }
      if (ry > this.ellipse.strokeWidth) {
        ry -= this.ellipse.strokeWidth / 2;
      }
      this.ellipse.set({ rx: rx, ry: ry });
      // this.containInsideBoundary(o);
      this.ellipse.setCoords();
      canvas.renderAll();
    }
  }

  async doMouseUp(o, props) {
    this.isDown = true;
    this.isDragging = false;
    const { onShapeAdded, checkForOverlap } = props;
    let isOverlap = false;
    if(this.objectAdd){
      let ellipseSmall = await props.checkForMinTotalArea();
      if(!ellipseSmall){ 
        console.log("%c[Animal Tracking]%c [Skecth Field][Ellipse][do mouse up] The zone size should not be less than 100px of the total area.","color:blue; font-weight: bold;",
          "color: black;");
        props.notificationShow("Zone size should be bigger then 100px.");
      }
      else{
        isOverlap = await checkForOverlap();
      }
      await onShapeAdded();
      setTimeout(() => {
        this.objectAdd = false;
      }, isOverlap ? 500 : 0); 
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
      this.ellipse.set({ originX: "right" });
    } else {
      this.ellipse.set({ originX: "left" });
    }
    if (this.startY > pointer.y) {
      this.ellipse.set({ originY: "bottom" });
    } else {
      this.ellipse.set({ originY: "top" });
    }
    if (!this.ellipse.isContainedWithinRect(canvasTL, canvasBR)) {
      var objBounds = this.ellipse.getBoundingRect();
      this.ellipse.setCoords();
      var objTL = this.ellipse.getPointByOrigin("left", "top");
      var left = objTL.x;
      var top = objTL.y;

      if (objBounds.left < canvasTL.x) left = 0;
      if (objBounds.top < canvasTL.y) top = 0;
      if (objBounds.top + objBounds.height > canvasBR.y)
        top = canvasBR.y - objBounds.height;
      if (objBounds.left + objBounds.width > canvasBR.x)
        left = canvasBR.x - objBounds.width;

      this.ellipse.setPositionByOrigin(
        new fabric.Point(left, top),
        "left",
        "top"
      );
      this.ellipse.setCoords();
      canvas.renderAll();
    }
  };
}

export default Ellipse;
