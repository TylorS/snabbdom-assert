/* eslint max-nested-callbacks: 0 */
/* global describe, it */
import h from 'snabbdom/h'
import Rx from 'rx'
import * as Rx5 from 'rxjs'
import most from 'most'
import * as assert from '../../src'

describe(`Snabbdom Assert`, () => {
  describe(`identical`, () => {
    it(`should match vTrees that are exactly the same`, () => {
      const vTree = h(`div`, {props: {id: `test`}}, [
        h(`h1`, [`Hello world!`]),
      ])

      return assert.identical(vTree, vTree)
    })

    it(`should reject when vTrees as not exactly the same`, done => {
      const actual = h(`div`, {props: {id: `test`}}, [
        h(`h1`, [`Hello world!`]),
      ])

      const expected = h(`div`, {}, [
        h(`h1`, [`Hello world!`]),
      ])

      return assert.identical(actual, expected)
        .then(done.fail)
        .catch(() => done())
    })

    it(`should match vTrees that contain Rx 4 Observables`, () => {
      const actual = h(`div`, {}, [
        Rx.Observable.just(h(`h1`, `Hello, world!`)),
      ])

      const expected = h(`div`, {}, [
        h(`h1`, `Hello, world!`),
      ])

      return assert.identical(actual, expected)
    })

    it(`should match vTrees that contain Rx 5 Observables`, () => {
      const actual = h(`div`, {}, [
        Rx5.Observable.of(h(`h1`, `Hello, world!`)),
      ])

      const expected = h(`div`, {}, [
        h(`h1`, `Hello, world!`),
      ])

      return assert.identical(actual, expected)
    })

    it(`should match vTree that contain Most Streams`, () => {
      const actual = h(`div`, {}, [
        most.just(h(`h1`, `Hello, world!`)),
      ])

      const expected = h(`div`, {}, [
        h(`h1`, `Hello, world!`),
      ])

      return assert.identical(actual, expected)
    })
  })

  describe(`containsVNode`, () => {
    it(`should match parts of a vTree`, () => {
      const vTree = h(`div`, {}, [
        h(`div`, {}, [
          h(`h1.greeting`, [`Hello World`]),
        ]),
      ])

      return assert.containsVNode(vTree, h(`h1.greeting`, [`Hello World`]))
    })

    it(`should throw if not contained by vTree`, done => {
      const vTree = h(`div`, {}, [
        h(`div`, {}, [
          h(`h2.greeting`, [`Hello World`]),
        ]),
      ])

      assert.containsVNode(vTree, h(`h1.greeting`, [`Hello World`]))
        .then(done.fail)
        .catch(() => done())
    })

    it(`should match vTrees that contain Rx 4 Observables`, () => {
      const actual = h(`div`, {}, [
        Rx.Observable.just(h(`h1`, `Hello, world!`)),
      ])

      const expected = h(`div`, {}, [
        h(`h1`, `Hello, world!`),
      ])

      return assert.containsVNode(actual, expected)
    })

    it(`should match vTrees that contain Rx 5 Observables`, () => {
      const actual = h(`div`, {}, [
        Rx5.Observable.of(h(`h1`, `Hello, world!`)),
      ])

      const expected = h(`div`, {}, [
        h(`h1`, `Hello, world!`),
      ])

      return assert.containsVNode(actual, expected)
    })

    it(`should match vTree that contain Most Streams`, () => {
      const actual = h(`div`, {}, [
        most.just(h(`h1`, `Hello, world!`)),
      ])

      const expected = h(`div`, {}, [
        h(`h1`, `Hello, world!`),
      ])

      return assert.containsVNode(actual, expected)
    })
  })

  describe(`containsSelector`, () => {
    it(`should match a selector in a given vTree`, () => {
      const vTree = h(`div`, {}, [
        h(`div`, {}, [
          h(`h1.greeting`, [`Hello World`]),
        ]),
      ])

      return assert.containsSelector(`h1.greeting`, vTree)
    })

    it(`should throw if a given selector is not in a vTree`, done => {
      const vTree = h(`div`, {}, [
        h(`div`, {}, [
          h(`h1.greeting`, [`Hello World`]),
        ]),
      ])

      assert.containsSelector(`h2.greeting`, vTree)
        .then(done.fail)
        .catch(() => done())
    })

    it(`should match vTrees that contain Rx 4 Observables`, () => {
      const actual = h(`div`, {}, [
        Rx.Observable.just(h(`h1`, `Hello, world!`)),
      ])

      return assert.containsSelector(`h1`, actual)
    })

    it(`should match vTrees that contain Rx 5 Observables`, () => {
      const actual = h(`div`, {}, [
        Rx5.Observable.of(h(`h1`, `Hello, world!`)),
      ])

      return assert.containsSelector(`h1`, actual)
    })

    it(`should match vTree that contain Most Streams`, () => {
      const actual = h(`div`, {}, [
        most.just(h(`h1`, `Hello, world!`)),
      ])

      return assert.containsSelector(`h1`, actual)
    })
  })
})
