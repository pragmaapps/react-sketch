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
var fabric = require('fabric').fabric;

var RectangleLabelObject = /*#__PURE__*/function () {
  function RectangleLabelObject(canvas, text, rectProps, textProps) {
    var _this = this;

    (0, _classCallCheck2.default)(this, RectangleLabelObject);

    this.update = function (e) {
      //e.target.set({scaleX:1, scaleY:1})
      if (!_this._textObj || !_this._rectObj) return;

      if (e.target === _this._rectObj) {
        _this._textObj.set({
          'width': _this._rectObj.getScaledWidth(),
          'scaleX': 1,
          'scaleY': 1,
          'top': _this._rectObj.top - _this._textObj.getScaledHeight(),
          'left': _this._rectObj.left
        });
      }
    };

    this._canvas = canvas;
    this._text = text;
    this._rectObj = new fabric.Rect(rectProps);
    this._textObj = new fabric.Textbox(text, textProps);
    canvas.on({
      'object:scaling': this.update
    });
    canvas.on({
      'object:moving': this.update
    });
  }

  (0, _createClass2.default)(RectangleLabelObject, [{
    key: "setText",
    value: function setText(text) {
      this._text = text;

      this._textObj.set({
        text: text
      });
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    value: // @ts-ignore
    function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);
  return RectangleLabelObject;
}();

var _default = RectangleLabelObject;
var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(fabric, "fabric", "/home/vishal/code/react-sketch/src/rectangle-label-object.js");
  reactHotLoader.register(RectangleLabelObject, "RectangleLabelObject", "/home/vishal/code/react-sketch/src/rectangle-label-object.js");
  reactHotLoader.register(_default, "default", "/home/vishal/code/react-sketch/src/rectangle-label-object.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();