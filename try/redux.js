// @flow
// @format
import 'regenerator-runtime/runtime';
import React, { Component, Fragment } from 'react';

import type { Node } from 'react';
import { render, findDOMNode } from 'react-dom';

import Page from '../src';

import { createStore, combineReducers } from 'redux';
import { connect, Provider } from 'react-redux';

type State = { count: number };

const initial = { count: 0 };

function reducer(state = initial, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
      return { ...state, count: state.count - 1 };
  }
  return state;
}

function same(x) {
  return x;
}

const store = createStore(reducer);

function increment() {
  return { type: 'increment' };
}
function decrement() {
  return { type: 'decrement' };
}

function select(state) {
  return { count: state.count };
}

const Counter = connect(select, { increment, decrement })(
  class extends Component<{
    count: number,
  }> {
    render() {
      return this.props.count;
    }
  },
);

function sleep(n) {
  return new Promise(resolve => {
    setTimeout(resolve, n);
  });
}

const App = connect(select, { increment, decrement })(props => (
  <Fragment>
    <button onClick={props.decrement}>back</button>
    <button onClick={props.increment}>next</button>
    <Page
      id={props.count}
      onExit={async function*() {
        await sleep(2000);
      }}
    >
      <Counter />
    </Page>
  </Fragment>
));

function Root() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

render(<Root />, window.root);
