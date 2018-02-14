// @flow
import "regenerator-runtime/runtime";
import React, { Component, Fragment, type Node } from 'react';
import { render, findDOMNode } from 'react-dom';
import { Motion, spring, presets } from 'react-motion';

import Transition from '../src';

class Slide extends Component<
  { children: Node, direction: 'forward' | 'backward' },
  { left: number, opacity: number },
> {
  state = {
    left: 100 + (this.props.direction === 'forward' ? 100 : -100),
    opacity: 0,
  };
  enter = () => {
    this.setState({ left: 0, opacity: 1 });
    return sleep(2000);
  };
  leaveLeft = () => {
    this.setState({ left: -100, opacity: 0 });
    return sleep(2000);
  };
  leaveRight = () => {
    this.setState({ left: 100, opacity: 0 });
    return sleep(2000);
  };

  render() {
    return (
      <Motion
        defaultStyle={this.state}
        style={{
          left: spring(100 + this.state.left, { damping: 40, stiffness: 120 }),
          opacity: spring(this.state.opacity, { damping: 40, stiffness: 120 }),
        }}
      >
        {vals => (
          <div
            style={{
              width: 200,
              height: 200,
              position: 'absolute',
              backgroundColor: `#ccc`,
              top: 40,
              fontSize: 40,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'center',
              ...vals,
            }}
          >
            {this.props.children}
          </div>
        )}
      </Motion>
    );
  }
}

function sleep(n) {
  return new Promise(resolve => {
    setTimeout(resolve, n);
  });
}

const refs: Map<any, any> = new Map();
const eles: Map<any, any> = new Map();

export function createRef(id: any) {
  if (!refs.get(id)) {
    refs.set(id, el => eles.set(id, el));
  }
  return refs.get(id);
}

export function getRef(id: any) {
  return eles.get(id);
}

class Slideshow extends Component<
  {},
  { slide: number, direction: 'forward' | 'backward' },
> {
  state = {
    slide: 0,
    direction: 'forward',
  };
  next = () => {
    this.setState({ slide: this.state.slide + 1, direction: 'forward' });
  };
  prev = () => {
    this.setState({ slide: this.state.slide - 1, direction: 'backward' });
  };
  render() {
    const { slide, direction } = this.state;
    return (
      <div>
        <button onClick={this.prev}>back</button>
        <button onClick={this.next}>next</button>
        <Transition
          id={slide}
          onEnter={() => getRef(slide).enter()}
          onExit={() =>
            this.state.direction === 'forward'
              ? getRef(slide).leaveLeft()
              : getRef(slide).leaveRight()
          }
        >
          <Slide ref={createRef(slide)} direction={direction}>
            {slide}
          </Slide>
        </Transition>
      </div>
    );
  }
}
render(<Slideshow />, window.root);
