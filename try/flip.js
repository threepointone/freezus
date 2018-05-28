// @flow

import Page from '../src/index';
import React, { Component, Fragment, type Node } from 'react';
import { render, findDOMNode } from 'react-dom';
import posed from 'react-pose';

class Shared extends React.Component<{ children: Node }> {
  render() {
    return this.props.children;
  }
}

function shared(Component) {
  const X = posed(Component);
  return config => X(config);
}

const config = {};

const Box = shared('div')(config);

class Screen extends React.Component<{}> {
  positions = Array.from({ length: 4 }, () => Math.round(Math.random() * 20));
  render() {
    return <div>{Array.from({ length: 20 }, (_, i) => <Box>{i}</Box>)}</div>;
  }
}
//
