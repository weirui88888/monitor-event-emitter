import EventEmitter from "../src/index"
import { expect, test, jest } from "@jest/globals"

test("create a single eventEmitter with scope and maxEvents", () => {
  const eventEmitter = new EventEmitter({
    scope: "范围",
    maxEvents: 10
  })
  expect(eventEmitter.scope).toBe("范围")
  expect(eventEmitter.maxEvents).toBe(10)
  expect(Object.keys(eventEmitter.events).length).toBe(0)
})

test("create a single eventEmitter without scope and maxEvents", () => {
  const eventEmitter = new EventEmitter()
  expect(eventEmitter.scope).toBe("EventEmitter")
  expect(eventEmitter.maxEvents).toBe(null)
  expect(Object.keys(eventEmitter.events).length).toBe(0)
})

test("config field debug to be true", () => {
  const eventEmitter = new EventEmitter({
    debug: true
  })
  expect(eventEmitter.countOfEvents).toBe(0)
  expect(eventEmitter.countOfAllHandlers).toBe(0)
})

test("check EventEmitter version", () => {
  expect(EventEmitter.version).toBe("v0.0.1")
})

test("emitter registers event with single way", () => {
  const emitter = new EventEmitter()

  emitter.on("download.sticker download.packet", () => {
    console.log("this is download handler")
  })

  expect(emitter.events.size).toBe(1)

  const firstPayHandler = () => {
    return "firstPayHandler"
  }

  const secondPayHandler = () => {
    return "secondPayHandler"
  }

  emitter.on("pay", firstPayHandler)
  emitter.on("pay", secondPayHandler, 0)
  expect(emitter.events.size).toBe(2)
})

test("emitter registers event with object way", () => {
  const emitter = new EventEmitter()

  const handle1 = jest.fn()
  const handle2 = jest.fn()
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
  expect(emitter.events.size).toBe(2)
  expect(emitter.countOfEventHandlers("pay")).toBe(4)
  // @ts-ignore
  expect(emitter.countOfEventHandlers(123)).toBe(0)
  expect(emitter.countOfEventHandlers("unExpectEvent")).toBe(0)
  // @ts-ignore
  expect(emitter.countOfTypeHandlers(123)).toBe(0)
  expect(emitter.countOfTypeHandlers("filter")).toBe(2)
})

test("register error handler with no eventName", () => {
  const emitter = new EventEmitter()

  const handle1 = jest.fn()

  const res = emitter.on(".sticker", handle1)
  // @ts-ignore
  expect(res).toBe(emitter)
})

test("not supply with a fn handler", () => {
  const emitter = new EventEmitter()

  const handle1 = "not supply with a fn handler"

  // @ts-ignore
  const res = emitter.on("sticker", handle1)
  expect(res).toBe(emitter)
})

test("not emit with a correct way", () => {
  const emitter = new EventEmitter()

  const handle1 = jest.fn()
  emitter.on("download.sticker", handle1)
  const res = emitter.emit(".sticker")
  expect(res).toBe(emitter)
})

test("type error of emitType", () => {
  const emitter = new EventEmitter()
  const handle1 = jest.fn()
  emitter.on("download.sticker", handle1)
  // @ts-ignore
  const res = emitter.emitType(true, "provide")
  expect(res).toBe(emitter)
})
