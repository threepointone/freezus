'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

// this component freezes redux state for its children when `cold` is true
// after every render, it saves a snapshot of the last used redux state
// it also replacies the redux store with a 'proxy' store, which, when cold
// - no-ops all action dispatches
// - returns state from the snapshot
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
          return _this.snapshot;
        }
        return _this.context.store.getState();
      },
      dispatch: function dispatch(action) {
        if (!_this.props.cold) {
          _this.context.store.dispatch(action);
        }
      },
      subscribe: function subscribe(listener) {
        return _this.context.store.subscribe(function () {
          if (!_this.props.cold) {
            listener();
          }
        });
      },
      replaceReducer: function replaceReducer(next) {
        // should this be a no-op too?
        return _this.context.store.replaceReducer(next);
      }
    }, _this.snapshot = _this.context.store && _this.context.store.getState(), _temp), _possibleConstructorReturn(_this, _ret);
  }
  // our proxy store


  _createClass(Freeze, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.context.store && !this.props.cold) {
        this.snapshot = this.context.store.getState();
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

var Transition = function (_Component2) {
  _inherits(Transition, _Component2);

  function Transition() {
    var _ref2,
        _this3 = this;

    var _temp2, _this2, _ret2;

    _classCallCheck(this, Transition);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_ref2 = Transition.__proto__ || Object.getPrototypeOf(Transition)).call.apply(_ref2, [this].concat(args))), _this2), _this2.entering = {}, _this2.exiting = {}, _this2.createExitRef = function (id) {
      return function (ele) {
        var found = ele && _this2.state.stack.find(function (x) {
          return x.id === id;
        });
        if (found) {
          _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var token;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (_this2.entering[id]) {
                      _this2.entering[id] = null;
                    }
                    token = _this2.exiting[id] = {};

                    if (!found.onExit) {
                      _context.next = 5;
                      break;
                    }

                    _context.next = 5;
                    return found.onExit(id, function () {
                      return _this2.exiting[id] !== token;
                    });

                  case 5:

                    if (_this2.exiting[id] === token) {
                      delete _this2.exiting[id];
                      _this2.setState({
                        stack: _this2.state.stack.filter(function (x) {
                          return x !== found;
                        })
                      });
                    }

                  case 6:
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
        var found = ele && _this2.state.stack.find(function (x) {
          return x.id === id;
        });
        if (found) {
          _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var token;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (_this2.exiting[id]) {
                      _this2.exiting[id] = null;
                    }
                    token = _this2.entering[id] = {};

                    if (!found.onEnter) {
                      _context2.next = 5;
                      break;
                    }

                    _context2.next = 5;
                    return found.onEnter(id, function () {
                      return _this2.entering[id] !== token;
                    });

                  case 5:

                    if (_this2.entering[id] === token) {
                      delete _this2.entering[id];
                    }

                  case 6:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, _this3);
          }))();
        }
      };
    }, _this2.state = {
      stack: [{
        id: _this2.props.id,
        children: _this2.props.children,
        onExit: _this2.props.onExit,
        onEnter: _this2.props.onEnter,
        exitRef: _this2.createExitRef(_this2.props.id),
        enterRef: _this2.createEnterRef(_this2.props.id)
      }]
    }, _temp2), _possibleConstructorReturn(_this2, _ret2);
  }

  _createClass(Transition, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      var found = void 0;
      // todo - shallow equal test to prevent a render

      if (newProps.id === this.state.stack[0].id) {
        this.setState({
          stack: [_extends({}, this.state.stack[0], newProps)].concat(_toConsumableArray(this.state.stack.slice(1)))
        });
      } else if (found = this.state.stack.find(function (x) {
        return x.id === newProps.id;
      })) {
        this.setState({
          stack: [_extends({}, found, {
            exitRef: this.createExitRef(newProps.id),
            enterRef: this.createEnterRef(newProps.id)
          })].concat(_toConsumableArray(this.state.stack.filter(function (x) {
            return x !== found;
          })))
        });
      } else {
        this.setState({
          stack: [_extends({
            exitRef: this.createExitRef(newProps.id),
            enterRef: this.createEnterRef(newProps.id)
          }, newProps)].concat(_toConsumableArray(this.state.stack))
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _react.Fragment,
        null,
        this.state.stack.map(function (_ref5, i) {
          var id = _ref5.id,
              children = _ref5.children,
              enterRef = _ref5.enterRef,
              exitRef = _ref5.exitRef;
          return _react2.default.createElement(
            Freeze,
            { key: id, cold: i !== 0, ref: i !== 0 ? exitRef : enterRef },
            children
          );
        })
      );
    }
  }]);

  return Transition;
}(_react.Component);

// class ReactTransitionChild extends React.Component<{}, {
//   transition: 'entering' | 'entered' | 'exiting' | 'exited'
// }>{
//   state = {
//     transition: ''
//   }
//   render(){
//     const {onEnter, onExit, }
//     return <Transition
//   }
// }
//
// class ReactTransition extends React.Component{
//
//   render(){
//     return <Transition></Transition>
//   }
// }

//
// ## TransitionGroup
//
// ```jsx
// <TransitionGroup
//   onEnter={async id => ...}
//   onExit={async id => ...}
//   onMove={async id => ...}
//   >
//   <Child key='a'/>
//   <Child key='b'/>
//   <Child key='c'/>
// </TransitionGroup>
//
// ```


exports.default = Transition;