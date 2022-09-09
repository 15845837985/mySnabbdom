import vnode from "./vnode";

//手写一个只能处理三个参数的h函数
//第一个参数为选择器，第二个参数为对象，第三个参数有三种情况
// 1.h('div', {}, '文字')
// 2.h('div', {}, [])
// 3.h('div', {}, h())
export default function h(sel, data, c) {
    // 检查参数个数
    if (arguments.length != 3)
        throw new Error('此h函数只接受3个参数');
    // 检查参数c的类型
    if (typeof c == 'string' || typeof c == 'number') {
        return vnode(sel, data, undefined, c, undefined);
    } else if (Array.isArray(c)) {
        let children = [];
        for (let i = 0; i < c.length; i++) {
            if (!(typeof c[i] == 'object' && c[i].hasOwnProperty('sel')))
                throw new Error('传入的数组中有项不是h函数')
            children.push(c[i]);
        }
        return vnode(sel, data, children, undefined, undefined)
    } else if (typeof c == 'object' && c.hasOwnProperty('sel')) {
        let children = [c];
        return vnode(sel, data, children, undefined, undefined)
    } else {
        throw new Error('传入的第三个参数异常')
    }
}