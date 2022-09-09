import createElement from "./createElement.js";
import updatedChildren from "./updateChildren.js";


export default function patchVnode(oldVnode, newVnode) {
    // 判断新旧vnode是不是同一对象
    if (oldVnode === newVnode) return
    // 判断newVnode有没有text属性
    if (newVnode.text != undefined && newVnode.children == undefined || newVnode.children.length == 0) {
        console.log('newVnode有text属性');
        if (newVnode.text !== oldVnode.text) {
            // 新旧虚拟节点text不同，将新的写入老虚拟节点的eml中，即使老虚拟节点的eml中是children也会立即消失
            oldVnode.elm.innerText = newVnode.text
        }
    } else {
        console.log('newVnode没有text属性');
        if (oldVnode.children != undefined && oldVnode.children.length > 0) {
            updatedChildren(oldVnode.elm, oldVnode.children, newVnode.children)
        } else {
            // 老的没有children，新的有children
            // 清空oldVnode的text，循环newVnode的children，上树
            oldVnode.elm.innerText = ''
            for (let i = 0; i < newVnode.length; i++) {
                let dom = createElement(newVnode.children[i])
                oldVnode.elm.appendChild(dom)
            }
        }
    }
}




