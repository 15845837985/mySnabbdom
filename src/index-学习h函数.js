import {
    init,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    h,
} from "snabbdom";

// 创建patch函数
const patch = init([classModule, propsModule, styleModule, eventListenersModule])

// 创建虚拟节点
const myVnode1 = h('a', {
    props: {
        href: 'http://www.baidu.com',
        target: '_blank'
    }
}, '百度')
// console.log(myVnode1);

const myVnode2 = h('div', { class: { 'box': true } }, 'This is a box')
// const myVnode2 = h('div', 'This is a box') 没有属性时h函数第二个参数可以省略

const myVnode3 = h('ul', {}, [
    h('li', '苹果'),
    h('li', [
        h('p', '麒麟西瓜'),
        h('p', '吊雷西瓜'),
    ]),
    h('li', h('span', '香蕉')),
    h('li', h('p', '桃子')),

])

//让虚拟节点上树
const container = document.getElementById('container')
patch(container, myVnode3)