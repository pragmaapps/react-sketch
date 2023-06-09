import FabricCanvasTool from './fabrictool'

const fabric = require('fabric').fabric;

class FreeDrawLine extends FabricCanvasTool {

  configureCanvas(props) {
    let canvas = this._canvas;
    canvas.isDrawingMode = canvas.selection = false;
    canvas.forEachObject((o) => o.selectable = o.evented = false);
    this._width = props.lineWidth;
    this._color = props.lineColor;
    this.startPoint = null;
    this.objectAdd = false;
  }

  doMouseDown(o) {
    this.isDown = true;
    let canvas = this._canvas;
    var pointer = canvas.getPointer(o.e);

    if (!this.startPoint) {
        // Create new circle for starting point
        this.startPoint = new fabric.Circle({
            radius: 5,
            fill: 'red',
            selectable: false
          });
        this.startPoint.set({ left: pointer.x, top: pointer.y });
        canvas.add(this.startPoint);
    } else {
        // Create new circle for ending point
        if(this.startPoint.left === pointer.x && this.startPoint.top ===pointer.y){
          return;
        }
        var endPoint = new fabric.Circle({
            radius: 5,
            fill: 'red',
            selectable: false
          });
        endPoint.set({ left: pointer.x, top: pointer.y });
        canvas.add(endPoint);

        // Create new line object between points
        var points = [this.startPoint.left, this.startPoint.top, endPoint.left, endPoint.top];
        var line = new fabric.Line(points,{
            strokeWidth: 10,
            fill: this._color,
            stroke: "#fcdc00",
            originX: "center",
            originY: "center",
            selectable: false,
            evented: false,
            id: "calibratedLine",
            enable: true,
            description: "",
            name: "calibratedLine",
            defaultName: "calibratedLine",
        }
        );
        this.objectAdd = true;
        canvas.add(line);
        canvas.remove(this.startPoint);
        canvas.remove(endPoint);

        // Reset starting point
        this.startPoint = null;    
    }
  }

  doMouseMove(o) {
    if (!this.isDown) return;
  }

  doMouseUp(o, props) {
    this.isDown = false;
    const { onLineAdded } = props;
    if(this.objectAdd)
      onLineAdded();
  }

  doMouseOut(o) {
    this.isDown = false;
  }
}

export default FreeDrawLine;