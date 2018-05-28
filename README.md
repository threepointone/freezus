## freezus

[work in progress]

[ost](https://soundcloud.com/sahandii/cold-as-ice-remake)

`yarn add freezus`

```jsx
import Transition from 'freezus'

// ...

<Transition
  id={key} // change this for every transition
  onEnter={async function*() => ...}
  onExit={async function*() => {
    // do whatever!
    // the previous render sticks around until this function exits
    // and by magic, redux state is frozen inside it!
    // local state and everything else works as expected

    // you can now manually animate that old element out,
    // do a shared element transition, whatever.
    // use jquery for all I care
    // refs are doubly useful here :)
  }}>
  <SomeContent/>
</Transition>
```

## rationale

* traditionally, by rendering a new view in a position, we implicitly destroy the previous view (if it was different)
* alternately, we have to manually maintain ui state, mixing our animation concerns with business logic.
* `<Transition/>` abstracts that for you

## how does it work

* fragments to render multiple phases at once
* lifecycle - onEnter, onExit
* cancellable
* freeze redux state for the subtree

## cancellation

async generators handle cancellation pretty nicely

```jsx
onExit={async function*() => {
  try{
    await sleep(1000)
  }
  finally {
    const isCancelled = yield;
    // do the thing
  }
}}
```

## state

by combining `reduce` and the `yield`s from `onEnter`/`onExit`, you can
implement a redux-like pipeline to manage state. the default reducer is
`(x, y) => y` i.e. - it saves the last action as the state. You can read
from this state with `Transition.Consumer`

```jsx
[todo];
```

todo -

* examples
* tests
* freeze react-router
* freeze anything on context
* `<ReactTransition` that matches the [popular one](https://reactcommunity.org/react-transition-group/), good for migrating
