// @flow
import 'regenerator-runtime/runtime';
import React, { type Node } from 'react';
import { render } from 'react-dom';
import posed from 'react-pose';
import Transition from '../src';

const boxStyle = {
  width: 200,
  height: 200,
  position: 'absolute',
  backgroundColor: `#ccc`,
  top: 40,
  fontSize: 40,
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const swoosh = { type: 'spring', stiffness: 10, damping: 10 };

const initial = {
  backward: { left: -100, opacity: 0 },
  forward: { left: 100, opacity: 0 },
};

const config = {
  enter: { left: 0, opacity: 1, transition: swoosh },
  exitLeft: { left: -100, opacity: 0, transition: swoosh },
  exitRight: { left: 100, opacity: 0, transition: swoosh },
};

const Box = posed.div(config);

type Direction = 'forward' | 'backward';

class Slide extends React.Component<{
  children: Node,
  direction: Direction,
}> {
  style = {
    ...boxStyle,
    ...initial[this.props.direction],
  };
  render() {
    // $FlowFixMe
    const pose = adopt(<Transition.Consumer />);
    return (
      <Box pose={pose} style={this.style}>
        {this.props.children}
      </Box>
    );
  }
}

function sleep(n: number) {
  return new Promise(resolve => setTimeout(resolve, n));
}

export class Slideshow extends React.Component<
  { fn: number => Node },
  { slide: number, direction: Direction },
> {
  state = { slide: 0, direction: 'forward' };

  next = () =>
    this.setState(x => ({ slide: x.slide + 1, direction: 'forward' }));

  prev = () =>
    this.setState(x => ({ slide: x.slide - 1, direction: 'backward' }));

  render() {
    return (
      <div style={{ marginLeft: 200, position: 'relative' }}>
        <button onClick={this.prev}>back</button>
        <button onClick={this.next}>next</button>
        <Transition
          id={this.state.slide}
          onEnter={async function*() {
            yield 'enter';
          }}
          onExit={async function*() {
            yield this.state.direction === 'forward' ? 'exitLeft' : 'exitRight';
            await sleep(2000);
          }.bind(this)}
        >
          <Slide direction={this.state.direction}>
            {this.props.fn(this.state.slide)}
          </Slide>
        </Transition>
      </div>
    );
  }
}
render(<Slideshow fn={x => x} />, window.root);
