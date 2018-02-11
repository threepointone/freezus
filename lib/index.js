'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Page = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('redux');

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Freeze = function (_Component) {
  _inherits(Freeze, _Component);

  function Freeze() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Freeze);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Freeze.__proto__ || Object.getPrototypeOf(Freeze)).call.apply(_ref, [this].concat(args))), _this), _this.store = {
      getState: function getState() {
        if (_this.props.cold) {
          return _this.frozen;
        }
        return _this.context.store && _this.context.store.getState();
      },
      dispatch: function dispatch(action) {
        if (_this.context.store && !_this.props.cold) {
          _this.context.store.dispatch(action);
        }
      },
      subscribe: function subscribe(listener) {
        return _this.context.store && _this.context.store.subscribe(function () {
          if (!_this.props.cold) {
            listener();
          }
        });
      },
      replaceReducer: function replaceReducer(next) {
        return _this.context.store && _this.context.store.replaceReducer(next);
      }
    }, _this.frozen = _this.context.store && _this.context.store.getState(), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Freeze, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.context.store && !this.props.cold) {
        this.frozen = this.context.store.getState();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _reactRedux.Provider,
        { store: this.store },
        this.props.children
      );
    }
  }]);

  return Freeze;
}(_react.Component);

Freeze.contextTypes = {
  store: function store(x) {
    return null;
  }
};

var Page = exports.Page = function (_Component2) {
  _inherits(Page, _Component2);

  function Page() {
    var _ref2,
        _this3 = this;

    var _temp2, _this2, _ret2;

    _classCallCheck(this, Page);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_ref2 = Page.__proto__ || Object.getPrototypeOf(Page)).call.apply(_ref2, [this].concat(args))), _this2), _this2.entering = {}, _this2.leaving = {}, _this2.createLeaveRef = function (id) {
      return function (ele) {
        var found = ele && _this2.stack.find(function (x) {
          return x.id === id;
        });
        if (found && ele) {
          _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var token;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (_this2.entering[id]) {
                      _this2.entering[id] = null;
                    }
                    token = _this2.leaving[id] = {};
                    _context.next = 4;
                    return found.leave && found.leave(function () {
                      return _this2.leaving[id] !== token;
                    });

                  case 4:
                    if (_this2.leaving[id] === token) {
                      _this2.stack = _this2.stack.filter(function (x) {
                        return x !== found;
                      });
                      _this2.leaving[id] = null;
                      _this2.forceUpdate();
                      delete _this2.leaving[id];
                    }

                  case 5:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this3);
          }))();
        }
      };
    }, _this2.createEnterRef = function (id) {
      return function (ele) {
        var found = ele && _this2.stack.find(function (x) {
          return x.id === id;
        });
        if (found && ele) {
          _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var token;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (_this2.leaving[id]) {
                      _this2.leaving[id] = null;
                    }
                    token = _this2.entering[id] = {};
                    _context2.next = 4;
                    return found.enter && found.enter(function () {
                      return _this2.entering[id] !== token;
                    });

                  case 4:
                    if (_this2.entering[id] === token) {
                      _this2.entering[id] = null;
                      delete _this2.entering[id];
                    }

                  case 5:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, _this3);
          }))();
        }
      };
    }, _this2.stack = [{
      id: _this2.props.id,
      children: _this2.props.children,
      leave: _this2.props.leave,
      enter: _this2.props.enter,
      leaveRef: _this2.createLeaveRef(_this2.props.id),
      enterRef: _this2.createEnterRef(_this2.props.id)
    }], _temp2), _possibleConstructorReturn(_this2, _ret2);
  }

  _createClass(Page, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      var found = void 0;
      if (newProps.id === this.stack[0].id) {
        Object.assign(this.stack[0], newProps);
      } else if (found = this.stack.find(function (x) {
        return x.id === newProps.id;
      })) {
        this.stack = [found].concat(_toConsumableArray(this.stack.filter(function (x) {
          return x !== found;
        })));
        Object.assign(this.stack[0], {
          leaveRef: this.createLeaveRef(newProps.id),
          enterRef: this.createEnterRef(newProps.id)
        });
      } else {
        this.stack.unshift(_extends({
          leaveRef: this.createLeaveRef(newProps.id),
          enterRef: this.createEnterRef(newProps.id)
        }, newProps));
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var Wrap = this.props.wrap || _react.Fragment;

      return _react2.default.createElement(
        Wrap,
        null,
        this.stack.map(function (_ref5, i) {
          var id = _ref5.id,
              children = _ref5.children,
              enterRef = _ref5.enterRef,
              leaveRef = _ref5.leaveRef;
          return _react2.default.createElement(
            Freeze,
            { key: id, cold: i !== 0, ref: i !== 0 ? leaveRef : enterRef },
            children
          );
        })
      );
    }
  }]);

  return Page;
}(_react.Component);