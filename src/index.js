// @flow
import React, { Component, Fragment, type Node } from 'react';
import { type Store } from 'redux';
import { Provider } from 'react-redux';

class Freeze extends Component<{ cold: boolean, children: Node }> {
  context: {
    store: ?Store,
  };
  static contextTypes = {
    store: x => null,
  };

  store = {
    getState: () => {
      if (this.props.cold) {
        return this.frozen;
      }
      return this.context.store && this.context.store.getState();
    },
    dispatch: action => {
      if (this.context.store && !this.props.cold) {
        this.context.store.dispatch(action);
      }
    },
    subscribe: listener => {
      return (
        this.context.store &&
        this.context.store.subscribe(() => {
          if (!this.props.cold) {
            listener();
          }
        })
      );
    },
    replaceReducer: next => {
      return this.context.store && this.context.store.replaceReducer(next);
    },
  };

  frozen = this.context.store && this.context.store.getState();

  componentDidUpdate() {
    if (this.context.store && !this.props.cold) {
      this.frozen = this.context.store.getState();
    }
  }

  render() {
    return <Provider store={this.store}>{this.props.children}</Provider>;
  }
}

type Ref = any => void;
type Cancelled = () => boolean;

type Spec = {
  id: string,
  children: Node,
  enter?: Cancelled => ?Promise<void>,
  leave?: Cancelled => ?Promise<void>,
};

type SpecUnit = Spec & { enterRef?: Ref, leaveRef?: Ref };

type PageProps = Spec & { wrap?: typeof Component };

export default class Page extends Component<PageProps> {
  entering: { [id: string]: ?Object } = {};
  leaving: { [id: string]: ?Object } = {};
  createLeaveRef = (id: string) => {
    return (ele: any) => {
      const found = ele && this.stack.find(x => x.id === id);
      if (found && ele) {
        (async () => {
          if (this.entering[id]) {
            this.entering[id] = null;
          }
          const token = (this.leaving[id] = {});
          await (found.leave && found.leave(() => this.leaving[id] !== token));
          if (this.leaving[id] === token) {
            this.stack = this.stack.filter(x => x !== found);
            this.leaving[id] = null;
            this.forceUpdate();
            delete this.leaving[id];
          }
        })();
      }
    };
  };
  createEnterRef = (id: string) => {
    return (ele: any) => {
      const found = ele && this.stack.find(x => x.id === id);
      if (found && ele) {
        (async () => {
          if (this.leaving[id]) {
            this.leaving[id] = null;
          }
          const token = (this.entering[id] = {});
          await (found.enter && found.enter(() => this.entering[id] !== token));
          if (this.entering[id] === token) {
            this.entering[id] = null;
            delete this.entering[id];
          }
        })();
      }
    };
  };
  stack: Array<SpecUnit> = [
    {
      id: this.props.id,
      children: this.props.children,
      leave: this.props.leave,
      enter: this.props.enter,
      leaveRef: this.createLeaveRef(this.props.id),
      enterRef: this.createEnterRef(this.props.id),
    },
  ];

  componentWillReceiveProps(newProps: PageProps) {
    let found;
    if (newProps.id === this.stack[0].id) {
      Object.assign(this.stack[0], newProps);
    } else if ((found = this.stack.find(x => x.id === newProps.id))) {
      this.stack = [found, ...this.stack.filter(x => x !== found)];
      Object.assign(this.stack[0], {
        leaveRef: this.createLeaveRef(newProps.id),
        enterRef: this.createEnterRef(newProps.id),
      });
    } else {
      this.stack.unshift({
        leaveRef: this.createLeaveRef(newProps.id),
        enterRef: this.createEnterRef(newProps.id),
        ...newProps,
      });
    }
  }
  render() {
    const Wrap = this.props.wrap || Fragment;

    return (
      <Wrap>
        {this.stack.map(({ id, children, enterRef, leaveRef }, i) => (
          <Freeze key={id} cold={i !== 0} ref={i !== 0 ? leaveRef : enterRef}>
            {children}
          </Freeze>
        ))}
      </Wrap>
    );
  }
}
