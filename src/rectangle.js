/*eslint no-unused-vars: 0*/

import FabricCanvasTool from './fabrictool'

const fabric = require('fabric').fabric;

class Rectangle extends FabricCanvasTool {

  configureCanvas(props) {
    let canvas = this._canvas;
    canvas.isDrawingMode = canvas.selection = false;
    canvas.forEachObject((o) => o.selectable = o.evented = false);
    this._width = props.lineWidth;
    this._color = props.lineColor;
    this._fill = props.fillColor;
    this.isDown = true;
    this.isDragging = false;
  }

  doMouseDown(options, props) {
    if(this.isDown){
      if(options.target && options.target.id !== null){
        console.log("if rectangle is already there");
        this.isDown = true
      }else{
        let canvas = this._canvas;
        let objects = canvas.getObjects();
        if(objects.length < 5){
          console.log("if rectangle is already is not there");
          this.genrateRect(options);
        }else{
          const { notificationShow } = props
          notificationShow();
          console.log(`%c[ROI]%c , maximum 5 roi shapes allowed `, "color:blue; font-weight:bold;", "color:black;");
        }
      }
    }
  }

  genrateRect = (options) => {
    let canvas = this._canvas;
    this.isDown = true;
    let pointer = canvas.getPointer(options.e);
    console.log(pointer,"pointer");
    let objects = canvas.getObjects();
    let name = `ROI#${objects.length + 1}`;
    this.startX = pointer.x;
    this.startY = pointer.y;
    this.rect = new fabric.Rect({
      left: this.startX,
      top: this.startY,
      originX: 'left',
      originY: 'top',
      width: pointer.x - this.startX,
      height: pointer.y - this.startY,
      stroke: this._color,
      strokeWidth: this._width,
      fill: this._fill,
      transparentCorners: false,
      name: name,
      id: new Date().getTime(),
      // selectable: false,
      // evented: false,
      // strokeUniform: true,
      // noScaleCache : false,
      angle: 0
    });
    this.rect.setControlsVisibility({ml: true, mb:true, mr: false, mt: false, mtr: false, bl: true, tl: true, br: true, tr: true});
    canvas.add(this.rect);
    this.isDragging = true;
    this.rect.edit = true;
  }

  doMouseMove(o) {
    if (!this.isDown) return;
    let canvas = this._canvas;
    if(this.isDragging){
      if(this.rect.height > this.rect.canvas.height || this.rect.width > this.rect.canvas.width){
        return;
      }
      var canvasTL = new fabric.Point(0, 0);
      var canvasBR = new fabric.Point(canvas.getWidth(), canvas.getHeight());      
      let pointer = canvas.getPointer(o.e)
      if (this.startX > pointer.x) {
        this.rect.set({ left: Math.abs(pointer.x) });
      }
      if (this.startY > pointer.y) {
        this.rect.set({ top: Math.abs(pointer.y) });
      }
      this.rect.set({ width: Math.abs(this.startX - pointer.x) });
      this.rect.set({ height: Math.abs(this.startY - pointer.y) });
      this.rect.setCoords();
      if (!this.rect.isContainedWithinRect(canvasTL, canvasBR)) {
        var objBounds = this.rect.getBoundingRect();
        this.rect.setCoords();
        var objTL = this.rect.getPointByOrigin("left", "top");
        var left = objTL.x;
        var top = objTL.y;
  
        if (objBounds.left < canvasTL.x) left = 0;
        if (objBounds.top < canvasTL.y) top = 0;
        if ((objBounds.top + objBounds.height) > canvasBR.y) top = canvasBR.y - objBounds.height;
        if ((objBounds.left + objBounds.width) > canvasBR.x) left = canvasBR.x - objBounds.width;
  
        this.rect.setPositionByOrigin(new fabric.Point(left, top), "left", "top");
        this.rect.setCoords();
        canvas.renderAll();
    }
      canvas.renderAll();
    }
  }

  doMouseUp(o) {
    this.isDown = true;
    this.isDragging = false;
  }
}

export default Rectangle;