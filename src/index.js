// @flow
import React, { Component, Fragment, type Node } from 'react';
import { type Store } from 'redux';
import { Provider } from 'react-redux';

// this component freezes redux state for its children when `cold` is true
// after every render, it saves a snapshot of the last used redux state
// it also replacies the redux store with a 'proxy' store, which, when cold
// - no-ops all action dispatches
// - returns state from the snapshot
class Freeze extends Component<{ cold: boolean, children: Node }> {
  context: {
    store: Store,
  };
  static contextTypes = {
    store: x => null,
  };
  // our proxy store
  store = {
    getState: () => {
      if (this.props.cold) {
        return this.snapshot;
      }
      return this.context.store.getState();
    },
    dispatch: action => {
      if (!this.props.cold) {
        this.context.store.dispatch(action);
      }
    },
    subscribe: listener => {
      return (
        this.context.store.subscribe(() => {
          if (!this.props.cold) {
            listener();
          }
        })
      );
    },
    replaceReducer: next => {
      // should this be a no-op too?
      return this.context.store.replaceReducer(next);
    },
  };

  snapshot = this.context.store && this.context.store.getState();

  componentDidUpdate() {
    if (this.context.store && !this.props.cold) {
      this.snapshot = this.context.store.getState();
    }
  }

  render() {
    return <Provider store={this.store}>{this.props.children}</Provider>;
  }
}

type Ref = any => void;
type CancelledFn = () => boolean;
type ID = string | number;

type TransitionProps = {
  id: ID,
  children: Node,
  onEnter?: CancelledFn => ?Promise<void>,
  onExit?: CancelledFn => ?Promise<void>,
};

type TransitionState = {
  stack: Array<TransitionProps & { enterRef?: Ref, exitRef?: Ref }>,
};

export default class Transition extends Component<
  TransitionProps,
  TransitionState,
> {
  entering: { [id: ID]: ?Object } = {};
  exiting: { [id: ID]: ?Object } = {};
  createExitRef = (id: ID) => {
    return (ele: any) => {
      const found = ele && this.state.stack.find(x => x.id === id);
      if (found) {
        (async () => {
          if (this.entering[id]) {
            this.entering[id] = null;
          }
          const token = (this.exiting[id] = {});
          if (found.onExit) {
            await found.onExit(() => this.exiting[id] !== token);
          }

          if (this.exiting[id] === token) {
            delete this.exiting[id];
            this.setState({
              stack: this.state.stack.filter(x => x !== found),
            });
          }
        })();
      }
    };
  };
  createEnterRef = (id: ID) => {
    return (ele: any) => {
      const found = ele && this.state.stack.find(x => x.id === id);
      if (found) {
        (async () => {
          if (this.exiting[id]) {
            this.exiting[id] = null;
          }
          const token = (this.entering[id] = {});
          if (found.onEnter) {
            await found.onEnter(() => this.entering[id] !== token);
          }

          if (this.entering[id] === token) {
            delete this.entering[id];
          }
        })();
      }
    };
  };
  state = {
    stack: [
      {
        id: this.props.id,
        children: this.props.children,
        onExit: this.props.onExit,
        onEnter: this.props.onEnter,
        exitRef: this.createExitRef(this.props.id),
        enterRef: this.createEnterRef(this.props.id),
      },
    ],
  };

  componentWillReceiveProps(newProps: TransitionProps) {
    let found;
    // todo - shallow equal test to prevent a render

    if (newProps.id === this.state.stack[0].id) {
      this.setState({
        stack: [
          { ...this.state.stack[0], ...newProps },
          ...this.state.stack.slice(1),
        ],
      });
    } else if ((found = this.state.stack.find(x => x.id === newProps.id))) {
      this.setState({
        stack: [
          {
            ...found,
            exitRef: this.createExitRef(newProps.id),
            enterRef: this.createEnterRef(newProps.id),
          },
          ...this.state.stack.filter(x => x !== found),
        ],
      });
    } else {
      this.setState({
        stack: [
          {
            exitRef: this.createExitRef(newProps.id),
            enterRef: this.createEnterRef(newProps.id),
            ...newProps,
          },
          ...this.state.stack,
        ],
      });
    }
  }
  render() {
    return (
      <Fragment>
        {this.state.stack.map(({ id, children, enterRef, exitRef }, i) => (
           <Freeze key={id} cold={i !== 0} ref={i !== 0 ? exitRef : enterRef}>
            {children}
          </Freeze>
        ))}
      </Fragment>
    );
  }
}

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
