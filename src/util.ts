const checkType = (origin: any) => Object.prototype.toString.call(origin).slice(8, -1)

const isNumber = (origin: any) => checkType(origin) === "Number"
const isString = (origin: any) => checkType(origin) === "String"
const isBoolean = (origin: any) => checkType(origin) === "Boolean"
const isFunction = (origin: any) => checkType(origin) === "Function"
const isArray = (origin: any) => checkType(origin) === "Array"
const isObject = (origin: any) => checkType(origin) === "Object"

export { isNumber, isString, isBoolean, isFunction, isArray, isObject }
