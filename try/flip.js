// @flow
import 'regenerator-runtime/runtime';
import Transition from '../src/index';
import React, { type Node } from 'react';
//$FlowFixMe
import { AppRegistry, Animated, StyleSheet, Text, View } from 'react-native';

class Shared extends React.Component<{
  children: Node,
  shareKey: string | number,
  share: boolean,
  style: any,
}> {
  render() {
    const { share, shareKey, style, children, ...props } = this.props;
    return (
      <Animated.View
        {...props}
        style={[style, share && { backgroundColor: 'blue' }]}
      >
        {children}
      </Animated.View>
    );
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
    return (
      <div
        style={{
          width: 200,
          alignSelf: 'center',
          marginTop: 80,
          position: 'relative',
        }}
      >
        screen: {this.state.screen} <br />
        <button
          onClick={() => this.setState({ screen: this.state.screen - 1 })}
        >
          back
        </button>
        <button
          onClick={() => this.setState({ screen: this.state.screen + 1 })}
        >
          next
        </button>
        <Transition id={this.state.screen}>
          <Screen />
        </Transition>
      </div>
    );
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
