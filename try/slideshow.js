// @flow
import 'babel-polyfill';
import React, { Component, Fragment, type Node } from 'react';
import { render, findDOMNode } from 'react-dom';
import { Motion, spring, presets } from 'react-motion';

import Page from '../src';

class Slide extends Component<
  { value: number, direction: 'forward' | 'backward' },
  { left: number, opacity: number },
> {
  state = {
    left: 100 + (this.props.direction === 'forward' ? 100 : -100),
    opacity: 0,
  };
  enter() {
    this.setState({ left: 0, opacity: 1 });
    return sleep(2000);
  }
  leaveLeft() {
    this.setState({ left: -100, opacity: 0 });
    return sleep(2000);
  }
  leaveRight() {
    this.setState({ left: 100, opacity: 0 });
    return sleep(2000);
  }

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
            {this.props.value}
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

class Slideshow extends Component<
  {},
  { slide: number, direction: 'forward' | 'backward' },
> {
  state = {
    slide: 0,
    direction: 'forward',
  };
  _refs = {};
  eles = {};
  createRef = i => {
    if (!this._refs[i]) {
      this._refs[i] = el => (this.eles[i] = el);
    }
    return this._refs[i];
  };
  render() {
    const { slide } = this.state;
    return (
      <div>
        <button
          onClick={() =>
            this.setState({ slide: slide - 1, direction: 'backward' })
          }
        >
          back
        </button>
        <button
          onClick={() =>
            this.setState({ slide: slide + 1, direction: 'forward' })
          }
        >
          next
        </button>
        <Page
          id={this.state.slide + ''}
          enter={async () => {
            await this.eles[slide].enter();
          }}
          leave={async () => {
            await (this.state.direction === 'forward'
              ? this.eles[slide].leaveLeft()
              : this.eles[slide].leaveRight());
          }}
        >
          <Slide
            value={this.state.slide}
            ref={this.createRef(slide)}
            direction={this.state.direction}
          />
        </Page>
      </div>
    );
  }
}
render(<Slideshow />, window.root);
