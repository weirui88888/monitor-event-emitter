/* eslint-disable @typescript-eslint/no-empty-function */
import { isNumber, isString, isBoolean, isFunction, isArray, isObject, isSymbol } from "../src/util"
import { expect, test } from "@jest/globals"

test("isNumber", () => {
  expect(isNumber("Carl")).toBe(false)
  expect(isNumber(2)).toBe(true)
})

test("isString", () => {
  expect(isString("Carl")).toBe(true)
  expect(isString(2)).toBe(false)
})

test("isBoolean", () => {
  expect(isBoolean("Carl")).toBe(false)
  expect(isBoolean(2)).toBe(false)
  expect(isBoolean(true)).toBe(true)
})

test("isFunction", () => {
  expect(isFunction("Carl")).toBe(false)
  expect(isFunction(2)).toBe(false)
  expect(isFunction(() => {})).toBe(true)
})

test("isArray", () => {
  expect(isArray("Carl")).toBe(false)
  expect(isArray(2)).toBe(false)
  expect(isArray(() => {})).toBe(false)
  expect(isArray([1, 2, 3])).toBe(true)
})

test("isObject", () => {
  expect(isObject("Carl")).toBe(false)
  expect(isObject(2)).toBe(false)
  expect(isObject(() => {})).toBe(false)
  expect(isObject({ name: "Carl" })).toBe(true)
})

test("isSymbol", () => {
  expect(isSymbol("Carl")).toBe(false)
  expect(isSymbol(2)).toBe(false)
  expect(isSymbol(() => {})).toBe(false)
  expect(isSymbol(Symbol())).toBe(true)
})
