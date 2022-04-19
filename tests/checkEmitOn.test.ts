import { expect, test, jest } from "@jest/globals"
import EventEmitter from "../src/index"

test("on single event", () => {
  const emitter = new EventEmitter()

  const handle1 = jest.fn()
  const handle2 = jest.fn().mockReturnValueOnce("handle2")
  const handle3 = jest.fn()
  const handle4 = jest.fn()
  const handle5 = jest.fn()

  emitter.on({
    "pay.filter": {
      handler: handle1
    },
    "pay.sticker": {
      handler: handle2
    },
    "pay.font": {
      handler: handle3,
      order: 2
    },
    pay: {
      handler: handle4
    },
    "download.filter": {
      handler: handle5
    }
  })

  emitter.emit("pay")
  expect(handle2).toBeCalled()
  expect(handle1.mock.calls.length).toBe(1)
  expect(handle3.mock.calls.length).toBe(1)
  expect(handle4.mock.calls.length).toBe(1)
  expect(handle5.mock.calls.length).toBe(0)
})

test("on multiple event", () => {
  const emitter = new EventEmitter()

  const handle1 = jest.fn()
  const handle2 = jest.fn().mockReturnValueOnce("handle2")
  const handle3 = jest.fn()
  const handle4 = jest.fn()
  const handle5 = jest.fn()

  emitter.on({
    "pay.filter": {
      handler: handle1
    },
    "pay.sticker": {
      handler: handle2
    },
    "pay.font": {
      handler: handle3,
      order: 2
    },
    pay: {
      handler: handle4
    },
    "download.filter": {
      handler: handle5
    }
  })

  emitter.emit("pay download")
  expect(handle1).toBeCalled()
  expect(handle2).toBeCalled()
  expect(handle3).toBeCalled()
  expect(handle4).toBeCalled()
  expect(handle5).toBeCalled()
})

test("on blend mode", () => {
  const emitter = new EventEmitter()

  const handle1 = jest.fn()
  const handle2 = jest.fn().mockReturnValueOnce("handle2")
  const handle3 = jest.fn()
  const handle4 = jest.fn()
  const handle5 = jest.fn()
  const handle6 = jest.fn()

  emitter.on({
    "pay.filter": {
      handler: handle1
    },
    "pay.sticker": {
      handler: handle2
    },
    "pay.font": {
      handler: handle3,
      order: 2
    },
    pay: {
      handler: handle4
    },
    "download.filter": {
      handler: handle5
    },
    download: {
      handler: handle6
    }
  })

  emitter.emit("pay.font download.filter")
  expect(handle1.mock.calls.length).toBe(0)
  expect(handle2.mock.calls.length).toBe(0)
  expect(handle3).toBeCalled()
  expect(handle4.mock.calls.length).toBe(0)
  expect(handle5.mock.calls.length).toBe(1)
  expect(handle6.mock.calls.length).toBe(0)
  expect(emitter.countOfEvents).toBe(2)
  expect(emitter.countOfAllHandlers).toBe(6)
  expect([...emitter.eventKeys].length).toBe(2)
})

test("error type of event", () => {
  const emitter = new EventEmitter()
  // @ts-ignore
  const unExpectEventRes = emitter.on(123)
  expect(unExpectEventRes instanceof EventEmitter).toBe(true)
})

test("error type of handler", () => {
  const emitter = new EventEmitter()
  // @ts-ignore
  const unExpectEventRes = emitter.on("read", true)
  expect(unExpectEventRes instanceof EventEmitter).toBe(true)
})

test("event register exceeded warn", () => {
  const emitter = new EventEmitter({
    maxEvents: 2
  })

  const handle1 = jest.fn()
  const handle2 = jest.fn()
  const handle3 = jest.fn()
  emitter.on("download", handle1)
  emitter.on("pay", handle2)
  const unExpectEventRes = emitter.on("pick", handle3)
  expect(unExpectEventRes instanceof EventEmitter).toBe(true)
})

test("handler register exceeded warn", () => {
  const emitter = new EventEmitter({
    maxHandlers: 2
  })

  const handle1 = jest.fn()
  const handle2 = jest.fn()
  emitter.on("download.font download.sticker download.packet", handle1)
  const unExpectEventRes = emitter.on("pay", handle2)
  expect(unExpectEventRes instanceof EventEmitter).toBe(true)
})

test("handler register exceeded warn", () => {
  const emitter = new EventEmitter({
    maxHandlers: 2
  })

  const handle1 = jest.fn()
  const handle2 = jest.fn()
  emitter.on("download.font download.sticker download.packet", handle1)
  const unExpectEventRes = emitter.on("pay", handle2)
  expect(unExpectEventRes instanceof EventEmitter).toBe(true)
})

test("no handler function found based on your input", () => {
  const emitter = new EventEmitter({
    mode: "cool"
  })

  const handle1 = jest.fn()
  emitter.on("download.font", handle1)
  const unExpectEventRes = emitter.emit("font")
  expect(unExpectEventRes instanceof EventEmitter).toBe(true)
})
