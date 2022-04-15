import EventEmitter from "../src/index"
import { expect, test } from "@jest/globals"

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
