/* global Promise */
import toHtml from 'snabbdom-to-html'
import select from 'snabbdom-selector'
import transposeRxVTree from './rxTransposition'
import transposeRxJSVTree from './rxjsTransposition'
import transposeMostVTree from './mostTransposition'

function standardizeString(str) {
  return str.replace(/\s/g, ``).replace(`'`, `"`)
}

function traverse(vNode, fn) {
  fn(vNode)
  if (vNode.children) {
    vNode.children.forEach(child => {
      traverse(child, fn)
    })
  }
}

function assertSame(actual, expected) {
  const actualString = standardizeString(toHtml(actual))
  const expectedString = standardizeString(toHtml(expected))
  return actualString === expectedString
}

function assertContainsVNode(actual, expected) {
  const actualString = standardizeString(toHtml(actual))
  const expectedString = standardizeString(toHtml(expected))
  return actualString.indexOf(expectedString) !== -1 ||
    assertSame(actual, expected) // eslint-disable-line
}

function assertContainsSelector(selector, vTree) {
  const matches = select(selector, vTree)
  return [matches, matches.length > 0]
}

function containsMost(actual) {
  let containsStream = false
  traverse(actual, node => {
    if (typeof node.observe === `function`) {
      containsStream = true
    }
  })
  return containsStream
}

function containsRx(actual) {
  let containsStream = false
  traverse(actual, node => {
    if (typeof node.subscribe === `function`) {
      if (typeof node.switchMap === `function`) {
        containsStream = 5
      } else {
        containsStream = 4
      }
    }
  })
  return containsStream
}

/**
 * Assert whether or not to vTrees are identical
 * @public
 * @method identical
 * @name identical
 * @param {vNode} actual - the actual vNode you'd like to test
 * (can hold streams/observables)
 * @param {vNode} expected - the expected vNode structure
 * @return {Promise} promise resolves with an object containing the `actual` and
 * `expected` values if there is a match, or rejects if the vNodes do not match
 */
export function identical(actual, expected) {
  return new Promise((resolve, reject) => {
    const rxVersion = containsRx(actual)
    if (rxVersion) {
      const transposedTree = rxVersion === 5 ?
        transposeRxJSVTree(actual) :
        transposeRxVTree(actual)

      transposedTree
        .last()
        .subscribe(vTree => {
          if (assertSame(vTree, expected)) {
            resolve({actual: vTree, expected})
          } else {
            reject(new Error(`vTree's do not match
              expected ${toHtml(vTree)} to equal
              ${toHtml(expected)}
            `))
          }
        })
    } else if (containsMost(actual)) {
      transposeMostVTree(actual)
        .reduce((_, x) => x)
        .then(vTree => {
          if (assertSame(vTree, expected)) {
            resolve({actual: vTree, expected})
          } else {
            reject(new Error(`vTree's do not match
              expected ${toHtml(vTree)} to equal
              ${toHtml(expected)}
            `))
          }
        })
    } else {
      assertSame(actual, expected) === true ? // eslint-disable-line
        resolve({actual, expected}) :
        reject(new Error(`vTree's do not match
          expected ${toHtml(actual)} to equal
          ${toHtml(expected)}
        `))
    }
  })
}

/**
 * Assert whether or not a vTree contains a specific vNode
 * @public
 * @method containsVNode
 * @name containsVNode
 * @param {vNode} actual - the actual vNode you'd like to test
 * (can hold streams/observables)
 * @param {vNode} expected - the expected vNode structure
 * @return {Promise} promise resolves with an object containing the `actual` and
 * `expected` values if the expected value is contained in the actual value,
 * or rejects if there is no match
 */
export function containsVNode(actual, expected) {
  return new Promise((resolve, reject) => {
    const rxVersion = containsRx(actual)
    if (rxVersion) {
      const transposedTree = rxVersion === 5 ?
        transposeRxJSVTree(actual) :
        transposeRxVTree(actual)
      transposedTree
        .last()
        .subscribe(vTree => {
          if (assertContainsVNode(vTree, expected)) {
            resolve({actual: vTree, expected})
          } else {
            reject(new Error(`vTree does not contain expected vNode
              expected ${toHtml(vTree)} to contain
              ${toHtml(expected)}
            `))
          }
        })
    } else if (containsMost(actual)) {
      transposeMostVTree(actual)
        .reduce((_, x) => x)
        .then(vTree => {
          if (assertContainsVNode(vTree, expected)) {
            resolve({actual: vTree, expected})
          } else {
            reject(new Error(`vTree does not contain expected vNode
              expected ${toHtml(vTree)} to contain
              ${toHtml(expected)}
            `))
          }
        })
    } else {
      assertContainsVNode(actual, expected) === true ? // eslint-disable-line
        resolve({actual, expected}) :
        reject(new Error(`vTree does not contain expected vNode
          expected ${toHtml(actual)} to contain
          ${toHtml(expected)}
        `))
    }
  })
}

/**
 * Assert whether a particular selector is contained in a vTree
 * @public
 * @method containsSelector
 * @name containsSelector
 * @param {string} selector - the css selector to try and find
 * @param {vNode} vTree - the vNode to test (can contain streams/observables)
 * @return {Promise} promise resolves with an array of all of the matched
 * vNodes, or rejects if the selector can not be found.
 */
export function containsSelector(selector, vTree) {
  return new Promise((resolve, reject) => {
    const rxVersion = containsRx(vTree)
    if (rxVersion) {
      const transposedTree = rxVersion === 5 ?
        transposeRxJSVTree(vTree) :
        transposeRxVTree(vTree)
      transposedTree
        .last()
        .subscribe(_vTree => {
          const [matches, _containsSelector] =
            assertContainsSelector(selector, _vTree)

          _containsSelector ? // eslint-disable-line
            resolve(matches) :
            reject(new Error(`vTree does not contain expected selector
              expected ${toHtml(_vTree)} to contain ${selector}
            `))
        })
    } else if (containsMost(vTree)) {
      transposeMostVTree(vTree)
        .reduce((_, x) => x)
        .then(_vTree => {
          const [matches, _containsSelector] =
            assertContainsSelector(selector, _vTree)

          _containsSelector ? // eslint-disable-line
            resolve(matches) :
            reject(new Error(`vTree does not contain expected selector
              expected ${toHtml(_vTree)} to contain ${selector}
            `))
        })
    } else {
      const [matches, _containsSelector] =
        assertContainsSelector(selector, vTree)

      _containsSelector ? // eslint-disable-line
        resolve(matches) :
        reject(new Error(`vTree does not contain expected selector
          expected ${toHtml(vTree)} to contain ${selector}
        `))
    }
  })
}
