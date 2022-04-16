import EventEmitter from "../src/index"
import { expect, test } from "@jest/globals"

test("create a single eventEmitter with scope and maxEvents", () => {
  const eventEmitter = new EventEmitter({
    scope: "范围",
    maxEvents: 10
  })
  expect(eventEmitter.scope).toBe("范围")
  expect(eventEmitter.debug).toBe(false)
  expect(eventEmitter.maxEvents).toBe(10)
  expect(Object.keys(eventEmitter.events).length).toBe(0)
})

test("create a single eventEmitter without scope and maxEvents", () => {
  const eventEmitter = new EventEmitter()
  expect(eventEmitter.scope).toBe("EventEmitter")
  expect(eventEmitter.maxEvents).toBe(null)
  expect(eventEmitter.debug).toBe(false)
  expect(Object.keys(eventEmitter.events).length).toBe(0)
})

test("config field debug to be true", () => {
  const eventEmitter = new EventEmitter({
    debug: true
  })
  expect(eventEmitter.debug).toBe(true)
  expect(eventEmitter.countOfEvents).toBe(0)
  expect(eventEmitter.countOfHandlers).toBe(0)
})

test("check EventEmitter version", () => {
  expect(EventEmitter.version).toBe("v0.0.1")
})

test("emitter registers event with single way", () => {
  const emitter = new EventEmitter()

  emitter.on("download.sticker download.packet", () => {
    console.log("this is download handler")
  })

  console.log(emitter.events)

  expect(emitter.events.size).toBe(1)

  const firstPayHandler = () => {
    return "firstPayHandler"
  }

  const secondPayHandler = () => {
    return "secondPayHandler"
  }

  emitter.on("pay", firstPayHandler)
  emitter.on("pay", secondPayHandler, 0)
  console.log(emitter.events.get("pay"))
  expect(emitter.events.size).toBe(2)
})

test("emitter registers event with object way", () => {
  const emitter = new EventEmitter()

  const handle1 = () => `handle1`
  const handle2 = () => `handle2`
  const handle3 = () => `handle3`
  const handle4 = () => `handle4`
  const handle5 = () => `handle5`

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
  console.log(emitter.events)
  expect(emitter.events.size).toBe(2)
})
