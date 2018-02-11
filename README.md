## freezus

[ost](https://soundcloud.com/sahandii/cold-as-ice-remake)

`yarn add freezus`

```jsx
import Transition from 'freezus'

// ...

<Transition
  id={key} // change this for every transition
  enter={async () => ...}
  leave={async () => {
    // do whatever!
    // the previous render sticks around until this function exits
    // and by magic, redux state is frozen inside it!
    // local state and everything else works as expected

    // you can now manually animate that old element out,
    // do a shared element transition, whatever.
    // use jquery for all I care
  }}
>
  <SomeContent/>
</Transition>
```

## cancellation

`enter` and `leave` receive a function that tests whether
a transition has been cancelled. you can use this to synchronize stuff.

```jsx
leave={async cancelled => {
  await sleep(1000)
  if(!cancelled()){
    // do the thing
  }
  ...
}}
```

todo -

* freeze react-router
* freeze anything on context
