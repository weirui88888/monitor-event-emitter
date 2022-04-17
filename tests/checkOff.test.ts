import EventEmitter from "../src/index"
import { expect, test, jest } from "@jest/globals"

test("test offAll", () => {
  const eventEmitter = new EventEmitter({
    scope: "范围",
    maxEvents: 10
  })
  const handler1 = jest.fn()

  eventEmitter.on("download.font", handler1)

  eventEmitter.offAll()

  eventEmitter.emit("download.font", "provide")

  expect(eventEmitter.events.size).toBe(0)
})

test("test delete key", () => {
  const eventEmitter = new EventEmitter({
    scope: "范围",
    maxEvents: 10
  })
  const handler1 = jest.fn()

  eventEmitter.on("download.font", handler1)

  eventEmitter.offType("font")

  expect(eventEmitter.events.size).toBe(0)
})

test("test wrong param of offType", () => {
  const eventEmitter = new EventEmitter()
  const handler1 = jest.fn()

  eventEmitter.on("download.font", handler1)
  // @ts-ignore
  eventEmitter.offType(true)
})

test("test off", () => {
  const eventEmitter = new EventEmitter({
    scope: "范围",
    maxEvents: 10
  })
  const handler1 = jest.fn()
  const handler2 = jest.fn()
  const handler3 = jest.fn()

  eventEmitter.on("download.font", handler1)
  eventEmitter.on("download.sticker", handler2)
  // @ts-ignore
  expect(eventEmitter.events.get("download").length).toBe(2)
  eventEmitter.off("download.sticker")
  // @ts-ignore
  expect(eventEmitter.events.get("download").length).toBe(1)

  eventEmitter.emit("download.font", "provide")

  expect(eventEmitter.events.size).toBe(1)

  eventEmitter.off(".font")

  eventEmitter.on("download.packet", handler3)
  // @ts-ignore
  expect(eventEmitter.events.get("download").length).toBe(2)
  eventEmitter.off("download")

  expect(eventEmitter.events.size).toBe(0)
})
