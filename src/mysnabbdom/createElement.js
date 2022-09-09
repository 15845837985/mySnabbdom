// 创建节点,将vnode创建为DOM
export default function createElement(vnode) {
    // 创建一个DOM节点，孤儿节点
    let domNode = document.createElement(vnode.sel);
    // 判断存在子节点还是文本
    if (vnode.text != '' && vnode.children == undefined || vnode.children.length == 0) {
        // 内部是文字
        domNode.innerText = vnode.text
    } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
        // 内部是子节点,递归创捷子节点
        for (let i = 0; i < vnode.children.length; i++) {
            // 得到children
            let ch = vnode.children[i]
            // 创建children的DOM，调用createElement意味创建出了DOM并且其elm属性指向了创建出来的DOM，但此时并未上树，是一个孤儿节点
            let childDOM = createElement(ch)
            // 上树
            domNode.appendChild(childDOM)
        }
    }
    // 补充elm属性
    vnode.elm = domNode

    // 返回elm 一个纯dom节点
    return vnode.elm
}