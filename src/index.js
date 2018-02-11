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

type Spec = {
  id: string,
  children: Node,
  enter?: void => ?Promise<void>,
  leave?: void => ?Promise<void>,
};

type SpecUnit = Spec & { enterRef?: Ref, leaveRef?: Ref };

type PageProps = Spec & { wrap?: typeof Component };

export class Page extends Component<PageProps> {
  createLeaveRef = (id: string) => {
    return (ele: any) => {
      const found = ele && this.stack.find(x => x.id === id);
      if (found && ele) {
        (async x => {
          // todo - cancel any onenters on this
          await (found.leave && found.leave());
          this.stack = this.stack.filter(x => x !== found);
          this.forceUpdate();
        })();
      }
    };
  };
  createEnterRef = (id: string) => {
    return (ele: any) => {
      const found = ele && this.stack.find(x => x.id === id);
      if (found && ele) {
        (async x => {
          // todo - cancel any onleaves on this
          await (found.enter && found.enter());
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
        leaveRef: this.createLeaveRef(this.stack[0].id),
        enterRef: this.createEnterRef(this.stack[0].id),
      });
      // todo
      // - cancel existing onleave/onenter
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
