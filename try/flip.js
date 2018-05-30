// @flow
import 'regenerator-runtime/runtime';
import Transition from '../src/index';
import React, { type Node } from 'react';

import {
  AppRegistry,
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native-web';
import { Slideshow } from './slideshow';

class Shared extends React.Component<{ children: Node }> {
  getDerivedStateFromProps(nextProps, prevState) {
    // if entering and previously available in stack
    // opacity: 0
    // onMount, measure dimensions, delta from previous one
    // add to stack
    // opacity one, [stack transforms]
    // set state, rerender
    // if exiting
    //
  }
  render() {
    // $FlowFixMe
    const pose = adopt(<Transition.Consumer />);
    return this.props.children;
  }
}

class Screen extends React.Component<{}> {
  positions = Array.from({ length: 4 }, () => Math.round(Math.random() * 20));
  render() {
    return (
      <div>
        {Array.from({ length: 20 }, (_, i) => (
          <Shared
            share={this.positions.indexOf(i) >= 0}
            key={i}
            shareKey={i}
            style={{ backgroundColor: 'red' }}
          >
            <div>{i}</div>
          </Shared>
        ))}
      </div>
    );
  }
}

function sleep(n: number) {
  return new Promise(resolve => setTimeout(resolve, n));
}

class Display extends React.Component<{}, { screen: number }> {
  state = { screen: 0 };
  render() {
    return <Slideshow fn={page => <Screen />} />;
  }
}

AppRegistry.registerComponent('App', () => Display);

AppRegistry.runApplication('App', {
  initialProps: {},
  rootTag: window.root,
});

// A <-> B <-> C
//
// <Share
//   if entering B
//     B` gets opacity 0
//     measure B`
//     get position of A'
//     make a div with the transform > content
//     set to position A'
//     put that inside another

/* <Shared.Provider>
  // ...
  <Share id='someKey' style={...}>
    some content
  </Share>
</Shared.Provider> */
