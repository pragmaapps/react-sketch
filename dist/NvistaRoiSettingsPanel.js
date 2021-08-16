"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = _interopRequireWildcard(require("react"));

var _fabric = require("fabric");

var _plus = _interopRequireDefault(require("../docs/img/plus.svg"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

var NvistaRoiSettings = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(NvistaRoiSettings, _Component);

  var _super = _createSuper(NvistaRoiSettings);

  function NvistaRoiSettings(props) {
    var _this;

    (0, _classCallCheck2.default)(this, NvistaRoiSettings);
    _this = _super.call(this, props);
    _this.state = {
      canvas: null,
      checked: true,
      lmColor: ['#ff0000', '#0000ff', '#ffff00', '#ff00ff', '#00ff00', '#00ffff', '#ffa500', '#ffffff', '#008000', '#800080'],
      lmColorUsed: ['#ff0000', '#0000ff', '#ffff00', '#ff00ff', '#00ff00', '#00ffff', '#ffa500', '#ffffff', '#008000', '#800080'],
      lmColorIndex: 0,
      crosshairMode: false,
      crosshairMoveMode: false,
      crosshairDeleteMode: false,
      deleteAllLandmarks: false,
      resetAllLandmarks: false
    };
    _this.deleteAll = _this.deleteAll.bind((0, _assertThisInitialized2.default)(_this));
    _this.enterCrosshairMode = _this.enterCrosshairMode.bind((0, _assertThisInitialized2.default)(_this));
    _this.exitCrosshairMode = _this.exitCrosshairMode.bind((0, _assertThisInitialized2.default)(_this));
    _this.deleteCrosshairMode = _this.deleteCrosshairMode.bind((0, _assertThisInitialized2.default)(_this));
    _this.scaleObj = _this.scaleObj.bind((0, _assertThisInitialized2.default)(_this));
    _this.bindLandmarks = _this.bindLandmarks.bind((0, _assertThisInitialized2.default)(_this));
    _this.resetLandmarks = _this.resetLandmarks.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(NvistaRoiSettings, [{
    key: "resetLandmarks",
    value: function resetLandmarks() {
      var self = this;

      if (this.props.oneptwopCompare.inscopix.adapter_lsm.rotation !== this.props.oneptwop.inscopix.adapter_lsm.rotation) {
        self.props.updateSlider(this.props.oneptwopCompare.inscopix.adapter_lsm.rotation, true);
      }

      if (this.props.oneptwopCompare.inscopix.adapter_lsm.flip_horizontal !== this.props.oneptwop.inscopix.adapter_lsm.flip_horizontal) {
        self.props.applyFlip(this.props.oneptwopCompare.inscopix.adapter_lsm.flip_horizontal, false);
      }

      var objects = this.props.canvasProps.getObjects('path');

      for (var i in objects) {
        this.props.canvasProps.remove(objects[i]);
      }

      var defaultColors = ['#ff0000', '#0000ff', '#ffff00', '#ff00ff', '#00ff00', '#00ffff', '#ffa500', '#ffffff', '#008000', '#800080'];

      _fabric.fabric.util.enlivenObjects(this.props.oneptwopCompare.inscopix.frontend, function (objects) {
        var origRenderOnAddRemove = self.props.canvasProps.renderOnAddRemove;
        self.props.canvasProps.renderOnAddRemove = false;
        objects.forEach(function (o) {
          self.props.canvasProps.add(o);
        });
        self.props.canvasProps.renderOnAddRemove = origRenderOnAddRemove;

        if (self.props.canvasProps.item(1) && self.props.canvasProps.item(1).cnWidth !== self.props.canvasProps.getWidth()) {
          var scaleMultiplier = self.props.canvasProps.getWidth() / self.props.canvasProps.item(1).cnWidth;
          var objects = self.props.canvasProps.getObjects();

          for (var i in objects) {
            if (objects[i].type !== "image") {
              objects[i].left = objects[i].left * scaleMultiplier;
              objects[i].top = objects[i].top * scaleMultiplier;
              objects[i].cnWidth = self.props.canvasProps.getWidth();
              objects[i].cnHeight = self.props.canvasProps.getHeight();
              objects[i].setCoords();
            }
          }
        }

        self.bindLandmarks(true, true);
        self.props.canvasProps.renderAll();
        self.setState({
          lmColorUsed: defaultColors
        }, function () {
          var fabricList = JSON.parse(JSON.stringify(self.props.canvasProps.getObjects().filter(function (o) {
            return o.type !== "image";
          })));
          fabricList.map(function (item, key) {
            var color = item.fill;
            self.state.lmColorUsed.map(function (item, index) {
              if (item == color) {
                self.state.lmColorUsed.splice(index, 1);
              }
            });
          });

          if (self.props.oneptwopCompare.inscopix.adapter_lsm.rotation !== self.props.oneptwop.inscopix.adapter_lsm.rotation) {
            self.props.updateSlider(self.props.oneptwop.inscopix.adapter_lsm.rotation, false);
          }

          if (self.props.oneptwopCompare.inscopix.adapter_lsm.flip_horizontal !== self.props.oneptwop.inscopix.adapter_lsm.flip_horizontal) {
            self.props.applyFlip(self.props.oneptwop.inscopix.adapter_lsm.flip_horizontal, false);
          }

          self.props.oneptwop.inscopix.frontend = JSON.parse(JSON.stringify(self.props.oneptwopCompare.inscopix.frontend));
        });
      });
    }
  }, {
    key: "deleteAll",
    value: function deleteAll() {
      var objects = this.props.canvasProps.getObjects('path');

      for (var i in objects) {
        this.props.canvasProps.remove(objects[i]);
      }

      this.props.canvasProps.renderAll();
      var defaultColors = ['#ff0000', '#0000ff', '#ffff00', '#ff00ff', '#00ff00', '#00ffff', '#ffa500', '#ffffff', '#008000', '#800080']; // document.getElementById("clearAllLandmark").classList.add("active");

      /*document.getElementById("addLandmark").classList.remove("active");
      document.getElementById("moveLandmark").classList.remove("active");
      document.getElementById("deleteLandmark").classList.remove("active");*/

      this.setState({
        canvas: this.props.canvasProps,
        lmColorIndex: 0,
        lmColorUsed: defaultColors
      }); // setTimeout(() => {
      //     document.getElementById("clearAllLandmark").classList.remove("active");
      // }, 1000)

      var landMarks = this.props.canvasProps ? JSON.parse(JSON.stringify(this.props.canvasProps.getObjects().filter(function (o) {
        return o.type !== "image";
      }))) : [];
      this.props.updateOnepTwop('_landmarks', landMarks);
    }
  }, {
    key: "enterCrosshairMode",
    value: function enterCrosshairMode() {
      console.log("[MIRA] landmarks mode: add landmarks");
      var self = this;
      self.props.canvasProps.forEachObject(function (o) {
        o.selectable = false;
      });
      self.props.canvasProps.hoverCursor = 'pointer';
      self.props.canvasProps.off('mouse:up');
      self.props.canvasProps.on('mouse:up', function (event) {
        var landmarkList = JSON.parse(JSON.stringify(self.props.canvasProps.getObjects()));

        if (landmarkList && landmarkList.length > 10) {
          self.props.handleMiraErrorPopup("Only 10 landmarks are allowed. Please remove a landmark before adding additional landmark.", "Warning");
          return false;
        }

        if (!event.target || event.target.type !== 'image') {
          return false;
        }

        var pointer = self.props.canvasProps.getPointer(event.e, true);

        _fabric.fabric.loadSVGFromURL(_plus.default, function (objects, options) {
          var obj = _fabric.fabric.util.groupSVGElements(objects, options);
          /*obj.toObject = (function(toObject) {
              return function() {
                return fabric.util.object.extend(toObject.call(this), {
                  cnWidth: this.cnWidth,
                  cnHeight: this.cnHeight
                });
              };
          })(obj.toObject);*/


          obj.set({
            fill: self.state.lmColorUsed[0],
            left: Math.round(pointer.x),
            top: Math.round(pointer.y),
            originX: 'center',
            originY: 'center',
            hasControls: false,
            hasBorders: true,
            hasRotatingPoint: false,
            borderColor: '#ffffff',
            scaleX: 1,
            scaleY: 1,
            selectable: false,
            borderOpacityWhenMoving: 1,
            lockScalingX: true,
            lockScalingY: true,
            noScaleCache: false
          });
          obj.cnWidth = self.props.canvasProps.getWidth();
          obj.cnHeight = self.props.canvasProps.getHeight();
          self.scaleObj(obj, -self.props.oneptwop.inscopix.adapter_lsm.rotation);
          self.props.canvasProps.add(obj).requestRenderAll();
          self.state.lmColorUsed.splice(0, 1);
          self.bindLandmarks(true, true);
          self.props.canvasProps.requestRenderAll();
        });
      });
    }
  }, {
    key: "scaleObj",
    value: function scaleObj(obj, angle) {
      var self = this;
      var width = self.props.canvasProps.getWidth();
      var height = self.props.canvasProps.getHeight();
      var cos_theta = Math.cos(angle * Math.PI / 180);
      var sin_theta = Math.sin(angle * Math.PI / 180);
      var x_scale = width / (Math.abs(width * cos_theta) + Math.abs(height * sin_theta));
      var y_scale = height / (Math.abs(width * sin_theta) + Math.abs(height * cos_theta));
      var scale = Math.min(x_scale, y_scale); // get the transformMatrix array

      var rotateMatrix = [cos_theta, -sin_theta, sin_theta, cos_theta, 0, 0];
      var scaleMatrix = [scale, 0, 0, scale, 0, 0]; //var scaleMatrix = [scale, 0 , 0, scale, 0, 0];

      var rsT = _fabric.fabric.util.multiplyTransformMatrices(rotateMatrix, scaleMatrix); // Unfold the matrix in a combination of scaleX, scaleY, skewX, skewY...


      var options = _fabric.fabric.util.qrDecompose(rsT);

      obj.set(options);
      obj.setCoords();
    }
  }, {
    key: "exitCrosshairMode",
    value: function exitCrosshairMode(event) {
      console.log("[MIRA] landmarks mode: move landmarks");
      var self = this; // document.getElementById("clearAllLandmark").classList.remove("active");
      // document.getElementById("deleteLandmark").classList.remove("active");
      // document.getElementById("addLandmark").classList.remove("active");
      // document.getElementById("moveLandmark").classList.add("active");

      self.props.canvasProps.forEachObject(function (o) {
        if (o.type !== "image") {
          o.selectable = true;
        }
      });
      self.props.canvasProps.hoverCursor = 'pointer';
      self.props.canvasProps.off('mouse:up');
      self.props.canvasProps.on('mouse:up', function () {});
      self.props.canvasProps.on('object:moving', function (options) {
        self.props.canvasProps.hoverCursor = 'pointer';
      });
    }
  }, {
    key: "deleteCrosshairMode",
    value: function deleteCrosshairMode(event) {
      console.log("[MIRA] Landmarks mode: delete landmarks");
      var self = this; // document.getElementById("clearAllLandmark").classList.remove("active");
      // document.getElementById("addLandmark").classList.remove("active");
      // document.getElementById("moveLandmark").classList.remove("active");
      // document.getElementById("deleteLandmark").classList.add("active");

      self.props.canvasProps.defaultCursor = 'default';
      self.props.canvasProps.forEachObject(function (o) {
        o.selectable = false;
      });
      self.props.canvasProps.hoverCursor = 'pointer';
      self.props.canvasProps.off('mouse:up');
      self.props.canvasProps.on('mouse:up', function (options) {
        if (options.target && options.target.type == 'path') {
          self.state.lmColorUsed.push(options.target.fill);
          self.props.canvasProps.remove(options.target);
        }

        var landMarks = self.props.canvasProps ? JSON.parse(JSON.stringify(self.props.canvasProps.getObjects().filter(function (o) {
          return o.type !== "image";
        }))) : [];
        console.log("[MIRA] List of Landmarks after deleting objects: ", JSON.stringify(landMarks));
        self.props.updateOnepTwop('_landmarks', landMarks);
      });
    }
  }, {
    key: "bindLandmarks",
    value: function bindLandmarks() {
      var updateLandmarks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var updateForOtherWindow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var self = this;
      var multiply = _fabric.fabric.util.multiplyTransformMatrices;
      var invert = _fabric.fabric.util.invertTransform;
      var boss = self.props.canvasProps.getObjects().filter(function (o) {
        return o.type == "image";
      });
      var minions = self.props.canvasProps.getObjects().filter(function (o) {
        return o.type !== "image";
      });

      if (boss && boss[0]) {
        var bossTransform = boss[0].calcTransformMatrix();
        var invertedBossTransform = invert(bossTransform);
        minions.forEach(function (o) {
          var desiredTransform = multiply(invertedBossTransform, o.calcTransformMatrix()); // save the desired relation here.

          o.relationship = desiredTransform;
        });

        if (updateLandmarks) {
          var landMarks = self.props.canvasProps ? JSON.parse(JSON.stringify(self.props.canvasProps.getObjects().filter(function (o) {
            return o.type !== "image";
          }))) : [];
          this.props.updateOnepTwop('_landmarks', updateForOtherWindow);
          console.log("[MIRA] Updated list of landmarks objects: ", JSON.stringify(landMarks));
        }
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var self = this;
      _fabric.fabric.Object.prototype.objectCaching = false;
      window.canvas = self.props.canvasProps;
      self.props.canvasProps.selection = false;
      var imageObject = JSON.parse(JSON.stringify(self.props.canvasProps.getObjects()));
      var landMarks = this.props.landMarks;

      if (landMarks.length > 0) {
        landMarks.splice(0, 0, imageObject[0]);
      } else {
        landMarks = imageObject;
      }

      self.props.canvasProps.loadFromJSON("{\"objects\":".concat(JSON.stringify(landMarks), "}"), function () {
        if (self.props.imageData) {
          self.props.updateSbpfTransformValues(self.props.imageData, self.props.loadFromSession);
        } else {
          self.props.rotateAndScale(self.props.canvasProps.item(0), -0);
        }

        if (self.props.canvasProps.item(1) && self.props.canvasProps.item(1).cnWidth !== self.props.canvasProps.getWidth()) {
          var scaleMultiplier = self.props.canvasProps.getWidth() / self.props.canvasProps.item(1).cnWidth;
          var objects = self.props.canvasProps.getObjects();

          for (var i in objects) {
            if (objects[i].type !== "image") {
              objects[i].left = objects[i].left * scaleMultiplier;
              objects[i].top = objects[i].top * scaleMultiplier;
              objects[i].cnWidth = self.props.canvasProps.getWidth();
              objects[i].cnHeight = self.props.canvasProps.getHeight();
              objects[i].setCoords();
            }
          }
        }

        if (self.props.canvasProps) {
          var fabricList = JSON.parse(JSON.stringify(self.props.canvasProps.getObjects().filter(function (o) {
            return o.type !== "image";
          })));
          fabricList.map(function (item, key) {
            var color = item.fill;
            self.state.lmColorUsed.map(function (item, index) {
              if (item == color) {
                self.state.lmColorUsed.splice(index, 1);
              }
            });
          });
          self.props.canvasProps.forEachObject(function (o) {
            o.selectable = false;
          });
        }

        self.bindLandmarks(true, false);
        self.props.canvasProps.renderAll();
      });
      self.props.canvasProps.hoverCursor = 'default';
      self.props.canvasProps.on('mouse:down', function (options) {
        if (options.target && options.target.type == 'path') {
          options.target.set({
            hasControls: false,
            hasBorders: true,
            hasRotatingPoint: false,
            borderColor: '#ffffff',
            borderOpacityWhenMoving: 1,
            lockScalingX: true,
            lockScalingY: true
          });
        }
      });
      self.props.canvasProps.on('object:modified', function (options) {
        try {
          var obj = options.target;

          if (obj.type == "image") {
            return;
          }

          var canvasTL = new _fabric.fabric.Point(0, 0);
          var canvasBR = new _fabric.fabric.Point(self.props.canvasProps.getWidth(), self.props.canvasProps.getHeight()); //if object not totally contained in canvas, adjust position

          if (!obj.isContainedWithinRect(canvasTL, canvasBR)) {
            var objBounds = obj.getBoundingRect();
            obj.setCoords();
            var objTL = obj.getPointByOrigin("left", "top");
            var left = objTL.x;
            var top = objTL.y;
            if (objBounds.left < canvasTL.x) left = 0;
            if (objBounds.top < canvasTL.y) top = 0;
            if (objBounds.top + objBounds.height > canvasBR.y) top = canvasBR.y - objBounds.height;
            if (objBounds.left + objBounds.width > canvasBR.x) left = canvasBR.x - objBounds.width;
            obj.setPositionByOrigin(new _fabric.fabric.Point(left, top), "left", "top");
            obj.setCoords();
            self.props.canvasProps.renderAll();
          }

          self.bindLandmarks(true, true);
        } catch (err) {
          alert("exception in keepObjectInBounds\n\n" + err.message + "\n\n" + err.stack);
        }
      });
      this.setState({
        canvas: self.props.canvasProps
      }, function () {
        console.log("[MIRA] initial list of landmarks objects: ", JSON.stringify(_this2.props.canvasProps));
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      //console.log("state has been changed>>>>>");
      if (this.props.crosshairMode !== this.state.crosshairMode) {
        this.enterCrosshairMode();
        this.setState({
          crosshairMode: this.props.crosshairMode
        });
      }

      if (this.props.crosshairMoveMode !== this.state.crosshairMoveMode) {
        this.exitCrosshairMode();
        this.setState({
          crosshairMoveMode: this.props.crosshairMoveMode
        });
      }

      if (this.props.crosshairDeleteMode !== this.state.crosshairDeleteMode) {
        this.deleteCrosshairMode();
        this.setState({
          crosshairDeleteMode: this.props.crosshairDeleteMode
        });
      }

      if (this.props.deleteAllLandmarks !== this.state.deleteAllLandmarks) {
        this.deleteAll();
        this.setState({
          deleteAllLandmarks: this.props.deleteAllLandmarks
        });
      }

      if (this.props.resetAllLandmarks !== this.state.resetAllLandmarks) {
        this.resetLandmarks();
        this.setState({
          resetAllLandmarks: this.props.resetAllLandmarks
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.props.canvasProps.clear();
      this.props.canvasProps.dispose();
      this.setState({
        canvas: null,
        lmColorIndex: 0
      });
      console.log("[MIRA]: dispose the canvas and unmount the component");
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react.default.createElement("div", null) // <RoiShapes
      //     deleteAll={this.deleteAll}
      //     enterCrosshairMode={this.enterCrosshairMode}
      //     exitCrosshairMode={this.exitCrosshairMode}
      //     deleteCrosshairMode={this.deleteCrosshairMode}
      //     resetLandmarks={this.resetLandmarks}
      // />
      ;
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    value: // @ts-ignore
    function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);
  return NvistaRoiSettings;
}(_react.Component);

var _default = NvistaRoiSettings;
var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(NvistaRoiSettings, "NvistaRoiSettings", "/Users/vivekgakhar/inscopix/2.0.0-alpha2/react-sketch/src/NvistaRoiSettingsPanel.js");
  reactHotLoader.register(_default, "default", "/Users/vivekgakhar/inscopix/2.0.0-alpha2/react-sketch/src/NvistaRoiSettingsPanel.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();