# MonitorEventEmitter ![language-typescript](https://img.shields.io/badge/typescript-blue?style=flat&logo=typescript&logoColor=white) [![codecov](https://codecov.io/gh/weirui88888/monitor-event-emitter/branch/master/graph/badge.svg?token=AU474UU208)](https://codecov.io/gh/weirui88888/monitor-event-emitter)

[English Doc](./README.md)

## 为什么用该组件？

通过使用它，你可以轻松地注册和触发事件。同时，你可以在**控制台中实时**观察事件处理程序执行的**快照信息**，从而对一些复杂场景的问题进行**定位**。

你也可以基于该基类封装自己的业务代码

```javascript
import EventEmitter from "monitor-event-emitter"

class derivedClass extends EventEmitter {
  constructor(config) {
    super(config)
  }
  ...your code
}
// 通过继承这样的方式，你的派生类具备了所有基类的属性和方法
```

## 概述

:tada: 为了降低使用成本，该库持着开放的原则，没有任何的约束。你甚至可以在实例化的时候不传入任何的参数，它仍然可以很好的工作。但是为了能够更加贴合你的预期目标，你可以选择进行一些必要的配置。目前支持的参数请参考[配置项](#配置项)

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

eventsBus.on("download.avatar", (status) => console.log(status)) // 注册一个事件名为download且类型为avatar的事件处理函数

eventsBus.emit("download", true) // 通过事件名触发事件处理函数

eventsBus.emitType("avatar", false) // 通过类型触发事件处理函数

eventsBus.off("download") // 销毁事件名为download的下面的所有事件处理函数

...
```

## 支持的 API

### `eventsBus.on(event,handler)`

同时注册一个或者多个事件

- `example`

```javascript
eventsBus.on("download", (...args:[]) => {...}) // 注册一个事件名download事件处理器
eventsBus.on("download.image", (...args:[]) => {...}) // 注册一个事件名为download且类型名为image的事件处理器
eventsBus.on("download pay.membership", (...args:[]) => {...}) // 同时注册一个事件名为download，及一个事件名为pay且类型名为membership的事件处理器
eventsBus.on('download.avatar download.image download.privilege pay.membership pay.privilege') // 同时注册多个具有事件名和类型名的事件处理器
```

- <font color="green">拓展 && 注意（如果你的使用场景比较单一，可以忽略下面的复杂用法，仍然能够支持你很好地完成工作）</font>

  - **一个事件可能对应多个不同类型的事件处理器函数，而不同事件的类名又可能是一样的。这么设计的目的是为了实现批量处理具有相同逻辑的函数，但是大部分使用场景下可能不太需要，如下：**
    - download (event)
      - avatar (type)
      - image (type)
      - privilege (type)
      - ...
    - pay (event)
      - membership (type)
      - privilege (type)
      - ...
  -  如果注册事件处理函数如上所示，那么你所定义的事件中心看起来会像是这样

    ```javascript
    // eventsBus.events（实际是map结构，为了表示方便用对象形式）
    {
      download: [
        {
          type:'avatar',
          handler:()=>{}, // 1
          id:uuid
        },
        {
          type:'image',
          handler:()=>{}, // 2
          id:uuid
        },
        {
          type:'privilege',
          handler:()=>{}, // 3
          id:uuid
        }
      ],
      pay: [
        {
          type:'membership',
          handler:()=>{}, // 4
          id:uuid
        },
        {
          type:'privilege',
          handler:()=>{}, // 5
          id:uuid
        },
      ]
    }
    // 你可以通过调用eventsBus.emitType('privilege')，从而同时执行3，5
    // 你也可以通过调用eventsBus.emit('download')，从而同时执行1，2，3
    // 当你想要调用某个具体事件名下面某个类型的事件处理器函数时，你可以通过调用eventsBus.emit('pay.privilege')，从而进行精确地执行5
    ```

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

## 配置项

- `maxEvents | number`
  - 最多支持注册的事件数量，默认是可以无限注册的
- `maxHandlers | number`
  - 最多支持注册的事件处理器函数数量，默认是可以无限注册的
- `scope | string`
  - 事件中心的**作用域**，为了方便能够区分不同业务逻辑下面的事件。设置了之后，控制台的任何日志都会以其进行命名，主要是为了方便识别和区分不同模块下面的事件
- `debug | boolean`
  - 控制是否能够在控制台看到实时日志，默认值是`false`，需要设置为`true`才能看到。一般情况下需要根据环境变量`process.env.production`进行配置
- `mode | 'cool' or 'default'`
  - 控制台日志的表现形式。设计该库之初，为了方便逻辑的实现，事件中心结构采用`map`实现。但是后期发现在控制台中看起来不太直观和美观，所以添加了`mode`配置项。可选项有`default`和`cool`，`default`表示用默认的`map`结构进行展示，`cool`则会被转变成**控制台表格**的`array`结构进行展示。现在默认的就是`cool`模式，更加直观和清晰

## TODO

- [x] 可通过开启 debug 模式，支持实时日志打印
- [x] 添加最大事件处理器数量
- [x] 美化控制台日志信息
- [x] 支持快照清爽模式（目前里面的数据类型是采用 map 实现，写起来很方便，读起来可能不太舒服）
- [ ] 完善单元测试:sob: (jest 测试框架不太熟，异步处理器函数的单元测试部分不太会写。。。)
- [ ] 添加控制台日志效果图以及阐述它的意义

## Contributing

欢迎通过 [issues](https://github.com/weirui88888/monitor-event-emitter/issues) 或者 [prs](https://github.com/weirui88888/monitor-event-emitter/pulls) 向我提出问题.

[![](https://img.shields.io/badge/github-@issue-green.svg?logo=github)](https://github.com/weirui88888/monitor-event-emitter/issues) [![](https://img.shields.io/badge/github-@pr-green.svg?logo=github)](https://github.com/weirui88888/monitor-event-emitter/pulls)
