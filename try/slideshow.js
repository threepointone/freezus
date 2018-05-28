// @flow
import 'regenerator-runtime/runtime';
import React, { type Node } from 'react';
import { render } from 'react-dom';
import posed from 'react-pose';
import { spring } from 'popmotion';
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
  alignContent: 'center',
  justifyContent: 'center',
};

const swoosh = {
  transition: props =>
    spring({
      ...props,
      stiffness: 10,
      damping: 10,
    }),
};

const config = {
  enterLeft: { left: -100, opacity: 0 },
  enterRight: { left: 100, opacity: 0 },
  enter: { left: 0, opacity: 1, ...swoosh },
  exitLeft: { left: -100, opacity: 0, ...swoosh },
  exitRight: { left: 100, opacity: 0, ...swoosh },
};

const Box = posed.div(config);

function Slide(props: { children: Node, initial: 'enterLeft' | 'enterRight' }) {
  const style = { ...boxStyle, ...config[props.initial] };
  return (
    <Transition.Consumer>
      {pose => (
        <Box pose={pose} style={style}>
          {props.children}
        </Box>
      )}
    </Transition.Consumer>
  );
}

function sleep(n: number) {
  return new Promise(resolve => setTimeout(resolve, n));
}

class Slideshow extends React.Component<
  {},
  { slide: number, direction: 'forward' | 'backward' },
> {
  state = { slide: 0, direction: 'forward' };

  next = () =>
    this.setState({ slide: this.state.slide + 1, direction: 'forward' });

  prev = () =>
    this.setState({ slide: this.state.slide - 1, direction: 'backward' });

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
          <Slide
            initial={
              this.state.direction === 'forward' ? 'enterRight' : 'enterLeft'
            }
          >
            {this.state.slide}
          </Slide>
        </Transition>
      </div>
    );
  }
}
render(<Slideshow />, window.root);
