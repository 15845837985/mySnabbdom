import h from "./mysnabbdom/h.js";

var myVnode1 = h('ul', {}, [
    h('li', {}, '麒麟西瓜'),
    h('li', {}, '吊雷西瓜'),
    h('li', {}, [
        h('p', {}, 'A'),
        h('p', {}, 'B'),
    ]),
    h('li', {}, h('p', {}, 'C')),

])
console.log(myVnode1);