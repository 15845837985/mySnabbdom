import patchVnode from "./patchVnode";
import createElement from "./createElement";

// 判断是否是同一节点
function checkSameVnode(a, b) {
    return a.sel == b.sel && a.key == b.key
}

export default function updatedChildren(parentElm, oldCh, newCh) {
    console.log('欢迎来到updateChildren');
    console.log(oldCh, newCh);
    // 定义新前新后旧前旧后
    let oldStartIdx = 0;
    //旧前
    let newStartIdx = 0;
    //新前
    let oldEndIdx = oldCh.length - 1;
    //旧后
    let newEndIdx = newCh.length - 1;
    //新后
    let oldStartVnode = oldCh[0];
    //旧前节点
    let oldEndVnode = oldCh[oldEndIdx];
    //旧后节点
    let newStartVnode = newCh[0];
    //新前节点
    let newEndVnode = newCh[newEndIdx];
    //新后节点
    console.log(oldStartVnode, '旧前节点');
    console.log(oldEndVnode, '旧后节点');
    console.log(newStartVnode, '新前节点');
    console.log(newEndVnode, '新后节点');
    // 循环条件
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (checkSameVnode(newStartVnode, oldStartVnode)) {
            // 新前旧前命中
            patchVnode(newStartVnode, oldStartVnode);
            newStartVnode = newCh[++newStartIdx];
            oldStartVnode = oldCh[++oldStartIdx];
        } else if (checkSameVnode(newEndVnode, oldEndVnode)) {
            // 新后旧后命中
            patchVnode(newEndVnode, oldEndVnode);
            newEndVnode = newCh[--newEndIdx];
            oldEndVnode = oldCh[--oldEndIdx];
        } else if (checkSameVnode(newEndVnode, oldStartVnode)) {
            // 新后旧前命中
            patchVnode(newEndVnode, oldStartVnode);
            // 当新后与旧前命中时，需要移动节点。将新前指向的这个节点移动到老节点的旧后的后面
            parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)
            newEndVnode = newCh[--newEndIdx];
            oldStartVnode = oldCh[++oldStartIdx];
        } else if (checkSameVnode(newStartVnode, oldEndVnode)) {
            // 新前旧后命中
            patchVnode(newStartVnode, oldEndVnode);
            // 当新前旧后命中时，需要移动节点。将新前指向的这个节点移动到老节点的旧前的前面
            parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
            newStartVnode = newCh[++newEndIdx];
            oldEndVnode = oldCh[--oldStartIdx];
        } else {

        }
    }

    // 继续查看节点是否有剩余 循环结束了start还是比end小
    if (newStartIdx <= newEndIdx) {
        //new还有剩余节点没处理
        const before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
        for (let i = newStartIdx; i <= newEndIdx; i++) {
            parentElm.insertBefore(createElement(newCh[i]), before);
        }
    } else if (oldStartIdx <= oldEndIdx) {
        //old还有剩余节点没处理
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
            parentElm.removeChild(oldCh[i].elm)
        }
    }


}