## freezus

[work in progress]

[ost](https://soundcloud.com/sahandii/cold-as-ice-remake)

`yarn add freezus`

```jsx
import Transition from 'freezus'

// ...

<Transition
  id={key} // change this for every transition
  onEnter={async id => ...}
  onExit={async id => {
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

## cancellation

onEnter and onExit receive a function that tests whether a transition
has been cancelled. you can use this to synchronize stuff.

```jsx
onExit={async cancelled => {
  await sleep(1000)
  if(!cancelled()){
    // do the thing
  }
  ...
}}
```
todo -

* examples
* tests
* freeze react-router
* freeze anything on context
* `<ReactTransition` that matches the [popular one](https://reactcommunity.org/react-transition-group/), good for migrating
