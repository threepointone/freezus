// @flow
import 'babel-polyfill';
import React, { Component, Fragment, type Node } from 'react';
import { render, findDOMNode } from 'react-dom';

import { Pager } from '../src';

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
        <Pager
          id={this.state.slide + ''}
          leave={async ele => {
            await sleep(1000);
          }}
        >
          <Slide value={this.state.slide} ref={ele => this.refs[slide]= ele}/>
        </Pager>
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
