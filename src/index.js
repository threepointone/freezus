// @flow
import React, { Component, type Node } from 'react';
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
      return this.context.store.subscribe(() => {
        if (!this.props.cold) {
          listener();
        }
      });
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

const FrameState = React.createContext(null);

class Frame extends React.Component<
  {
    children: Node,
    onEnter: ?() => AsyncGenerator<*, *, *>,
    onExit: ?() => AsyncGenerator<*, *, *>,
    exiting: boolean,
    reduce: (any, any) => any,
    onExited: () => void,
  },
  { store: any },
> {
  state = { store: null };
  reduce(action) {
    this.setState(x => ({ store: this.props.reduce(x.store, action) }));
  }
  iterator: ?AsyncGenerator<*, *, *>;
  async onEnter() {
    if (this.props.onEnter) {
      const iterator = (this.iterator = this.props.onEnter());
      for await (const action of iterator) {
        if (this.iterator !== iterator) {
          // todo - iterator.cancel()
          break;
        }
        this.reduce(action);
      }
    }
  }
  async onExit() {
    if (this.props.onExit) {
      const iterator = (this.iterator = this.props.onExit());
      for await (const action of iterator) {
        if (this.iterator !== iterator) {
          break;
          // todo - iterator.cancel()
        }
        this.reduce(action);
      }
    }
    this.props.onExited();
  }

  async componentDidMount() {
    this.onEnter();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.exiting && this.props.exiting) {
      this.onExit();
    } else if (prevProps.exiting && !this.props.exiting) {
      this.onEnter();
    }
  }
  render() {
    return (
      <FrameState.Provider value={this.state.store}>
        {this.props.children}
      </FrameState.Provider>
    );
  }
}

// ok, so. the basic idea here is to abtract out the logic that's
// recreated by hand every time - maintain state for multiple components 'in flight'
// during a transition, and render them. we recommend you use some
// form of a 'stretchy' around your content, usally with style
// `{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }`
// or a flex version
// `{ flex: 1, alignSelf: stretch }`
// and position them during the transitions
// <Transition will also clean up once a transition is 'done',
// detected by when the `onExit` callback resolves.
// if an `onEnter` occurs before an `onExit` finishes (ie - you render a component
// again befire it's finished unmounting), then the same instance is reused,
// letting you move it back in smoothly
type ID = string | number;
export type TransitionProps = {
  id: ID,
  children?: Node,
  onEnter?: () => AsyncGenerator<*, *, *>,
  onExit?: () => AsyncGenerator<*, *, *>,
  reduce?: (any, any) => any,
};

type TransitionState = {
  stack: Array<TransitionProps>,
};

export default class Transition extends Component<
  TransitionProps,
  TransitionState,
> {
  state = {
    stack: [this.props],
  };

  static Consumer = FrameState.Consumer;

  static getDerivedStateFromProps(
    nextProps: TransitionProps,
    prevState: TransitionState,
  ): TransitionState {
    return {
      stack: [nextProps, ...prevState.stack.filter(x => x.id !== nextProps.id)],
    };
  }

  render(): Node {
    return this.state.stack.map(
      ({ id, children, onEnter, onExit, reduce }, i) => (
        <Freeze key={id} cold={i !== 0}>
          <Frame
            reduce={reduce || ((x, y) => y)}
            exiting={i !== 0}
            onEnter={onEnter}
            onExit={onExit}
            onExited={() => {
              this.setState(x => ({ stack: x.stack.filter(l => l.id !== id) }));
            }}
          >
            {children}
          </Frame>
        </Freeze>
      ),
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
