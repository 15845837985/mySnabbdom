// 将传入参数组合成对象返回
export default function vnode(sel, data, children, text, elm) {
    const key = data.key
    return {
        sel, data, children, text, elm, key
    }
}