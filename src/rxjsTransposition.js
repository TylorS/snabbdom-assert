import * as Rx from 'rxjs'

function createVTree(vTree, children) {
  return {
    sel: vTree.sel,
    data: vTree.data,
    text: vTree.text,
    elm: vTree.elm,
    key: vTree.key,
    children,
  }
}

function transposeVTree(vTree) {
  if (!vTree) {
    return null
  } else if (vTree && typeof vTree.data === `object` && vTree.data.static) {
    return Rx.Observable.of(vTree)
  } else if (typeof vTree.subscribe === `function`) {
    return vTree.switchMap(transposeVTree)
  } else if (typeof vTree === `object`) {
    if (!vTree.children || vTree.children.length === 0) {
      return Rx.Observable.of(vTree)
    }

    const vTreeChildren = vTree.children
      .map(transposeVTree).filter(x => x !== null)

    return vTreeChildren.length === 0 ?
      Rx.Observable.of(createVTree(vTree, vTreeChildren)) :
      Rx.Observable.combineLatest(
        vTreeChildren,
        (...children) => createVTree(vTree, children)
      )
  } else {
    throw new Error(`Unhandled vTree Value`)
  }
}

export default transposeVTree
