# EventEmitter ![language-typescript](https://img.shields.io/badge/typescript-blue?style=flat&logo=typescript&logoColor=white) [![codecov](https://codecov.io/gh/weirui88888/monitor-event-emitter/branch/master/graph/badge.svg?token=T9PAH7EJN1)](https://codecov.io/gh/weirui88888/monitor-event-emitter)

[English Doc](./README.md)

## 为什么用该组件？

通过使用它，您可以轻松地注册和触发事件。同时，您可以在控制台中实时观察事件处理程序执行的快照信息。

你也可以基于该基类封装自己的业务代码。

```javascript
import EventEmitter from "monitor-event-emitter"

class derivedClass extends EventEmitter {
  constructor(config) {
    super(config)
  }
  ...your code
}

```

## 安装

轻量级的事件监控处理器，支持`cmj`、`esm`、`umd`模块。

```javascript
npm i -S monitor-event-emitter
```

## 使用方式

下面是最基本的使用方式，更多使用方式请参考 [支持的 Api](#支持的-api)

```javascript
// esm
import EventEmitter from "monitor-event-emitter"
// or cmj
const EventEmitter = require("monitor-event-emitter")

const eventsBus = new EventEmitter()

eventsBus.on("download", (status) => console.log(status))

eventsBus.emit("download", true)

eventsBus.off("download")

eventsBus.watch() // 获取目前为止执行过的事件处理器函数快照，从而可以知道调用的顺序、时间、入参以及返回值来进行问题定位
```

## 支持的 API

### `eventsBus.on(event,handler)`

同时注册一个或者多个事件

- `example`

```javascript
eventsBus.on("download", (...args:[]) => {...}) // 注册一个事件名download事件处理器
eventsBus.on("download.image", (...args:[]) => {...}) // 注册一个事件名为download且类型名为image的事件处理器
eventsBus.on("download pay.membership", (...args:[]) => {...}) // 同时注册一个事件名为download，及一个事件名为pay且类型名为membership的事件处理器
```

- `attention`

  - 虽然注册了多个事件，但是他们的处理器函数是相同的
  - **一个事件可能对应多个不同类型的事件处理器函数**

### `eventsBus.emit(event,...args)`

触发事件处理器函数，支持事件名称模糊匹配以及事件名称+类型名称的精确匹配

- `example`

```javascript
eventsBus.on('download.privilege download.image',(status,type)=>{
  // 根据status和type处理你的业务逻辑
})

// 注册之后，你可以通过打印eventsBus.events来获取你注册的事件处理器及事件名
// eventsBus.events
{
  download:[{type:'privilege',handler:(status)=>{...},{type:'image',(status)=>{...}}}]
}

**模糊**
eventsBus.emit('download') // 事件名为download的事件处理器都会被调用

**精确**
eventsBus.emit('download.privilege') // 只有download.privilege会被调用

```

### `eventsBus.emitType(type)`

可以通过类型调用事件处理器，有的情况下，虽然类型名一致，但是他们的事件名是不同的

- example

```javascript
eventsBus.on('download.privilege pay.privilege',(status,type)=>{
  // 根据status和type处理你的业务逻辑
})

// 注册之后，你可以通过打印eventsBus.events来获取你注册的事件处理器及事件名
// eventsBus.events
{
  download:[{type:'privilege',handler:(status,type)=>{...}}],
  pay:[{type:'privilege',handler:(status,type)=>{...}}],
}

**用type触发事件处理器函数**
eventsBus.emitType('privilege',true,'font') // 触发所有的type为privilege的事件处理器
```

### `eventsBus.watch()`

:heart_eyes_cat: 为了能够方便地知道事件处理程序的执行情况。 提供 watch 方法，返回所有事件的执行顺序、参数和返回值、调用时间，方便进行问题定位

所以如果你在使用的过程中遇到了一些疑惑，不妨尝试打印下看看

```javascript
const watcher = eventsBus.watch()
console.log(watcher)
```

### `eventsBus.off(event)`

销毁已注册的事件处理器，支持模糊和精确两种模式

- example

```javascript
**模糊**
eventsBus.off('download') // 删除事件名为download下面所有已注册的事件处理器

**精确**
eventsBus.off('download.privilege') // 仅销毁事件名为download且事件类型为privilege的事件处理器
```

### `eventsBus.offType(type)`

根据事件类型销毁已注册的事件处理器

- example

```javascript
eventsBus.offType("privilege")
```

### `eventsBus.offAll()`

销毁所有的事件处理器

- example

```javascript
eventsBus.offAll()
```

### `eventsBus.countOfEventHandlers(event)`

返回给定事件名的事件处理器的数量

```javascript
eventsBus.on("download.privilege pay.privilege download.font", (status, type) => {
  // 根据status和type处理你的业务逻辑
})

eventsBus.countOfEventHandlers("download") // 2
eventsBus.countOfEventHandlers("pay") // 1
```

### `eventsBus.countOfTypeHandlers(type)`

返回给定类型的事件处理器的数量

```javascript
eventsBus.on("download.privilege pay.privilege download.font delete.privilege", (status, type) => {
  // 根据status和type处理你的业务逻辑
})

eventsBus.countOfTypeHandlers("privilege") // 3
eventsBus.countOfTypeHandlers("font") // 1
```

### `eventsBus.eventKeys`

返回所有已经注册的事件名

```javascript
eventsBus.on("download.privilege pay.privilege", (status, type) => {
  // 根据status和type处理你的业务逻辑
})

eventsBus.eventKeys // ['download','pay']
```

### `eventsBus.countOfEvents`

返回所有已经注册的事件名的数量

```javascript
eventsBus.on("download.privilege pay.privilege", (status, type) => {
  // 根据status和type处理你的业务逻辑
})

eventsBus.countOfEvents // 2
```

### `eventsBus.countOfAllHandlers`

返回所有的事件处理器的数量

```javascript
eventsBus.on("download.privilege pay.privilege download.font", (status, type) => {
  // 根据status和type处理你的业务逻辑
})

eventsBus.countOfAllHandlers // 3
```

## TODO

- [ ] 可通过开启 debug 模式，支持实时日志打印（目前仅支持通过调用`eventsBus.watch()`进行查看执行快照）
- [x] 添加最大事件处理器数量
- [ ] 美化控制台日志信息
- [ ] 支持快照清爽模式（目前里面的数据类型是采用 map 实现，写起来很方便，读起来可能不太舒服）

## Contributing

欢迎通过 [issues](https://github.com/weirui88888/monitor-event-emitter/issues) 或者 [prs](https://github.com/weirui88888/monitor-event-emitter/pulls) 向我提出问题.

[![](https://img.shields.io/badge/github-@issue-green.svg?logo=github)](https://github.com/weirui88888/monitor-event-emitter/issues) [![](https://img.shields.io/badge/github-@pr-green.svg?logo=github)](https://github.com/weirui88888/monitor-event-emitter/pulls)
