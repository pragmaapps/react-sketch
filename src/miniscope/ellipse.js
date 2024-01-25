/*eslint no-unused-vars: 0*/

import FabricCanvasTool from "../fabrictool";
import { uuid4 } from '../utils'
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

  doMouseDown(options, props, sketch) {
    if(this.objectAdd) {
      this._canvas.off("mouse:up");
      this._canvas.on("mouse:up", function () {});
      return;
    }
    this._canvas.off("mouse:up");
    this._canvas.on("mouse:up", (e) => this.doMouseUp(e, props, sketch));
    if (!this.isDown) return;
    const { notificationShow } = props;
    let selectedRoiShpes = this._canvas.getObjects().filter(ob => ob.parentKey === props.selectedRoi);
    if (selectedRoiShpes.length >= 100) {
      notificationShow();
      console.log(
        `%c[ROI]%c , maximum 100 roi shapes allowed `,
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
    let canvas = this._canvas;
    this.isDown = true;
    let pointer = canvas.getPointer(options.e);
    let objects = canvas.getObjects();
    [this.startX, this.startY] = [pointer.x, pointer.y];
    this.ellipse = new fabric.Ellipse({
      left: this.startX,
      top: this.startY,
      originX: "left",
      originY: "top",
      rx: 20,
      ry: 20,
      strokeWidth: this._width,
      stroke: props.lineColor,
      fill: this._fill,
      selectable: false,
      evented: false,
      transparentCorners: false,
      id: uuid4(),
      parentKey: props.selectedRoi
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
      this.ellipse.setCoords();
      canvas.renderAll();
    }
  }

  async doMouseUp(o, props, sketch) {
    this.isDown = true;
    this.isDragging = false;
    const { onShapeAdded } = props;
    if(this.objectAdd){
      let ellipseSmall = await props.checkForMinTotalArea();
      let outsideZone = await this.checkWithInBoundary(props);
      if(outsideZone){
        console.log("%c[Closed Loop]%c [Miniscope Field][Rectangle][do mouse up] Ellipse is created outside the canvas.","color:blue; font-weight: bold;",
        "color: black;");
        props.notificationShow("Zone should not be created outside tracking area.");
      }
      else if(!ellipseSmall){ 
        console.log("%c[Closed Loop]%c [Miniscope Field][Ellipse][do mouse up] The zone size should not be less than 100px of the total area.","color:blue; font-weight: bold;",
          "color: black;");
        props.notificationShow("Zone size should be bigger then 100px.");
      }
      await onShapeAdded();
      setTimeout(() => {
        this.objectAdd = false;
      }, 0); 
    }
    let obj = o.target;
    if(props.enableRoiDelete && obj){
      let canvas = this._canvas; 
      canvas.remove(obj);
      await onShapeAdded();
    }
  }

  checkWithInBoundary = async (props) => {
    let canvas = this._canvas; 
    let isObjectOutSideBoundary = false;
    let roiTypes = ["rect", "ellipse", "polygon"];
    canvas.getObjects().forEach((shape) => {
      if(!roiTypes.includes(shape.type)) return;
      if((shape.left < 0 ||
        shape.top < 0 ||
        shape.left + (shape.width * shape.scaleX) > canvas.getWidth() ||
        shape.top + (shape.height * shape.scaleY) > canvas.getHeight())){
          canvas.remove(shape);
          isObjectOutSideBoundary = true;
        }
    });
    return isObjectOutSideBoundary;
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
