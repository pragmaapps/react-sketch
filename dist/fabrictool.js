"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

/* eslint no-unused-vars: 0 */

/**
 * "Abstract" like base class for a Canvas tool
 */
var FabricCanvasTool = /*#__PURE__*/function () {
  function FabricCanvasTool(canvas) {
    (0, _classCallCheck2.default)(this, FabricCanvasTool);
    this._canvas = canvas;
  }

  (0, _createClass2.default)(FabricCanvasTool, [{
    key: "configureCanvas",
    value: function configureCanvas(props) {}
  }, {
    key: "doMouseUp",
    value: function doMouseUp(event) {}
  }, {
    key: "doMouseDown",
    value: function doMouseDown(event) {}
  }, {
    key: "doMouseMove",
    value: function doMouseMove(event) {}
  }, {
    key: "doMouseOut",
    value: function doMouseOut(event) {}
  }, {
    key: "__reactstandin__regenerateByEval",
    value: // @ts-ignore
    function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);
  return FabricCanvasTool;
}();

var _default = FabricCanvasTool;
var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(FabricCanvasTool, "FabricCanvasTool", "/home/vishal/code/react-sketch/src/fabrictool.js");
  reactHotLoader.register(_default, "default", "/home/vishal/code/react-sketch/src/fabrictool.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();