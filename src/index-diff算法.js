import {
    init,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    h,
} from "snabbdom";

const container = document.getElementById('container')
const btn = document.getElementById('btn')

// 创建patch函数
const patch = init([classModule, propsModule, styleModule, eventListenersModule])


// const vnode1 = h('ul', {}, [
//     h('li', {}, 'A'),
//     h('li', {}, 'B'),
//     h('li', {}, 'C'),
//     h('li', {}, 'D'),
// ]);

const vnode1 = h('ul', {}, [
    h('li', { key: 'A' }, 'A'),
    h('li', { key: 'B' }, 'B'),
    h('li', { key: 'C' }, 'C'),
    h('li', { key: 'D' }, 'D'),
]);

patch(container, vnode1)

// const vnode2 = h('ul', {}, [
//     h('li', {}, 'E'),
//     h('li', {}, 'A'),
//     h('li', {}, 'B'),
//     h('li', {}, 'C'),
//     h('li', {}, 'D'),
// ]);

const vnode2 = h('ul', {}, [
    h('li', { key: 'E' }, 'E'),
    h('li', { key: 'A' }, 'A'),
    h('li', { key: 'B' }, 'B'),
    h('li', { key: 'C' }, 'C'),
    h('li', { key: 'D' }, 'D'),
]);

const vnode3 = h('ol', {}, [
    h('li', { key: 'A' }, 'A'),
    h('li', { key: 'B' }, 'B'),
    h('li', { key: 'C' }, 'C'),
    h('li', { key: 'D' }, 'D'),
]);


//点击按钮时，将vnode1变为vnode2
btn.onclick = function () {
    patch(vnode1, vnode2)
}

// 感受diff算法
// 将 ABCD 变为 ABCDE，diff算法不会改变ABCD而是在后面添加E节点
// 在不添加key属性时，将 ABCD 变为 EABCD 时，相当于在D后插入新节点并逐个改变节点值 
// 在添加key属性后，将 ABCD 变为 EABCD 时，直接在A节点前插入E节点
// key的作用是告诉diff算法在更改前后它们是同一个DOM节点
// 只有是同一个虚拟节点时，才会进行精细化比较，否则就是暴力删除旧的，插入新的
// 如何判断是否是同一个虚拟节点？选择器相同且key相同
// 只有进行同层级比较时会进行精细化比较，跨层级也不会精细化比较，依旧是暴力删除旧的，插入新的

// diff算法总结
// 1、key很重要  
// 2、只有是同一个虚拟节点才会精细化比较 
// 3、diff算法只进行同层比较不会进行跨层比较啊 

// patch方法执行逻辑
// 1、判断oldVnode是虚拟节点还是DOM节点
// 2、如果为DOM节点首先将oldVnode包装为虚拟节点
// 3、判断oldVnode和newVnode是否为同一节点
// 4、是同一节点进行精细化比较，不是同一节点则暴力删除旧的插入新的

// 同一节点（oldVnode和newVnode的sel和key都相同）下的比较逻辑
// 1、判断oldVnode和newVnode是否是内存中的同一个对象
// 2、是--->什么都不做  否--->判断newVnode有没有text属性*
// 3、有*--->判断newVnode和oldVnode的text是否相同
// 4、相同--->什么都不做 不相同--->把oldVnode的elm中的innerText改为newVnode的text
// 5、newVnode没有text属性*（即newVnode有children）则判断oldVnode有没有children
// 6、没有（意味oldVnode有text）---> 清空oldVnode的text，并且把newVnode的children添加到DOM中
// 7、最复杂的情况，需要进行最优雅的diff

// diff算法更新子节点策略
// 四种命中观察找
// 共有四个指针分别指向新/旧的子节点的首/尾
// 循环遍历时按照如下对比顺序进行比较
//  |  1.新前与旧前   
//  |  2.新后与旧后
//  |  3.新后与旧前 （命中时将新前指向的节点移动到旧后指向的节点的位置之后）
// \|/ 4.新前与旧后 （命中时将新前指向的节点移动到旧前指向的节点的位置之前）
// 命中一个条件则遍历进入下一项，都没有命中需要循环寻找

// 例1 旧子节点为 h('li', { key: 'A' }, 'A')    新子节点为 h('li', { key: 'A' }, 'A')
//               h('li', { key: 'B' }, 'B')              h('li', { key: 'B' }, 'B')
//               h('li', { key: 'C' }, 'C')              h('li', { key: 'C' }, 'C')
//                                                       h('li', { key: 'D' }, 'D')         
// 第一次循环到A，先对比新前和旧前，新前和旧前相等成立，即命中条件1，新前旧前指针下移到B继续比较 
// 当条件不满足新前<=新后&&旧前<=旧后，循环结束 如果是旧节点先循环完毕说明新节点中有需要插入的节点，新前和新后两指针之间即为要添加的新节点

// 例2 旧子节点为 h('li', { key: 'A' }, 'A')    新子节点为 h('li', { key: 'A' }, 'A')
//               h('li', { key: 'B' }, 'B')              h('li', { key: 'B' }, 'B')
//               h('li', { key: 'C' }, 'C')              h('li', { key: 'D' }, 'D')
//               h('li', { key: 'D' }, 'D')                                                 
// 第一次循环到A，先对比新前和旧前，新前和旧前相等成立，即命中条件1，新前旧前指针下移到B继续比较 
// 循环到B时也命中新前旧前，新前旧前继续下移到C
// 循环到C时命中新后旧后，新后旧后上移，此时新后<新前结束循环
// 当条件不满足新前<=新后&&旧前<=旧后，循环结束 如果是新节点先循环完毕说明旧节点中有需要插入的节点，旧前和旧后指针之间的节点即为要删除的节点