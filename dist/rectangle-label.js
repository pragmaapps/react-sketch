"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _fabrictool = _interopRequireDefault(require("./fabrictool"));

var _rectangleLabelObject = _interopRequireDefault(require("./rectangle-label-object"));

(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

var RectangleLabel = /*#__PURE__*/function (_FabricCanvasTool) {
  (0, _inherits2.default)(RectangleLabel, _FabricCanvasTool);

  var _super = _createSuper(RectangleLabel);

  function RectangleLabel() {
    (0, _classCallCheck2.default)(this, RectangleLabel);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(RectangleLabel, [{
    key: "configureCanvas",
    value: function configureCanvas(props) {
      var canvas = this._canvas;
      canvas.isDrawingMode = canvas.selection = false;
      canvas.forEachObject(function (o) {
        return o.selectable = o.evented = false;
      });
      this._width = props.lineWidth;
      this._color = props.lineColor;
      this._fill = props.fillColor;
      this._textString = props.text;
      this._maxFontSize = 12;
    }
  }, {
    key: "doMouseDown",
    value: function doMouseDown(o) {
      var canvas = this._canvas;
      this.isDown = true;
      var pointer = canvas.getPointer(o.e);
      this.startX = pointer.x;
      this.startY = pointer.y;
      this.rectangleLabel = new _rectangleLabelObject.default(canvas, "New drawing", {
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
        selectable: false,
        evented: false,
        strokeUniform: true,
        noScaleCache: false,
        angle: 0
      }, {
        left: this.startX,
        top: this.startY - 12,
        originX: 'left',
        originY: 'top',
        width: pointer.x - this.startX - this._width,
        height: canvas.height / 3,
        fontSize: this._maxFontSize,
        noScaleCache: false,
        backgroundColor: this._color,
        transparentCorners: true,
        hasControls: false,
        angle: 0
      });
      if (this._objects && this._objects.length > 0) this._objects.push(this.rectangleLabel);else this._objects = [this.rectangleLabel];

      while (this.rectangleLabel._textObj.height > canvas.height / 3) {
        this.rectangleLabel._textObj.set({
          fontSize: this.rectangleLabel._textObj.fontSize - 1,
          top: this.startY - this.rectangleLabel._textObj.fontSize - 12
        });
      }

      canvas.add(this.rectangleLabel._rectObj);
      canvas.add(this.rectangleLabel._textObj);
      canvas.renderAll();
    }
  }, {
    key: "doMouseMove",
    value: function doMouseMove(o) {
      if (!this.isDown) return;
      var canvas = this._canvas;
      var pointer = canvas.getPointer(o.e);

      if (this.startX > pointer.x) {
        this.rectangleLabel._rectObj.set({
          left: Math.abs(pointer.x)
        });

        this.rectangleLabel._textObj.set({
          left: Math.abs(pointer.x)
        });
      }

      if (this.startY > pointer.y) {
        this.rectangleLabel._rectObj.set({
          left: Math.abs(pointer.x)
        });

        this.rectangleLabel._textObj.set({
          top: Math.abs(pointer.y)
        });
      }

      this.rectangleLabel._textObj.setCoords();

      this.rectangleLabel._rectObj.set({
        width: Math.abs(this.startX - pointer.x)
      });

      this.rectangleLabel._textObj.set({
        width: this.rectangleLabel._rectObj.getScaledWidth()
      });

      this.rectangleLabel._rectObj.set({
        height: Math.abs(this.startY - pointer.y)
      });

      this.rectangleLabel._rectObj.setCoords();

      canvas.renderAll();
    }
  }, {
    key: "doMouseUp",
    value: function doMouseUp(o) {
      this.isDown = false;
      var canvas = this._canvas; // var group = new fabric.Group([this.rectangleLabel._rectObj,this.rectangleLabel._textObj]);
      // canvas.remove(this.rectangleLabel._rectObj);
      // canvas.remove(this.rectangleLabel._textObj);
      // canvas.add(group);

      canvas.renderAll();
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    value: // @ts-ignore
    function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);
  return RectangleLabel;
}(_fabrictool.default);

var _default = RectangleLabel;
var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(RectangleLabel, "RectangleLabel", "/home/vishal/code/react-sketch/src/rectangle-label.js");
  reactHotLoader.register(_default, "default", "/home/vishal/code/react-sketch/src/rectangle-label.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();