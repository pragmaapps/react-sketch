"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _history = _interopRequireDefault(require("./history"));

var _utils = require("./utils");

var _select = _interopRequireDefault(require("./select"));

var _pencil = _interopRequireDefault(require("./pencil"));

var _line = _interopRequireDefault(require("./line"));

var _arrow = _interopRequireDefault(require("./arrow"));

var _rectangle = _interopRequireDefault(require("./rectangle"));

var _circle = _interopRequireDefault(require("./circle"));

var _pan = _interopRequireDefault(require("./pan"));

var _tools = _interopRequireDefault(require("./tools"));

var _rectangleLabel = _interopRequireDefault(require("./rectangle-label"));

var _defaulTool = _interopRequireDefault(require("./defaul-tool"));

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


var SketchField = /*#__PURE__*/function (_PureComponent) {
  (0, _inherits2.default)(SketchField, _PureComponent);

  var _super = _createSuper(SketchField);

  function SketchField() {
    var _this;

    (0, _classCallCheck2.default)(this, SketchField);

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
      resetAllLandmarks: false,
      frontEnd: [],
      canvasHeight: 512,
      updateLandmarksForOtherWindow: false,
      lmColorUsed: ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000']
    };
    _this._fc = null;
    _this.childRef = _react.default.createRef();

    _this._initTools = function (fabricCanvas) {
      _this._tools = {};
      _this._tools[_tools.default.Select] = new _select.default(fabricCanvas);
      _this._tools[_tools.default.Pencil] = new _pencil.default(fabricCanvas);
      _this._tools[_tools.default.Line] = new _line.default(fabricCanvas);
      _this._tools[_tools.default.Arrow] = new _arrow.default(fabricCanvas);
      _this._tools[_tools.default.Rectangle] = new _rectangle.default(fabricCanvas);
      _this._tools[_tools.default.RectangleLabel] = new _rectangleLabel.default(fabricCanvas);
      _this._tools[_tools.default.Circle] = new _circle.default(fabricCanvas);
      _this._tools[_tools.default.Pan] = new _pan.default(fabricCanvas);
      _this._tools[_tools.default.DefaultTool] = new _defaulTool.default(fabricCanvas);
    };

    _this.enableTouchScroll = function () {
      var canvas = _this._fc;
      if (canvas.allowTouchScrolling) return;
      canvas.allowTouchScrolling = true;
    };

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
          //width:window.canvas.getWidth(),
          //height:window.canvas.getHeight(),
          selectable: false,
          hasControls: false,
          hasBorders: false,
          hasRotatingPoint: false
        }); // let opts = {
        // left: Math.random() * (canvas.getWidth() - oImg.width * 0.5),
        // top: Math.random() * (canvas.getHeight() - oImg.height * 0.5),
        // scale: 0.5
        // };
        // Object.assign(opts, options);

        oImg.scale(scaleFactor); // oImg.set({
        // 'left': opts.left,
        // 'top': opts.top
        // });

        canvas.add(oImg);

        _this.setState({
          scaleFactor: scaleFactor
        });

        canvas.renderAll();
      }); // if (this.state.rotation > 0) {
      // setTimeout(() => {
      // this.rotateAndScale(this._fc.item(0), -this.state.rotation, this._fc, this.state.scaleFactor);
      // canvas.renderAll();
      // }, 100);
      // }
    };

    _this._onObjectAdded = function (e) {
      var onObjectAdded = _this.props.onObjectAdded;

      if (!_this.state.action) {
        _this.setState({
          action: true
        });

        return;
      }

      var obj = e.target;
      obj.__version = 1; // record current object state as json and save as originalState

      var objState = obj.toJSON();
      obj.__originalState = objState;
      var state = JSON.stringify(objState); // object, previous state, current state
      // this._history.keep([obj, state, state])

      onObjectAdded(e);
    };

    _this._onObjectMoving = function (e) {
      var onObjectMoving = _this.props.onObjectMoving;
      onObjectMoving(e);
    };

    _this._onObjectScaling = function (e) {
      var onObjectScaling = _this.props.onObjectScaling;
      onObjectScaling(e);
    };

    _this._onObjectRotating = function (e) {
      var onObjectRotating = _this.props.onObjectRotating;
      onObjectRotating(e);
    };

    _this._onObjectModified = function (e) {
      var onObjectModified = _this.props.onObjectModified;
      var obj = e.target;
      obj.__version += 1;
      var prevState = JSON.stringify(obj.__originalState);
      var objState = obj.toJSON(); // record current object state as json and update to originalState

      obj.__originalState = objState;
      var currState = JSON.stringify(objState); // this._history.keep([obj, prevState, currState]);

      onObjectModified(e);
    };

    _this._onObjectRemoved = function (e) {
      var onObjectRemoved = _this.props.onObjectRemoved;
      var obj = e.target;

      if (obj.__removed) {
        obj.__version += 1;
        return;
      }

      obj.__version = 0;
      onObjectRemoved(e);
    };

    _this._onMouseDown = function (e) {
      var onMouseDown = _this.props.onMouseDown;

      _this._selectedTool.doMouseDown(e);

      onMouseDown(e);
    };

    _this._onMouseMove = function (e) {
      var onMouseMove = _this.props.onMouseMove;

      _this._selectedTool.doMouseMove(e);

      onMouseMove(e);
    };

    _this._onMouseOut = function (e) {
      var onMouseOut = _this.props.onMouseOut;

      _this._selectedTool.doMouseOut(e);

      if (_this.props.onChange) {
        var onChange = _this.props.onChange;
        setTimeout(function () {
          onChange(e.e);
        }, 10);
      }

      onMouseOut(e);
    };

    _this._onMouseUp = function (e) {
      var onMouseUp = _this.props.onMouseUp;

      _this._selectedTool.doMouseUp(e); // Update the final state to new-generated object
      // Ignore Path object since it would be created after mouseUp
      // Assumed the last object in canvas.getObjects() in the newest object


      if (_this.props.tool !== _tools.default.Pencil) {
        var canvas = _this._fc;
        var objects = canvas.getObjects();
        var newObj = objects[objects.length - 1];

        if (newObj && newObj.__version === 1) {
          newObj.__originalState = newObj.toJSON();
        }
      }

      if (_this.props.onChange) {
        var onChange = _this.props.onChange;
        setTimeout(function () {
          onChange(e.e);
        }, 10);
      }

      onMouseUp(e);
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
      console.log('[MIRA] Color Overlay Width:', overlayWidth, overlayHeight, overlayContrain);

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
            // objects[i].width = objects[i].width * scaleMultiplier;
            // objects[i].height = objects[i].height * scaleHeightMultiplier;
            objects[i].scaleX = objects[i].scaleX * scaleMultiplier;
            objects[i].scaleY = objects[i].scaleY * scaleMultiplier;
            objects[i].setCoords();
            var scaleFactor = _this.state.scaleFactor * scaleMultiplier;

            _this.setState({
              scaleFactor: scaleFactor
            });
          } // objects[i].scaleX = objects[i].scaleX * scaleMultiplier;
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

        console.log("[MIRA] Resize Canvas Dimensions: ", canvas.getWidth() * scaleMultiplier, canvas.getHeight() * scaleHeightMultiplier);
        canvas.discardActiveObject();
        canvas.setWidth(canvas.getWidth() * scaleMultiplier);
        canvas.setHeight(canvas.getHeight() * scaleHeightMultiplier);
        canvas.renderAll();
        canvas.calcOffset(); // this.setState({
        // parentWidth: offsetWidth
        // });

        var boss = canvas.getObjects().filter(function (o) {
          return o.type == "image";
        })[0];

        if (boss) {
          _this.bindLandmarks();
        }

        _this.setState({
          canvasHeight: canvas.height
        });
      }
    };

    _this.bindLandmarks = function () {
      var updateLandmarks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var canvasData = arguments.length > 1 ? arguments[1] : undefined;
      var canvas = canvasData ? canvasData : _this._fc;
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

      if (updateLandmarks) {
        var landMarks = canvas ? JSON.parse(JSON.stringify(canvas.getObjects().filter(function (o) {
          return o.type !== "image";
        }))) : [];

        _this.updateOnepTwop('_landmarks');

        console.log("[MIRA] Updated list of landmarks objects: ", JSON.stringify(landMarks));
      }
    };

    _this._backgroundColor = function (color) {
      if (!color) return;
      var canvas = _this._fc;
      canvas.setBackgroundColor(color, function () {
        return canvas.renderAll();
      });
    };

    _this.zoom = function (factor) {
      var canvas = _this._fc;
      var objects = canvas.getObjects();

      for (var i in objects) {
        objects[i].scaleX = objects[i].scaleX * factor;
        objects[i].scaleY = objects[i].scaleY * factor;
        objects[i].left = objects[i].left * factor;
        objects[i].top = objects[i].top * factor;
        objects[i].setCoords();
      }

      canvas.renderAll();
      canvas.calcOffset();
    };

    _this.undo = function () {
      var history = _this._history;

      var _history$getCurrent = history.getCurrent(),
          _history$getCurrent2 = (0, _slicedToArray2.default)(_history$getCurrent, 3),
          obj = _history$getCurrent2[0],
          prevState = _history$getCurrent2[1],
          currState = _history$getCurrent2[2];

      history.undo();

      if (obj.__removed) {
        _this.setState({
          action: false
        }, function () {
          _this._fc.add(obj);

          obj.__version -= 1;
          obj.__removed = false;
        });
      } else if (obj.__version <= 1) {
        _this._fc.remove(obj);
      } else {
        obj.__version -= 1;
        obj.setOptions(JSON.parse(prevState));
        obj.setCoords();

        _this._fc.renderAll();
      }

      if (_this.props.onChange) {
        _this.props.onChange();
      }
    };

    _this.redo = function () {
      var history = _this._history;

      if (history.canRedo()) {
        var canvas = _this._fc; //noinspection Eslint

        var _history$redo = history.redo(),
            _history$redo2 = (0, _slicedToArray2.default)(_history$redo, 3),
            obj = _history$redo2[0],
            prevState = _history$redo2[1],
            currState = _history$redo2[2];

        if (obj.__version === 0) {
          _this.setState({
            action: false
          }, function () {
            canvas.add(obj);
            obj.__version = 1;
          });
        } else {
          obj.__version += 1;
          obj.setOptions(JSON.parse(currState));
        }

        obj.setCoords();
        canvas.renderAll();

        if (_this.props.onChange) {
          _this.props.onChange();
        }
      }
    };

    _this.canUndo = function () {
      return _this._history.canUndo();
    };

    _this.canRedo = function () {
      return _this._history.canRedo();
    };

    _this.toDataURL = function (options) {
      return _this._fc.toDataURL(options);
    };

    _this.toJSON = function (propertiesToInclude) {
      return _this._fc.toJSON(propertiesToInclude);
    };

    _this.fromJSON = function (json) {
      if (!json) return;
      var canvas = _this._fc;
      setTimeout(function () {
        canvas.loadFromJSON(json, function () {
          if (_this.props.tool === _tools.default.DefaultTool) {
            canvas.isDrawingMode = canvas.selection = false;
            canvas.forEachObject(function (o) {
              return o.selectable = o.evented = false;
            });
          }

          canvas.renderAll();

          if (_this.props.onChange) {
            _this.props.onChange();
          }
        });
      }, 100);
    };

    _this.clear = function (propertiesToInclude) {
      var discarded = _this.toJSON(propertiesToInclude);

      _this._fc.clear();

      _this._history.clear();

      return discarded;
    };

    _this.removeSelected = function () {
      var canvas = _this._fc;
      var activeObj = canvas.getActiveObject();

      if (activeObj) {
        var selected = [];

        if (activeObj.type === 'activeSelection') {
          activeObj.forEachObject(function (obj) {
            return selected.push(obj);
          });
        } else {
          selected.push(activeObj);
        }

        selected.forEach(function (obj) {
          obj.__removed = true;
          var objState = obj.toJSON();
          obj.__originalState = objState;
          var state = JSON.stringify(objState);

          _this._history.keep([obj, state, state]);

          canvas.remove(obj);
        });
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }
    };

    _this.copy = function () {
      var canvas = _this._fc;
      canvas.getActiveObject().clone(function (cloned) {
        return _this._clipboard = cloned;
      });
    };

    _this.paste = function () {
      // clone again, so you can do multiple copies.
      _this._clipboard.clone(function (clonedObj) {
        var canvas = _this._fc;
        canvas.discardActiveObject();
        clonedObj.set({
          left: clonedObj.left + 10,
          top: clonedObj.top + 10,
          evented: true
        });

        if (clonedObj.type === 'activeSelection') {
          // active selection needs a reference to the canvas.
          clonedObj.canvas = canvas;
          clonedObj.forEachObject(function (obj) {
            return canvas.add(obj);
          });
          clonedObj.setCoords();
        } else {
          canvas.add(clonedObj);
        }

        _this._clipboard.top += 10;
        _this._clipboard.left += 10;
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
      });
    };

    _this.setBackgroundFromDataUrl = function (dataUrl) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var canvas = _this._fc;

      if (options.stretched) {
        delete options.stretched;
        Object.assign(options, {
          width: canvas.width,
          height: canvas.height
        });
      }

      if (options.stretchedX) {
        delete options.stretchedX;
        Object.assign(options, {
          width: canvas.width
        });
      }

      if (options.stretchedY) {
        delete options.stretchedY;
        Object.assign(options, {
          height: canvas.height
        });
      }

      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = function () {
        return canvas.setBackgroundImage(new fabric.Image(img), function () {
          return canvas.renderAll();
        }, options);
      };

      img.src = dataUrl;
    };

    _this.addText = function (text) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var canvas = _this._fc;
      var iText = new fabric.IText(text, options);
      var opts = {
        left: (canvas.getWidth() - iText.width) * 0.5,
        top: (canvas.getHeight() - iText.height) * 0.5
      };
      Object.assign(options, opts);
      iText.set({
        left: options.left,
        top: options.top
      });
      canvas.add(iText);
    };

    _this.callEvent = function (e, eventFunction) {
      // console.log("inside callEvet method");
      if (_this._selectedTool) eventFunction(e);
    };

    _this.addLandmarks = function (canvas, frontEnd) {
      var self = (0, _assertThisInitialized2.default)(_this);
      canvas.selection = false;
      var imageObject = JSON.parse(JSON.stringify(canvas.getObjects()));
      var landMarks = frontEnd;

      if (landMarks.length > 0) {
        landMarks.splice(0, 0, imageObject[0]);
      } else {
        landMarks = imageObject;
      }

      canvas.loadFromJSON("{\"objects\":".concat(JSON.stringify(landMarks), "}"), function () {
        if (self.props.oneptwop) {
          self.props.updateSbpfTransformValues(self.props.oneptwop, self.props.loadFromSession);
        } else {
          self.rotateAndScale(canvas.item(0), -0);
        } //if (canvas.item(1) && canvas.item(1).cnWidth !== canvas.getWidth()) {


        var scaleMultiplier = canvas.getWidth() / canvas.item(1).cnWidth;
        var objects = canvas.getObjects();

        for (var i in objects) {
          if (objects[i].type !== "image") {
            objects[i].left = objects[i].left * scaleMultiplier;
            objects[i].top = objects[i].top * scaleMultiplier;
            objects[i].cnWidth = canvas.getWidth();
            objects[i].cnHeight = canvas.getHeight();
            objects[i].setCoords();
          }
        } // }


        if (canvas) {
          var fabricList = JSON.parse(JSON.stringify(canvas.getObjects().filter(function (o) {
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
          canvas.forEachObject(function (o) {
            o.selectable = false;
          });
        }

        var boss = canvas.getObjects().filter(function (o) {
          return o.type == "image";
        })[0]; //if (boss) {

        self.bindLandmarks(true, canvas); //}
        //canvas.requestRenderAll();

        canvas.renderAll();
      });
      canvas.on('object:modified', function (options) {
        try {
          var obj = options.target;

          if (obj.type == "image") {
            return;
          }

          var canvasTL = new fabric.Point(0, 0);
          var canvasBR = new fabric.Point(canvas.getWidth(), canvas.getHeight()); //if object not totally contained in canvas, adjust position

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
            obj.setPositionByOrigin(new fabric.Point(left, top), "left", "top");
            obj.setCoords();
            canvas.renderAll();
          }

          self.bindLandmarks(true);
        } catch (err) {
          alert("exception in keepObjectInBounds\n\n" + err.message + "\n\n" + err.stack);
        }
      });
    };

    _this.componentDidMount = function () {
      var _this$props = _this.props,
          tool = _this$props.tool,
          value = _this$props.value,
          undoSteps = _this$props.undoSteps,
          defaultValue = _this$props.defaultValue,
          backgroundColor = _this$props.backgroundColor,
          image = _this$props.image; //console.log("value is coming in component did mount before starttttt-- > ", this._fc);
      //let canvas = this._fc = new fabric.Canvas("roi-canvas", { centeredRotation: true, centeredScaling: true });

      var canvas = _this._fc = new fabric.Canvas(_this._canvas, {
        centeredRotation: true,
        centeredScaling: true //id: "roi-canvas"

      }
      /*, {
      preserveObjectStacking: false,
      renderOnAddRemove: false,
      skipTargetFind: true
      }*/
      );

      _this._initTools(canvas); // set initial backgroundColor


      _this._backgroundColor(backgroundColor);

      var selectedTool = _this._tools[tool];
      if (selectedTool) selectedTool.configureCanvas(_this.props);
      _this._selectedTool = selectedTool; // Control resize

      window.addEventListener('resize', _this._resize, false); // Initialize History, with maximum number of undo steps
      // this._history = new History(undoSteps);
      // Events binding

      canvas.on('object:added', function (e) {
        return _this.callEvent(e, _this._onObjectAdded);
      });
      canvas.on('object:modified', function (e) {
        return _this.callEvent(e, _this._onObjectModified);
      });
      canvas.on('object:removed', function (e) {
        return _this.callEvent(e, _this._onObjectRemoved);
      });
      canvas.on('mouse:down', function (e) {
        return _this.callEvent(e, _this._onMouseDown);
      });
      canvas.on('mouse:move', function (e) {
        return _this.callEvent(e, _this._onMouseMove);
      });
      canvas.on('mouse:up', function (e) {
        return _this.callEvent(e, _this._onMouseUp);
      });
      canvas.on('mouse:out', function (e) {
        return _this.callEvent(e, _this._onMouseOut);
      });
      canvas.on('object:moving', function (e) {
        return _this.callEvent(e, _this._onObjectMoving);
      });
      canvas.on('object:scaling', function (e) {
        return _this.callEvent(e, _this._onObjectScaling);
      });
      canvas.on('object:rotating', function (e) {
        return _this.callEvent(e, _this._onObjectRotating);
      }); // IText Events fired on Adding Text
      // canvas.on("text:event:changed", console.log)
      // canvas.on("text:selection:changed", console.log)
      // canvas.on("text:editing:entered", console.log)
      // canvas.on("text:editing:exited", console.log)

      _this.disableTouchScroll(); // setTimeout(() => {


      _this._resize() // }, 3000);
      // if (image !== null) {
      // this.addImg(image);
      // }
      // initialize canvas with controlled value if exists
      ;

      (value || defaultValue) && _this.fromJSON(value || defaultValue);
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

      if (_this.props.tool !== prevProps.tool) {
        _this._selectedTool = _this._tools[_this.props.tool]; //Bring the cursor back to default if it is changed by a tool

        _this._fc.defaultCursor = 'default';

        if (_this._selectedTool) {// this._selectedTool.configureCanvas(this.props);
        }
      }

      if (_this.props.backgroundColor !== prevProps.backgroundColor) {
        _this._backgroundColor(_this.props.backgroundColor);
      }

      if (_this.props.image !== _this.state.imageUrl) {
        _this.addImg(_this.props.image);

        _this.setState({
          imageUrl: _this.props.image,
          scaleFactor: _this.state.scaleFactor,
          rotation: _this.props.oneptwop.inscopix.adapter_lsm.rotation,
          flipApplied: _this.props.oneptwop.inscopix.adapter_lsm.flip_horizontal
        });
      }

      if (_this.props.value !== prevProps.value || _this.props.value && _this.props.forceValue) {
        _this.fromJSON(_this.props.value);
      } // if (this.props.callResize !== this.state.callResize) {
      // this._resize();
      // this.setState({ callResize: this.props.callResize });
      // }


      if (_this.props.oneptwop) {
        if (_this.props.oneptwop.inscopix.adapter_lsm.rotation !== _this.state.rotation && _this._fc.item(0)) {
          _this.rotateAndScale(_this._fc.item(0), -_this.props.oneptwop.inscopix.adapter_lsm.rotation);

          _this.updateLandmarksPosition();

          _this._fc.renderAll();

          _this.setState({
            rotation: _this.props.oneptwop.inscopix.adapter_lsm.rotation
          });
        }

        if (_this.props.oneptwop.inscopix.frontend !== _this.state.frontEnd && _this.state.updateLandmarksForOtherWindow && _this._fc) {
          _this.setState({
            frontEnd: _this.props.oneptwop.inscopix.frontend,
            updateLandmarksForOtherWindow: false
          });

          _this.props.addLandmarks(_this._fc, _this.props.oneptwop.inscopix.frontend);

          _this._fc.renderAll();
        }

        if (_this.props.oneptwop.inscopix.adapter_lsm.flip_horizontal !== _this.state.flipApplied) {
          _this.applyFlip(_this.props.oneptwop.inscopix.adapter_lsm.flip_horizontal, false);

          _this.setState({
            flipApplied: _this.props.oneptwop.inscopix.adapter_lsm.flip_horizontal
          });
        }
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
      if (_this._fc.item(0)) {
        _this._fc.item(0).set({
          flipX: value
        });

        _this._fc.item(0).setCoords();
      }

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
        var scaleMatrix = [actScale, 0, 0, actScale, 0, 0]; // console.log(scaleMatrix, "scaleMatrix");
        // console.log(rotateMatrix, "rotateMatrix");
        //var scaleMatrix = [scale, 0 , 0, scale, 0, 0];

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
      var updateLandmarksForOtherWindow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      // if (this.sbpfApplyClick) {
      // this.oneptwop.inscopix.bpf = {
      // sigma1: $("#deltaSBFSnapSigmaOne").val() * 1,
      // sigma2: $("#deltaSBFSnapSigmaTwo").val() * 1,
      // offset: $("#deltaSBFSnapOffset").val() * 1,
      // gain: $("#deltaSBFSnapGain").val() * 1
      // }
      // }
      // this.oneptwop.inscopix.adapter_lsm = {
      // rotation: parseInt($(".transforms-rotate-data").val()),
      // flip_horizontal: $("#flip-horizontal").hasClass("active")
      // };
      var landMarks = _this._fc ? JSON.parse(JSON.stringify(_this._fc.toJSON(['cnWidth', 'cnHeight']))) : [];
      var oneptwop = _this.props.oneptwop;
      oneptwop.inscopix.frontend = landMarks.objects.filter(function (o) {
        return o.type !== "image";
      });

      _this.props.oneptwopFrontend(oneptwop);
      /*if (updateLandmarksForOtherWindow) {
      this.props.addLandmarks()
      }*/


      _this.setState({
        updateLandmarksForOtherWindow: updateLandmarksForOtherWindow
      });
    };

    _this.removeAddOrMoveMode = function () {
      var canvas = _this._fc;

      if (canvas.upperCanvasEl) {
        canvas.discardActiveObject();
        canvas.forEachObject(function (o) {
          o.selectable = false;
        });
        canvas.off('mouse:up');
        canvas.hoverCursor = canvas.defaultCursor = 'default';
        canvas.renderAll();
      }
    };

    _this.render = function () {
      var _this$props2 = _this.props,
          className = _this$props2.className,
          style = _this$props2.style,
          width = _this$props2.width,
          height = _this$props2.height;
      var canvasDivStyle = Object.assign({}, style ? style : {}, width ? {
        width: '100%'
      } : {
        width: '100%'
      }, height ? {
        height: _this.state.canvasHeight
      } : {
        height: _this.state.canvasHeight
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
        id: (0, _utils.uuid4)() // style={{
        // margin: "0 auto",
        // position: "absolute",
        // opacity: 1,
        // width: "100%",
        // height: "100%",
        // maxHeight: 800,
        // maxWidth: 1280,
        // backgroundRepeat: "no-repeat",
        // backgroundPosition: "center",
        // backgroundSize: "contain",
        // zIndex: 1
        // }}
        ,
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

  (0, _createClass2.default)(SketchField, [{
    key: "__reactstandin__regenerateByEval",
    value: // @ts-ignore
    function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);
  return SketchField;
}(_react.PureComponent);

SketchField.propTypes = {
  // the color of the line
  lineColor: _propTypes.default.string,
  // The width of the line
  lineWidth: _propTypes.default.number,
  // the fill color of the shape when applicable
  fillColor: _propTypes.default.string,
  // the background color of the sketch
  backgroundColor: _propTypes.default.string,
  // the opacity of the object
  opacity: _propTypes.default.number,
  // number of undo/redo steps to maintain
  undoSteps: _propTypes.default.number,
  // The tool to use, can be pencil, rectangle, circle, brush;
  tool: _propTypes.default.string,
  // image format when calling toDataURL
  imageFormat: _propTypes.default.string,
  // Sketch data for controlling sketch from
  // outside the component
  value: _propTypes.default.object,
  // Set to true if you wish to force load the given value, even if it is the same
  forceValue: _propTypes.default.bool,
  // Specify some width correction which will be applied on auto resize
  widthCorrection: _propTypes.default.number,
  // Specify some height correction which will be applied on auto resize
  heightCorrection: _propTypes.default.number,
  // Specify action on change
  onChange: _propTypes.default.func,
  // Default initial value
  defaultValue: _propTypes.default.object,
  // Sketch width
  width: _propTypes.default.number,
  // Sketch height
  height: _propTypes.default.number,
  // event object added
  onObjectAdded: _propTypes.default.func,
  // event object modified
  onObjectModified: _propTypes.default.func,
  // event object removed
  onObjectRemoved: _propTypes.default.func,
  // event mouse down
  onMouseDown: _propTypes.default.func,
  // event mouse move
  onMouseMove: _propTypes.default.func,
  // event mouse up
  onMouseUp: _propTypes.default.func,
  // event mouse out
  onMouseOut: _propTypes.default.func,
  // event object move
  onObjectMoving: _propTypes.default.func,
  // event object scale
  onObjectScaling: _propTypes.default.func,
  // event object rotating
  onObjectRotating: _propTypes.default.func,
  // Class name to pass to container div of canvas
  className: _propTypes.default.string,
  // Style options to pass to container div of canvas
  style: _propTypes.default.object,
  //add image
  image: _propTypes.default.string,
  //resize
  callResize: _propTypes.default.bool
};
SketchField.defaultProps = {
  lineColor: 'black',
  lineWidth: 10,
  fillColor: 'transparent',
  backgroundColor: 'transparent',
  opacity: 1.0,
  undoSteps: 25,
  tool: null,
  widthCorrection: 0,
  heightCorrection: 0,
  forceValue: false,
  image: null,
  callResize: false,
  onObjectAdded: function onObjectAdded() {
    return null;
  },
  onObjectModified: function onObjectModified() {
    return null;
  },
  onObjectRemoved: function onObjectRemoved() {
    return null;
  },
  onMouseDown: function onMouseDown() {
    return null;
  },
  onMouseMove: function onMouseMove() {
    return null;
  },
  onMouseUp: function onMouseUp() {
    return null;
  },
  onMouseOut: function onMouseOut() {
    return null;
  },
  onObjectMoving: function onObjectMoving() {
    return null;
  },
  onObjectScaling: function onObjectScaling() {
    return null;
  },
  onObjectRotating: function onObjectRotating() {
    return null;
  }
};
var _default = SketchField;
var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(fabric, "fabric", "/home/vishal/code/react-sketch/src/SketchField.jsx");
  reactHotLoader.register(SketchField, "SketchField", "/home/vishal/code/react-sketch/src/SketchField.jsx");
  reactHotLoader.register(_default, "default", "/home/vishal/code/react-sketch/src/SketchField.jsx");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();