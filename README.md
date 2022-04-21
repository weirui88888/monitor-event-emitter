# MonitorEventEmitter ![language-typescript](https://img.shields.io/badge/typescript-blue?style=flat&logo=typescript&logoColor=white) [![codecov](https://codecov.io/gh/weirui88888/monitor-event-emitter/branch/master/graph/badge.svg?token=AU474UU208)](https://codecov.io/gh/weirui88888/monitor-event-emitter) ![minified size](https://img.shields.io/badge/minified%20size-7.5kB-blue)

[中文文档](./README-ZH.md)

[Demo](http://show.newarray.vip/monitor-event-emitter/index.html)

## Why

A lightweight event monitoring processor. Support `cmj`、`esm`、`umd` module

By using it, you can easily register and trigger events. At the same time, you can observe the **snapshot information** of the event handler execution in real time in the **console**, so as to **locate the problems** of some complex scenarios

## Console real time snapshot information

![renderings](http://show.newarray.vip/monitor-event-emitter/monitor-event-emitter.png)

### Log description

| handlerId                   |         result          |      time      |           args            |         handlerType          |                    lastHandled                     |
| --------------------------- | :---------------------: | :------------: | :-----------------------: | :--------------------------: | :------------------------------------------------: |
| register function unique id | function returns result | execution time | function input parameters | function type, sync or async | true represents the last execution of the function |

Through this information, I believe it will be helpful to your development.

## Overview

:tada: In order to reduce the cost of use, the library holds the principle of openness without any constraints. You can even instantiate without passing any parameters and it will still work just fine. But in order to better fit your expected goals, you can choose to make some necessary configurations.Please refer to the currently supported parameters [Config](#config)

**Also,You can extend your business module with this base class, such as:**

```javascript
import EventEmitter from "monitor-event-emitter"

class derivedClass extends MonitorEventEmitter {
  constructor(config) {
    super(config)
  }
  ...your code
}
// Through inheritance, your library will also have all its capabilities to help you work better.
```

## Install

```javascript
npm i -S monitor-event-emitter
```

## Usage

This is just the most basic way to use it. For more usage, please refer to [Support Api](#support-api)

```javascript
// esm
import EventEmitter from "monitor-event-emitter"
// or cmj
const EventEmitter = require("monitor-event-emitter")

const eventsBus = new EventEmitter()

eventsBus.on("download.avatar", (status) => console.log(status)) // register a handler with event download and type avatar

eventsBus.emit("download", true) // emit by event download

eventsBus.emitType("avatar", false) // emit by type avatar

eventsBus.off("download") // off handlers which name is download

...
```

## Support Api

### `eventsBus.on(event,handler)`

Register for one or more events at the same time

- `example`

```javascript
eventsBus.on("download", (...args:[]) => {...}) // only register a single handler with eventName download
eventsBus.on("download.image", (...args:[]) => {...}) // register a single handler with eventName download and type image
eventsBus.on("download pay.membership", (...args:[]) => {...}) // at the same time register a single handler with eventName download, and eventName pay with type membership
eventsBus.on('download.avatar download.image download.privilege pay.membership pay.privilege') // register multiple event handlers with event name and type name at the same time
```

- `expand && attention （If your usage scenario is relatively simple, you can ignore the following complex usage, and it can still support you to complete your work well）`

  - **an event may correspond to multiple event handler functions of different types, and the class names of different events may be the same. The purpose of this design is to achieve batch processing of functions with the same logic, but it may not be necessary in most usage scenarios, as below**
    - download (event)
      - avatar (type)
      - image (type)
      - privilege (type)
      - ...
    - pay (event)
      - membership (type)
      - privilege (type)
      - ...
  - if you register the event handler as shown above, your event hub will look like this

  ```javascript
    // eventsBus.events（It is actually a map structure, which is in object form for convenience.）
    {
      download: [
        {
          type: "avatar",
          handler: () => {},
          id: uuid
        },
        {
          type: "image",
          handler: () => {},
          id: uuid
        },
        {
          type: "privilege",
          handler: () => {},
          id: uuid
        }
      ],
      pay: [
        {
          type: "membership",
          handler: () => {},
          id: uuid
        },
        {
          type: "privilege",
          handler: () => {},
          id: uuid
        }
      ]
    }
    // you can call eventsBus.emitType('privilege')，thus executing 3, 5 simultaneously
    // you can call eventsBus.emit('download')，thus executing 1, 2, 3 simultaneously
    // When you want to call a certain type of event handler function under a specific event name，you can call eventsBus.emit('pay.privilege')，so as to execute exactly 5
  ```

### `eventsBus.emit(event,...args)`

Trigger event handler, support event name (`batch`) or event name with type (`exact`)

- `example`

```javascript
eventsBus.on('download.privilege download.image',(status,type)=>{
  // The processor function here indicates what should be done according to the status and type after downloading the privilege or image
})

// After registering, you will find your event hub looks like this

// eventsBus.events
{
  download:[{type:'privilege',handler:(status)=>{...},{type:'image',(status)=>{...}}}]
}

**batch mode**
eventsBus.emit('download') // both of download.privilege and download.image handler will be trigger

**exact mode**
eventsBus.emit('download.privilege') // only download.privilege will be trigger
```

### `eventsBus.emitType(type)`

Trigger handlers by event type

- example

```javascript
eventsBus.on('download.privilege pay.privilege',(status,type)=>{
  // do something with args.status and args.type
})

// After registering, you will find your event hub looks like this

// eventsBus.events
{
  download:[{type:'privilege',handler:(status,type)=>{...}}],
  pay:[{type:'privilege',handler:(status,type)=>{...}}],
}

**type mode**
eventsBus.emitType('privilege',true,'font') // both of download.privilege and pay.privilege handler will be trigger
```

### `eventsBus.off(event)`

Destroy event handler, support event name (`batch`) or event name with type (`exact`)

- example

```javascript
**batch mode**
eventsBus.off('download') // all handlers with eventName download will be destroyed

**exact mode**
eventsBus.off('download.privilege') // handler with eventName download and type privilege will be destroyed
```

### `eventsBus.offType(type)`

Destroy event handlers of a certain type

- example

```javascript
eventsBus.offType("privilege")
```

### `eventsBus.offAll()`

Destroy all registered events and event handlers

- example

```javascript
eventsBus.offAll()
```

### `eventsBus.countOfEventHandlers(event)`

Returns the number of handler functions for the given event

```javascript
eventsBus.on("download.privilege pay.privilege download.font", (status, type) => {
  // do something with args.status and args.type
})

eventsBus.countOfEventHandlers("download") // 2
eventsBus.countOfEventHandlers("pay") // 1
```

### `eventsBus.countOfTypeHandlers(type)`

Returns the number of handler functions for the given type

```javascript
eventsBus.on("download.privilege pay.privilege download.font delete.privilege", (status, type) => {
  // do something with args.status and args.type
})

eventsBus.countOfTypeHandlers("privilege") // 3
eventsBus.countOfTypeHandlers("font") // 1
```

### `eventsBus.eventKeys`

Returns the name of the event when it has been registered

```javascript
eventsBus.on("download.privilege pay.privilege", (status, type) => {
  // do something with args.status and args.type
})

eventsBus.eventKeys // ['download','pay']
```

### `eventsBus.countOfEvents`

Returns the name of the event when it has been registered

```javascript
eventsBus.on("download.privilege pay.privilege", (status, type) => {
  // do something with args.status and args.type
})

eventsBus.countOfEvents // 2
```

### `eventsBus.countOfAllHandlers`

Returns the number of all event handlers that have registered for the event

```javascript
eventsBus.on("download.privilege pay.privilege download.font", (status, type) => {
  // do something with args.status and args.type
})

eventsBus.countOfAllHandlers // 3
```

## Config

- `maxEvents | number`
  - The maximum number of events that can be registered, the default is unlimited registration
- `maxHandlers | number`
  - The maximum number of event handler functions that can be registered, the default is unlimited registration
- `scope | string`
  - The **scope** of the event center is for the convenience of distinguishing events under different business logic. After setting, any log of the console will be named after it, mainly for the convenience of identifying and distinguishing the events under different modules
- `debug | boolean`
  - Controls whether real-time logs can be seen in the console. The default value is `false`, which needs to be set to `true` to see it. In general, it needs to be configured according to the environment variable `process.env.production`
- `mode | 'cool' or 'default'`
  - The representation of the console log. At the beginning of the design of this library, in order to facilitate the implementation of logic, the event center structure is implemented with `map`. But later found that it doesn't look very intuitive and beautiful in the console, so the `mode` configuration item was added. The options are `default` and `cool`, `default` means to use the default `map` structure for display, `cool` will be converted to **console table** `array` structure for display. Now the default is `cool` mode, which is more intuitive and clear

## TODO

- [x] Real-time log printing can be supported by enabling debug mode
- [x] Add maximum number of event handlers
- [x] Beautify console log information
- [x] Support log simple mode（At present, the data type in it is implemented by map, which is very convenient to write, but may not be very comfortable to read）
- [ ] Improve unit testing
- [ ] Add console log rendering and explain its meaning

## Contributing

Feel free to submit [issues](https://github.com/weirui88888/monitor-event-emitter/issues) or [prs](https://github.com/weirui88888/monitor-event-emitter/pulls) to me.

[![](https://img.shields.io/badge/github-@issue-green.svg?logo=github)](https://github.com/weirui88888/monitor-event-emitter/issues) [![](https://img.shields.io/badge/github-@pr-green.svg?logo=github)](https://github.com/weirui88888/monitor-event-emitter/pulls)
