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

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactResizeDetector = _interopRequireDefault(require("react-resize-detector"));

var _NvistaRoiSettingsPanel = _interopRequireDefault(require("./NvistaRoiSettingsPanel"));

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

var fabric = require('fabric').fabric;
/**
 * Sketch Tool based on FabricJS for React Applications
 */


var MiraMode = /*#__PURE__*/function (_PureComponent) {
  (0, _inherits2.default)(MiraMode, _PureComponent);

  var _super = _createSuper(MiraMode);

  function MiraMode() {
    var _this;

    (0, _classCallCheck2.default)(this, MiraMode);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {
      parentWidth: 550,
      action: true,
      imageUrl: null,
      scaleFactor: 1,
      rotation: 0,
      flipApplied: false,
      crosshairMode: false,
      crosshairMoveMode: false,
      crosshairDeleteMode: false,
      deleteAllLandmarks: false,
      resetAllLandmarks: false
    };
    _this._fc = null;

    _this.disableTouchScroll = function () {
      var canvas = _this._fc;

      if (canvas.allowTouchScrolling) {
        canvas.allowTouchScrolling = false;
      }
    };

    _this.addImg = function (dataUrl) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var canvas = _this._fc; // canvas.clear();
      // let canvas = this._fc = new fabric.Canvas("roi-canvas", { centeredRotation: true, centeredScaling: true });

      canvas.clear();

      _this._resize();

      fabric.Image.fromURL(dataUrl, function (oImg) {
        var widthFactor = canvas.getWidth() / oImg.width;
        var heightFactor = canvas.getHeight() / oImg.height;
        var scaleFactor = Math.min(widthFactor, heightFactor);
        oImg.set({
          selectable: false,
          hasControls: false,
          hasBorders: false,
          hasRotatingPoint: false
        });
        oImg.scale(scaleFactor);
        canvas.add(oImg);

        _this.setState({
          scaleFactor: scaleFactor
        });

        canvas.renderAll();
      });
    };

    _this._resize = function (e) {
      var canvasWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var canvasHeight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var canvas = _this._fc;

      if (canvas && canvas.upperCanvasEl) {
        var overlayWidth = document.getElementById("onep-twop-container-2").offsetWidth;
      } else {
        var overlayWidth = document.getElementById("oneptwop-container").offsetWidth;
      } // var overlayWidth = document.getElementById("onep-twop-container-2").offsetWidth;
      // var overlayHeight = document.getElementById("onep-twop-container-2").offsetHeight;


      var overlayHeight = Math.round(800 / (1280 / overlayWidth));
      var overlayContrain = overlayWidth / overlayHeight;
      console.log('[ONEPTWOP] Color Overlay Width:', overlayWidth, overlayHeight, overlayContrain);

      _this.getCanvasAtResoution(overlayWidth, overlayHeight, false);
    };

    _this.getCanvasAtResoution = function (newWidth, newHeight) {
      var scaleLandmarks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var canvas = _this._fc; // let { offsetWidth, clientHeight } = this._container;

      if (canvas && canvas.width !== newWidth && canvas.upperCanvasEl) {
        var scaleMultiplier = newWidth / canvas.width;
        var scaleHeightMultiplier = newHeight / canvas.height;
        var objects = canvas.getObjects();

        for (var i in objects) {
          if (objects[i].type === "image" || scaleLandmarks) {
            console.log(objects[i].type, "type"); // objects[i].width = objects[i].width * scaleMultiplier;
            // objects[i].height = objects[i].height * scaleHeightMultiplier;

            objects[i].scaleX = objects[i].scaleX * scaleMultiplier;
            objects[i].scaleY = objects[i].scaleY * scaleMultiplier;
            objects[i].setCoords();
            var scaleFactor = _this.state.scaleFactor * scaleMultiplier;

            _this.setState({
              scaleFactor: scaleFactor
            });
          }

          console.log(objects[i].type, "type"); // objects[i].scaleX = objects[i].scaleX * scaleMultiplier;
          // objects[i].scaleY = objects[i].scaleY * scaleMultiplier;

          objects[i].left = objects[i].left * scaleMultiplier;
          objects[i].top = objects[i].top * scaleMultiplier;
          objects[i].cnWidth = canvas.getWidth() * scaleMultiplier;
          objects[i].cnHeight = canvas.getHeight() * scaleHeightMultiplier;
          objects[i].setCoords();
        }

        var obj = canvas.backgroundImage;

        if (obj) {
          obj.scaleX = obj.scaleX * scaleMultiplier;
          obj.scaleY = obj.scaleY * scaleMultiplier;
        }

        console.log("[ONEPTWOP] Resize Canvas Dimensions: ", canvas.getWidth() * scaleMultiplier, canvas.getHeight() * scaleHeightMultiplier);
        canvas.discardActiveObject();
        canvas.setWidth(canvas.getWidth() * scaleMultiplier);
        canvas.setHeight(canvas.getHeight() * scaleHeightMultiplier);
        canvas.renderAll();
        canvas.calcOffset(); // this.setState({
        //   parentWidth: offsetWidth
        // });

        var boss = canvas.getObjects().filter(function (o) {
          return o.type == "image";
        })[0];

        if (boss) {
          _this.bindLandmarks();
        }
      }
    };

    _this.bindLandmarks = function () {
      var canvas = _this._fc;
      var multiply = fabric.util.multiplyTransformMatrices;
      var invert = fabric.util.invertTransform;
      var boss = canvas.getObjects().filter(function (o) {
        return o.type == "image";
      });
      var minions = canvas.getObjects().filter(function (o) {
        return o.type !== "image";
      });
      var bossTransform = boss[0].calcTransformMatrix();
      var invertedBossTransform = invert(bossTransform);
      minions.forEach(function (o) {
        var desiredTransform = multiply(invertedBossTransform, o.calcTransformMatrix()); // save the desired relation here.

        o.relationship = desiredTransform;
      });
    };

    _this.componentDidMount = function () {
      var canvas = _this._fc = new fabric.Canvas(_this._canvas, {
        centeredRotation: true,
        centeredScaling: true
      }); // Control resize

      window.addEventListener('resize', _this._resize, false);

      _this.disableTouchScroll();

      _this._resize();
    };

    _this.componentWillUnmount = function () {
      return window.removeEventListener('resize', _this._resize);
    };

    _this.componentDidUpdate = function (prevProps, prevState) {
      // console.log(this.props, "props");
      var canvas = _this._fc;

      if (_this.state.parentWidth !== prevState.parentWidth || _this.props.width !== prevProps.width || _this.props.height !== prevProps.height) {
        _this._resize();
      }

      if (_this.props.image !== _this.state.imageUrl) {
        console.log("value is coming in component did updateeeee iff image props -- > ", _this.props.image, " and ---- >>>>>> ", _this.props.oneptwop);

        _this.addImg(_this.props.image);

        _this.setState({
          imageUrl: _this.props.image,
          scaleFactor: _this.state.scaleFactor,
          rotation: _this.props.oneptwop.inscopix.adapter_lsm.rotation,
          flipApplied: _this.props.oneptwop.inscopix.adapter_lsm.flip_horizontal
        });
      } // if (this.props.callResize !== this.state.callResize) {
      // this._resize();
      // this.setState({ callResize: this.props.callResize });
      // }


      if (_this.props.oneptwop.inscopix.adapter_lsm.rotation !== _this.state.rotation && _this._fc.item(0)) {
        _this.rotateAndScale(_this._fc.item(0), -_this.props.oneptwop.inscopix.adapter_lsm.rotation);

        _this.updateLandmarksPosition();

        _this._fc.renderAll();

        _this.setState({
          rotation: _this.props.oneptwop.inscopix.adapter_lsm.rotation
        });
      }

      if (_this.props.oneptwop.inscopix.adapter_lsm.flip_horizontal !== _this.state.flipApplied) {
        _this.applyFlip(_this.props.oneptwop.inscopix.adapter_lsm.flip_horizontal, false);

        _this.setState({
          flipApplied: _this.props.oneptwop.inscopix.adapter_lsm.flip_horizontal
        });
      }

      if (_this.props.crosshairMode !== _this.state.crosshairMode) {
        _this.setState({
          crosshairMode: _this.props.crosshairMode
        });
      }

      if (_this.props.crosshairMoveMode !== _this.state.crosshairMoveMode) {
        _this.setState({
          crosshairMoveMode: _this.props.crosshairMoveMode
        });
      }

      if (_this.props.crosshairDeleteMode !== _this.state.crosshairDeleteMode) {
        _this.setState({
          crosshairDeleteMode: _this.props.crosshairDeleteMode
        });
      }

      if (_this.props.deleteAllLandmarks !== _this.state.deleteAllLandmarks) {
        _this.setState({
          deleteAllLandmarks: _this.props.deleteAllLandmarks
        });
      }

      if (_this.props.resetAllLandmarks !== _this.state.resetAllLandmarks) {
        _this.setState({
          resetAllLandmarks: _this.props.resetAllLandmarks
        });
      }

      if (_this.props.activePanels !== prevProps.activePanels) {
        _this._resize();
      }
    };

    _this.onChangeSize = function (width, height) {
      // if (this.state.imageUrl !== null) {
      // this.addImg(this.state.imageUrl);
      // // if (this.state.rotation !== 0 && this._fc.item(0)) {
      // // this.rotateAndScale(this._fc.item(0), -this.state.rotation, this._fc, this.state.scaleFactor);
      // // this._fc.renderAll();
      // // }
      // }
      _this._resize();
    };

    _this.updateLandmarksPosition = function () {
      var multiply = fabric.util.multiplyTransformMatrices;
      var invert = fabric.util.invertTransform;

      var boss = _this._fc.getObjects().filter(function (o) {
        return o.type == 'image';
      })[0];

      var minions = _this._fc.getObjects().filter(function (o) {
        return o !== boss;
      });

      minions.forEach(function (o) {
        if (!o.relationship) {
          return;
        }

        var relationship = o.relationship;
        var newTransform = multiply(boss.calcTransformMatrix(), relationship);
        var opt = fabric.util.qrDecompose(newTransform);
        o.set({
          flipX: false,
          flipY: false
        });
        o.setPositionByOrigin({
          x: opt.translateX,
          y: opt.translateY
        }, 'center', 'center');
        o.set(opt);
        o.setCoords();
      });
    };

    _this.applyFlip = function (value, updateOnepTwop) {
      _this._fc.item(0).set({
        flipX: value
      });

      _this._fc.item(0).setCoords();

      _this.updateLandmarksPosition();
      /*if(updateOnepTwop) {
      window.updateOnepTwopData('_transform', []);
      } */


      _this._fc.requestRenderAll();

      _this._fc.renderAll();
    };

    _this.rotateAndScale = function (obj, angle) {
      if (obj) {
        var width = _this._fc.getWidth();

        var height = _this._fc.getHeight();

        var cos_theta = Math.cos(angle * Math.PI / 180);
        var sin_theta = Math.sin(angle * Math.PI / 180);
        var x_scale = width / (Math.abs(width * cos_theta) + Math.abs(height * sin_theta));
        var y_scale = height / (Math.abs(width * sin_theta) + Math.abs(height * cos_theta));
        var scale = Math.min(x_scale, y_scale);
        var actScale = _this.state.scaleFactor * scale; // get the transformMatrix array

        var rotateMatrix = [cos_theta, -sin_theta, sin_theta, cos_theta, 0, 0];
        var scaleMatrix = [actScale, 0, 0, actScale, 0, 0];
        var rsT = fabric.util.multiplyTransformMatrices(rotateMatrix, scaleMatrix); // Unfold the matrix in a combination of scaleX, scaleY, skewX, skewY...

        var options = fabric.util.qrDecompose(rsT); // console.log(options, "options");

        var newCenter = {
          x: _this._fc.getWidth() / 2,
          y: _this._fc.getHeight() / 2
        }; // reset transformMatrix to identity and resets flips since negative scale resulting from decompose, will automatically set them.
        //obj.flipX = false;

        obj.flipY = false;
        obj.set(options); // position the object in the center given from translateX and translateY

        obj.setPositionByOrigin(newCenter, 'center', 'center');
        obj.setCoords();
      }
    };

    _this.updateLandmarks = function () {
      var currentRotation = _this.props.oneptwop.inscopix.adapter_lsm.rotation;
      var isFliped = _this.props.oneptwop.inscopix.adapter_lsm.flip_horizontal;

      if (isFliped) {
        _this.applyFlip(false, true);
      }

      _this.props.updateSlider(0);

      var points = [];

      if (_this.props.oneptwop.inscopix.frontend.length > 0) {
        _this.props.oneptwop.inscopix.frontend = _this.props.oneptwop.inscopix.frontend.filter(function (o) {
          return o.type !== "image";
        });

        _this.props.oneptwop.inscopix.frontend.map(function (item, key) {
          var x, y;
          x = item.left + item.width / 2;
          y = item.top + item.height / 2;
          points.push({
            x: x,
            y: y
          });
        });

        _this.props.oneptwop.inscopix.landmarks = {
          points: points
        };
      } else {
        _this.props.oneptwop.inscopix.landmarks = {
          points: []
        };
      }

      _this.props.updateSlider(currentRotation);

      if (isFliped) {
        _this.applyFlip(true, true);
      }
    };

    _this.updateOnepTwop = function (saveAs) {
      var landmarks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      console.log("updateOnepTwop method"); // if (this.sbpfApplyClick) {
      //   this.oneptwop.inscopix.bpf = {
      //     sigma1: $("#deltaSBFSnapSigmaOne").val() * 1,
      //     sigma2: $("#deltaSBFSnapSigmaTwo").val() * 1,
      //     offset: $("#deltaSBFSnapOffset").val() * 1,
      //     gain: $("#deltaSBFSnapGain").val() * 1
      //   }
      // }
      // this.oneptwop.inscopix.adapter_lsm = {
      //   rotation: parseInt($(".transforms-rotate-data").val()),
      //   flip_horizontal: $("#flip-horizontal").hasClass("active")
      // };

      var landMarks = _this._fc ? JSON.parse(JSON.stringify(_this._fc.toJSON(['cnWidth', 'cnHeight']))) : [];
      var oneptwop = _this.props.oneptwop;
      oneptwop.inscopix.frontend = landMarks.objects.filter(function (o) {
        return o.type !== "image";
      });

      _this.props.oneptwopFrontend(oneptwop);
    };

    _this.removeAddOrMoveMode = function () {
      window.canvas = _this._fc;

      if (window.canvas.upperCanvasEl) {
        window.canvas.discardActiveObject();
        window.canvas.forEachObject(function (o) {
          o.selectable = false;
        });
        window.canvas.off('mouse:up');
        window.canvas.hoverCursor = window.canvas.defaultCursor = 'default';
        window.canvas.renderAll();
      }
    };

    _this.render = function () {
      var _this$props = _this.props,
          className = _this$props.className,
          style = _this$props.style,
          width = _this$props.width,
          height = _this$props.height;
      var containerH = 512;

      if (_this._fc) {
        containerH = _this._fc.height;
      }

      var canvasDivStyle = Object.assign({}, style ? style : {}, width ? {
        width: '100%'
      } : {
        width: '100%'
      }, height ? {
        height: height
      } : {
        height: containerH
      });
      return /*#__PURE__*/_react.default.createElement("div", {
        className: className,
        ref: function ref(c) {
          return _this._container = c;
        },
        style: canvasDivStyle,
        id: "onep-twop-container-2"
      }, /*#__PURE__*/_react.default.createElement(_reactResizeDetector.default, {
        onResize: _this.onChangeSize.bind((0, _assertThisInitialized2.default)(_this))
      }), /*#__PURE__*/_react.default.createElement("div", {
        style: {
          position: 'absolute'
        }
      }, /*#__PURE__*/_react.default.createElement("canvas", {
        ref: function ref(c) {
          return _this._canvas = c;
        }
      }, "Sorry, Canvas HTML5 element is not supported by your browser :(")), _this._fc !== null && _this._fc.item(0) && /*#__PURE__*/_react.default.createElement(_NvistaRoiSettingsPanel.default, {
        canvasProps: _this._fc,
        landMarks: _this.props.oneptwop.inscopix.frontend,
        imageData: _this.props.oneptwop,
        oneptwop: _this.props.oneptwop,
        rotateAndScale: _this.rotateAndScale,
        crosshairMode: _this.state.crosshairMode,
        crosshairMoveMode: _this.state.crosshairMoveMode,
        crosshairDeleteMode: _this.state.crosshairDeleteMode,
        deleteAllLandmarks: _this.state.deleteAllLandmarks,
        oneptwopCompare: _this.props.oneptwopCompare,
        oneptwopDefault: _this.props.oneptwopDefault,
        updateSlider: _this.props.updateSlider,
        applyFlip: _this.applyFlip,
        resetAllLandmarks: _this.state.resetAllLandmarks,
        updateOnepTwop: _this.updateOnepTwop,
        loadFromSession: _this.props.loadFromSession,
        updateSbpfTransformValues: _this.props.updateSbpfTransformValues,
        handleMiraErrorPopup: _this.props.handleMiraErrorPopup
      }));
    };

    return _this;
  }

  (0, _createClass2.default)(MiraMode, [{
    key: "__reactstandin__regenerateByEval",
    value: // @ts-ignore
    function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);
  return MiraMode;
}(_react.PureComponent);

MiraMode.propTypes = {
  // outside the component
  value: _propTypes.default.object,
  // Specify action on change
  onChange: _propTypes.default.func,
  // Sketch width
  width: _propTypes.default.number,
  // Sketch height
  height: _propTypes.default.number,
  // Class name to pass to container div of canvas
  className: _propTypes.default.string,
  // Style options to pass to container div of canvas
  style: _propTypes.default.object,
  //add image
  image: _propTypes.default.string,
  //resize
  callResize: _propTypes.default.bool
};
MiraMode.defaultProps = {
  image: null,
  callResize: false
};
var _default = MiraMode;
var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(fabric, "fabric", "/Users/vivekgakhar/inscopix/2.0.0-alpha2/react-sketch/src/MiraMode.js");
  reactHotLoader.register(MiraMode, "MiraMode", "/Users/vivekgakhar/inscopix/2.0.0-alpha2/react-sketch/src/MiraMode.js");
  reactHotLoader.register(_default, "default", "/Users/vivekgakhar/inscopix/2.0.0-alpha2/react-sketch/src/MiraMode.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();