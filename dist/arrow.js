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

(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

var fabric = require('fabric').fabric;

var Arrow = /*#__PURE__*/function (_FabricCanvasTool) {
  (0, _inherits2.default)(Arrow, _FabricCanvasTool);

  var _super = _createSuper(Arrow);

  function Arrow() {
    (0, _classCallCheck2.default)(this, Arrow);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(Arrow, [{
    key: "configureCanvas",
    value: function configureCanvas(props) {
      var canvas = this._canvas;
      canvas.isDrawingMode = canvas.selection = false;
      canvas.forEachObject(function (o) {
        return o.selectable = o.evented = false;
      });
      this._width = props.lineWidth;
      this._color = props.lineColor;
    }
  }, {
    key: "doMouseDown",
    value: function doMouseDown(o) {
      this.isDown = true;
      var canvas = this._canvas;
      var pointer = canvas.getPointer(o.e);
      var points = [pointer.x, pointer.y, pointer.x, pointer.y];
      this.line = new fabric.Line(points, {
        strokeWidth: this._width,
        fill: this._color,
        stroke: this._color,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false
      });
      this.head = new fabric.Triangle({
        fill: this._color,
        left: pointer.x,
        top: pointer.y,
        originX: 'center',
        originY: 'center',
        height: 3 * this._width,
        width: 3 * this._width,
        selectable: false,
        evented: false,
        angle: 90
      });
      canvas.add(this.line);
      canvas.add(this.head);
    }
  }, {
    key: "doMouseMove",
    value: function doMouseMove(o) {
      if (!this.isDown) return;
      var canvas = this._canvas;
      var pointer = canvas.getPointer(o.e);
      this.line.set({
        x2: pointer.x,
        y2: pointer.y
      });
      this.line.setCoords();
      var x_delta = pointer.x - this.line.x1;
      var y_delta = pointer.y - this.line.y1;
      this.head.set({
        left: pointer.x,
        top: pointer.y,
        angle: 90 + Math.atan2(y_delta, x_delta) * 180 / Math.PI
      });
      canvas.renderAll();
    }
  }, {
    key: "doMouseUp",
    value: function doMouseUp(o) {
      this.isDown = false;
      var canvas = this._canvas;
      canvas.remove(this.line);
      canvas.remove(this.head);
      var arrow = new fabric.Group([this.line, this.head]);
      canvas.add(arrow);
    }
  }, {
    key: "doMouseOut",
    value: function doMouseOut(o) {
      this.isDown = false;
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    value: // @ts-ignore
    function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);
  return Arrow;
}(_fabrictool.default);

var _default = Arrow;
var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(fabric, "fabric", "/home/vishal/code/react-sketch/src/arrow.js");
  reactHotLoader.register(Arrow, "Arrow", "/home/vishal/code/react-sketch/src/arrow.js");
  reactHotLoader.register(_default, "default", "/home/vishal/code/react-sketch/src/arrow.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();