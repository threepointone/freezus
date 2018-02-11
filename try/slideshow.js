// @flow
import 'babel-polyfill';
import React, { Component, Fragment, type Node } from 'react';
import { render, findDOMNode } from 'react-dom';

import Page from '../src';

class Slide extends Component<{value: number}> {
  render() {
    return <div>{this.props.value}</div>;
  }
}

function sleep(n) {
  return new Promise(resolve => {
    setTimeout(resolve, n);
  });
}

class Slideshow extends Component<{}, {slide: number}> {
  state = {
    slide: 0,
  };
  refs = {

  }
  render() {
    const { slide } = this.state;
    return (
      <div>
        <Page
          id={this.state.slide + ''}
          leave={async ele => {
            await sleep(1000);
          }}
        >
          <Slide value={this.state.slide} />
        </Page>
        <button onClick={() => this.setState({ slide: slide - 1 })}>
          back
        </button>
        <button onClick={() => this.setState({ slide: slide + 1 })}>
          next
        </button>
      </div>
    );
  }
}
render(<Slideshow />, window.root);
