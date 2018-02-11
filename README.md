```jsx
<Transition
  id={key}
  enter={async () => ...}
  leave={async () => {
    // do whatever!
    // the previous render sticks around until this function exits
    // and by magic, redux state is frozen inside it!!!
    // local state and everything else works as expected

    // you can now manually animate that old element out,
    // do a shared element transition, whatever.
    // use jquery for all I care
  }}
>
  <SomeContent/>
</Stack>
```

optional

* wrap (vr/native/etc)

examples -

* ~ counter
* ~ slideshow
* using with refs
* using with call-return
* reversible?

todo -

* cancellables
* freeze react-router
* freeze anything on context
