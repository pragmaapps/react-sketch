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

var _utils = require("./utils");

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

var Circle = /*#__PURE__*/function (_FabricCanvasTool) {
  (0, _inherits2.default)(Circle, _FabricCanvasTool);

  var _super = _createSuper(Circle);

  function Circle() {
    (0, _classCallCheck2.default)(this, Circle);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(Circle, [{
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
    }
  }, {
    key: "doMouseDown",
    value: function doMouseDown(o) {
      var canvas = this._canvas;
      this.isDown = true;
      var pointer = canvas.getPointer(o.e);
      var _ref = [pointer.x, pointer.y];
      this.startX = _ref[0];
      this.startY = _ref[1];
      this.circle = new fabric.Circle({
        left: this.startX,
        top: this.startY,
        originX: 'left',
        originY: 'center',
        strokeWidth: this._width,
        stroke: this._color,
        fill: this._fill,
        selectable: false,
        evented: false,
        radius: 1
      });
      canvas.add(this.circle);
    }
  }, {
    key: "doMouseMove",
    value: function doMouseMove(o) {
      if (!this.isDown) return;
      var canvas = this._canvas;
      var pointer = canvas.getPointer(o.e);
      this.circle.set({
        radius: (0, _utils.linearDistance)({
          x: this.startX,
          y: this.startY
        }, {
          x: pointer.x,
          y: pointer.y
        }) / 2,
        angle: Math.atan2(pointer.y - this.startY, pointer.x - this.startX) * 180 / Math.PI
      });
      this.circle.setCoords();
      canvas.renderAll();
    }
  }, {
    key: "doMouseUp",
    value: function doMouseUp(o) {
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
  return Circle;
}(_fabrictool.default);

var _default = Circle;
var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(fabric, "fabric", "/home/vishal/code/react-sketch/src/circle.js");
  reactHotLoader.register(Circle, "Circle", "/home/vishal/code/react-sketch/src/circle.js");
  reactHotLoader.register(_default, "default", "/home/vishal/code/react-sketch/src/circle.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();