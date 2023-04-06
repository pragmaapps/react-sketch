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
    if (!this.isDown) return;
    const { notificationShow, addROIDefaultName } = props;
    if (this._canvas.getObjects().length >= 5) {
      notificationShow();
      console.log(
        `%c[ROI]%c , maximum 5 roi shapes allowed `,
        "color:blue; font-weight:bold;",
        "color:black;"
      );
      this.objectAdd = false;
      return;
    }
    this.objectAdd = true;
    this.genrateEllipse(options, props);
    addROIDefaultName(props.roiDefaultNames);
  }

  genrateEllipse = (options, props) => {
    let canvas = this._canvas;
    this.isDown = true;
    let pointer = canvas.getPointer(options.e);
    let objects = canvas.getObjects();
    let name = props.roiDefaultNames[0];
    let defaultName = props.roiDefaultNames[0];
    [this.startX, this.startY] = [pointer.x, pointer.y];
    this.ellipse = new fabric.Ellipse({
      left: this.startX,
      top: this.startY,
      originX: "left",
      originY: "top",
      rx: 20,
      ry: 20,
      strokeWidth: this._width,
      stroke: this._color,
      fill: this._fill,
      name: name,
      defaultName: defaultName,
      selectable: false,
      evented: false,
      transparentCorners: false,
      id: new Date().getTime(),
    });
    canvas.add(this.ellipse);
    this.containInsideBoundary(options);
    this.isDragging = true;
    this.ellipse.edit = true;
  };

  doMouseMove(o) {
    if (!this.isDown) return;
    let canvas = this._canvas;
    var obj = o.target;
    if (this.isDragging) {
      let pointer = canvas.getPointer(o.e);
      if (
        pointer.x < 0 ||
        pointer.x > canvas.getWidth() ||
        pointer.y < 0 ||
        pointer.y > canvas.getHeight()
      ) {
        return;
      }
      var rx = Math.abs(this.startX - pointer.x) / 2;
      var ry = Math.abs(this.startY - pointer.y) / 2;
      if (rx > this.ellipse.strokeWidth) {
        rx -= this.ellipse.strokeWidth / 2;
      }
      if (ry > this.ellipse.strokeWidth) {
        ry -= this.ellipse.strokeWidth / 2;
      }
      this.ellipse.set({ rx: rx, ry: ry });
      this.containInsideBoundary(o);
      canvas.renderAll();
    }
  }

  doMouseUp(o, props) {
    this.isDown = true;
    this.isDragging = false;
    if(this.objectAdd)
      props.onShapeAdded();
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
