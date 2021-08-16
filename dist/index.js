"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SketchField", {
  enumerable: true,
  get: function get() {
    return _SketchField.default;
  }
});
Object.defineProperty(exports, "Tools", {
  enumerable: true,
  get: function get() {
    return _tools.default;
  }
});
Object.defineProperty(exports, "MiraMode", {
  enumerable: true,
  get: function get() {
    return _MiraMode.default;
  }
});
exports.default = void 0;

var _SketchField = _interopRequireDefault(require("./SketchField"));

var _tools = _interopRequireDefault(require("./tools"));

var _MiraMode = _interopRequireDefault(require("./MiraMode"));

(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

var _default = {
  SketchField: _SketchField.default,
  Tools: _tools.default,
  MiraMode: _MiraMode.default
};
var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(_default, "default", "/Users/vivekgakhar/inscopix/2.0.0-alpha2/react-sketch/src/index.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();