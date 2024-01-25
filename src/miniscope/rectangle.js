/*eslint no-unused-vars: 0*/

import FabricCanvasTool from "../fabrictool";
import { uuid4 } from '../utils'
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
    this.strokeWidth = 2;
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
    this.genrateRect(options, props);
  }

  genrateRect = (options, props) => {
    let canvas = this._canvas;
    this.isDown = true;
    let pointer = canvas.getPointer(options.e);
    if (
      pointer.x < 0 ||
      pointer.x > canvas.getWidth() ||
      pointer.y < 0 ||
      pointer.y > canvas.getHeight()
    ) {
      return;
    }
    this.startX = pointer.x;
    this.startY = pointer.y;
    this.rect = new fabric.Rect({
      left: this.startX,
      top: this.startY,
      originX: "left",
      originY: "top",
      width: 20,
      height: 20,
      stroke: props.lineColor,
      strokeWidth: this._width,
      fill: this._fill,
      transparentCorners: false,
      selectable: false,
      evented: false,
      id: uuid4(),
      hasBorders: false,
      cornerSize: 6,
      angle: 0,
      enable: true,
      description: "",
      strokeUniform: true,
      parentKey: props.selectedRoi     
    });
    canvas.add(this.rect);
    this.containInsideBoundary(options);
    this.isDragging = true;
    this.rect.edit = true;
  };

  doMouseMove(o) {
    if (!this.isDown) return;
    let canvas = this._canvas;
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
      if (this.startX > pointer.x) {
        this.rect.set({ left: Math.abs(pointer.x) });
      }
      if (this.startY > pointer.y) {
        this.rect.set({ top: Math.abs(pointer.y) });
      }
      this.rect.set({ width: Math.abs(this.startX - pointer.x) });
      this.rect.set({ height: Math.abs(this.startY - pointer.y) });
      this.rect.setCoords();
      this.containInsideBoundary(o);
      canvas.renderAll();
    }
  }

  async doMouseUp(o, props, sketch) {
    this.isDown = true;
    this.isDragging = false;
    const { onShapeAdded } = props;
    if(this.objectAdd){
      let rectSmall = await props.checkForMinTotalArea();
      let outsideZone = await this.checkWithInBoundary(props);
      if(outsideZone){
        console.log("%c[Closed Loop]%c [Miniscope Field][Rectangle][do mouse up] Rectangle is created outside the canvas.","color:blue; font-weight: bold;",
        "color: black;");
        props.notificationShow("Zone should not be created outside Canvas.");
      }
      else if(!rectSmall){ 
        console.log("%c[Closed Loop]%c [Miniscope Field][Rectangle][do mouse up] The zone size should not be less than 100px of the total area.","color:blue; font-weight: bold;",
          "color: black;");
        props.notificationShow("Zone size should be bigger than 100px.");
      }
      await onShapeAdded();
      setTimeout(() => {
        this.objectAdd = false;
      },0); 
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
}

export default Rectangle;
