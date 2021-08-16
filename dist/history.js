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

/**
 * Maintains the history of an object
 */
var History = /*#__PURE__*/function () {
  function History() {
    var undoLimit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
    var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    (0, _classCallCheck2.default)(this, History);
    this.undoLimit = undoLimit;
    this.undoList = [];
    this.redoList = [];
    this.current = null;
    this.debug = debug;
  }
  /**
   * Get the limit of undo/redo actions
   *
   * @returns {number|*} the undo limit, as it is configured when constructing the history instance
   */


  (0, _createClass2.default)(History, [{
    key: "getUndoLimit",
    value: function getUndoLimit() {
      return this.undoLimit;
    }
    /**
     * Get Current state
     *
     * @returns {null|*}
     */

  }, {
    key: "getCurrent",
    value: function getCurrent() {
      return this.current;
    }
    /**
     * Keep an object to history
     *
     * This method will set the object as current value and will push the previous "current" object to the undo history
     *
     * @param obj
     */

  }, {
    key: "keep",
    value: function keep(obj) {
      try {
        this.redoList = [];

        if (this.current) {
          this.undoList.push(this.current);
        }

        if (this.undoList.length > this.undoLimit) {
          this.undoList.shift();
        }

        this.current = obj;
      } finally {
        this.print();
      }
    }
    /**
     * Undo the last object, this operation will set the current object to one step back in time
     *
     * @returns the new current value after the undo operation, else null if no undo operation was possible
     */

  }, {
    key: "undo",
    value: function undo() {
      try {
        if (this.current) {
          this.redoList.push(this.current);

          if (this.redoList.length > this.undoLimit) {
            this.redoList.shift();
          }

          if (this.undoList.length === 0) this.current = null;
        }

        if (this.undoList.length > 0) {
          this.current = this.undoList.pop();
          return this.current;
        }

        return null;
      } finally {
        this.print();
      }
    }
    /**
     * Redo the last object, redo happens only if no keep operations have been performed
     *
     * @returns the new current value after the redo operation, or null if no redo operation was possible
     */

  }, {
    key: "redo",
    value: function redo() {
      try {
        if (this.redoList.length > 0) {
          if (this.current) this.undoList.push(this.current);
          this.current = this.redoList.pop();
          return this.current;
        }

        return null;
      } finally {
        this.print();
      }
    }
    /**
     * Checks whether we can perform a redo operation
     *
     * @returns {boolean}
     */

  }, {
    key: "canRedo",
    value: function canRedo() {
      return this.redoList.length > 0;
    }
    /**
     * Checks whether we can perform an undo operation
     *
     * @returns {boolean}
     */

  }, {
    key: "canUndo",
    value: function canUndo() {
      return this.undoList.length > 0 || this.current !== null;
    }
    /**
     * Clears the history maintained, can be undone
     */

  }, {
    key: "clear",
    value: function clear() {
      this.undoList = [];
      this.redoList = [];
      this.current = null;
      this.print();
    }
  }, {
    key: "print",
    value: function print() {
      if (this.debug) {
        /* eslint-disable no-console */
        console.log(this.undoList, ' -> ' + this.current + ' <- ', this.redoList.slice(0).reverse());
      }
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    value: // @ts-ignore
    function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);
  return History;
}();

var _default = History;
var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(History, "History", "/Users/vivekgakhar/inscopix/2.0.0-alpha2/react-sketch/src/history.js");
  reactHotLoader.register(_default, "default", "/Users/vivekgakhar/inscopix/2.0.0-alpha2/react-sketch/src/history.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();