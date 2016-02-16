# snabbdom-assert

A library to assert different aspects of a snabbdom vNodes.

## install
`npm install --save-dev snabbdom-assert`

## Basic usage
```js
import * as assert from 'snabbdom-assert'
import h from 'snabbdom/h'

assert.identical(h('div', []), h('div', []))
  .then(({actual, expected}) => {...})
  .catch(err => {...})

assert.containsVNode(h('div', [h('h1', 'Hello')]), h('h1', 'Hello'))
  .then(({actual, expected}) => {...})
  .catch(err => {...})

assert.containsSelector(
  '.awesomeClass',
  h('div', [
    h('h1.awesomeClass', 'Hello'),
    h('h2.awesomeClass', 'World')
  ])
).then(matches => {
  // returns array of matches vNodes
  matches.length === 2 // true
}).catch(err => {...})
```

Using promises makes for easy testing with mocha and any other
test runner that supports promises.
```js
describe('createVTree()', () => {
  it('should create identical vTrees given same input', () => {
    return assert.identical(createVTree(1), createVTree(1))
  })
})
```

Supports nested streams/observables. (Most, Rx4, and Rx5)
Useful with [cycle-snabbdom](https://github.com/tylors/cycle-snabbdom)
and [motorcycle-dom](https://github.com/motorcyclejs/dom).
```js
import * as most from 'most'
import * as assert from 'snabbdom-assert'

describe('something', () => {
  it('should be identical', () => {
    const actual = h('div', {}, [
      most.just(h('h1', {}, ['Hello']))
    ])

    const expected = h('div', {}, [
      h('h1', {}, ['Hello'])
    ])

    return assert.identical(actual, expected)
  })
})

```

## API Documentation

The API documentation can be found
 [here](https://tylors.github.io/snabbdom-assert/docs).
