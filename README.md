# MonitorEventEmitter ![language-typescript](https://img.shields.io/badge/typescript-blue?style=flat&logo=typescript&logoColor=white) [![codecov](https://codecov.io/gh/weirui88888/monitor-event-emitter/branch/master/graph/badge.svg?token=T9PAH7EJN1)](https://codecov.io/gh/weirui88888/monitor-event-emitter)

[中文文档](./README-ZH.md)

## Why

By using it, you can easily register and trigger events. At the same time, you can observe the snapshot information of the event handler execution in the console in real time.

Also,You can extend your business module with this base class, such as:

```javascript
import EventEmitter from "monitor-event-emitter"

class derivedClass extends MonitorEventEmitter {
  constructor(config) {
    super(config)
  }
  ...your code
}

```

## Install

A lightweight event monitoring processor. Support `cmj`、`esm`、`umd`module.

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

eventsBus.on("download", (status) => console.log(status))

eventsBus.emit("download", true)

eventsBus.off("download")

eventsBus.watch() // monitor the operation of all registered processors
```

## Support Api

### `eventsBus.on(event,handler)`

Register for one or more events at the same time

- `example`

```javascript
eventsBus.on("download", (...args:[]) => {...}) // only register a single handler with eventName download
eventsBus.on("download.image", (...args:[]) => {...}) // register a single handler with eventName download and type image
eventsBus.on("download pay.membership", (...args:[]) => {...}) // at the same time register a single handler with eventName download, and eventName pay with type membership
```

- `attention`

  - Although multiple events are registered, they all have the same event handler
  - **An event may correspond to multiple different types of event handlers**

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

### `eventsBus.watch()`

:heart_eyes_cat: In order to be able to easily know the execution of the event handler. Provides a watch method that returns the order of execution of all events, parameters and return values, and call time.

So if you get some doubts when using it, you can try calling it.

```javascript
const watcher = eventsBus.watch()
console.log(watcher)
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

## TODO

- [ ] Real-time log printing can be supported by enabling debug mode (currently, only viewing and executing snapshots by calling `eventsBus.watch()` is supported)
- [x] Add maximum number of event handlers
- [ ] Beautify console log information
- [ ] Support log simple mode（At present, the data type in it is implemented by map, which is very convenient to write, but may not be very comfortable to read）

## Contributing

Feel free to submit [issues](https://github.com/weirui88888/monitor-event-emitter/issues) or [prs](https://github.com/weirui88888/monitor-event-emitter/pulls) to me.

[![](https://img.shields.io/badge/github-@issue-green.svg?logo=github)](https://github.com/weirui88888/monitor-event-emitter/issues) [![](https://img.shields.io/badge/github-@pr-green.svg?logo=github)](https://github.com/weirui88888/monitor-event-emitter/pulls)
