# EventEmitter ![language-typescript](https://img.shields.io/badge/typescript-blue?style=flat&logo=typescript&logoColor=white) [![codecov](https://codecov.io/gh/weirui88888/pretty-event-emitter/branch/master/graph/badge.svg?token=T9PAH7EJN1)](https://codecov.io/gh/weirui88888/pretty-event-emitter)

## Why

By using it, you can easily register and trigger events. At the same time, you can observe the snapshot information of the event handler execution in the console in real time.

## Install

A lightweight event monitoring processor. Support `cmj`、`esm`、`umd`module.

```javascript
npm i -S pretty-event-emitter
```

## Usage

This is just the most basic way to use it. For more usage, please refer to [Support Api](#support-api)

```javascript
// esm
import EventEmitter from "pretty-event-emitter"
// or cmj
const EventEmitter = require("pretty-event-emitter")

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
eventsBus.on("download", (...args:[]) => {...do some thing as you like with args}) // only register a single handler with eventName download
eventsBus.on("download.image", (...args:[]) => {...do some thing as you like with args}) // register a single handler with eventName download and type pic
eventsBus.on("download pay.membership", () => {...do some thing as you like with args}) // at the same time register a single handler with eventName download, and eventName pay with type membership
```

- `attention`

  - Although multiple events are registered, they all have the same event handler
  - **An event may correspond to multiple different types of event handlers**

### `eventBus.emit(event,...args)`

Trigger event handler, support event name (`batch`) or event name with type (`exact`)

- `example`

```javascript
eventsBus.on('download.privilege download.image',(status)=>{
  // The processor function here indicates what should be done according to the status after downloading the privilege or image
})

// After registering, you will find your event hub looks like this

// eventBus.events
{
  download:[{type:'privilege',handler:(status)=>{...},{type:'image',(status)=>{...}}}]
}

**batch mode**
eventsBus.emit('download') // both of download.privilege and download.image handler will be trigger

**exact mode**
eventsBus.emit('download.privilege') // only download.privilege will be trigger

```

### `eventBus.emitType(type)`

Trigger handlers by event type

- example

```javascript
eventsBus.on('download.privilege pay.privilege',(status,type)=>{
  // do something with args.status and args.type
})

// After registering, you will find your event hub looks like this

// eventBus.events
{
  download:[{type:'privilege',handler:(status,type)=>{...}}],
  pay:[{type:'privilege',handler:(status,type)=>{...}}],
}

**type mode**
eventsBus.emitType('privilege',true,'font') // both of download.privilege and pay.privilege handler will be trigger
```

### `eventBus.off(event)`

Destroy event handler, support event name (`batch`) or event name with type (`exact`)

- example

```javascript
**batch mode**
eventsBus.off('download') // all handlers with eventName download will be destroyed

**exact mode**
eventsBus.off('download.privilege') // handler with eventName download and type privilege will be destroyed
```

### `eventBus.offType(type)`

Destroy event handlers of a certain type

- example

```javascript
eventsBus.offType("privilege")
```

### `eventBus.offAll()`

Destroy all registered events and event handlers

- example

```javascript
eventsBus.offAll()
```

### `eventBus.watch()`

:heart_eyes_cat: In order to be able to easily know the execution of the event handler. Provides a watch method that returns the order of execution of all events, parameters and return values, and call time.

So if you get some doubts when using it, you can try calling it.

```javascript
const watcher = eventsBus.watch()
console.log(watcher)
```

## Contributing

Feel free to submit [issues](https://github.com/weirui88888/pretty-event-emitter/issues) or [prs](https://github.com/weirui88888/pretty-event-emitter/pulls) to me.

[![](https://img.shields.io/badge/github-@issue-green.svg?logo=github)](https://github.com/weirui88888/pretty-event-emitter/issues) [![](https://img.shields.io/badge/github-@pr-green.svg?logo=github)](https://github.com/weirui88888/pretty-event-emitter/pulls)
