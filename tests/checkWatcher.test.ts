import EventEmitter from "../src/index"
import { expect, test, jest } from "@jest/globals"

// test("test async fn", (done) => {
//   const emitter = new EventEmitter({
//     mode: "cool",
//     debug: true
//   })

//   const handle1 = async (id: any) => {
//     setTimeout(() => {
//       done()
//     }, 100)

//     return id
//   }

//   emitter.on({
//     pay: {
//       handler: handle1
//     }
//   })

//   emitter.emit("pay", 4399)
// })
test("return expect mode", () => {
  const emitter = new EventEmitter({
    mode: "cool",
    debug: true
  })

  const handle1 = jest.fn()

  emitter.on({
    pay: {
      handler: handle1
    }
  })

  expect(emitter.snapshotMode).toBe("cool")
})

test("resolve async status", (done) => {
  const emitter = new EventEmitter({
    mode: "cool",
    debug: true
  })

  const handle2 = async (status: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(status)
      }, 300)

      setTimeout(() => {
        done()
      }, 500)
    })
  }

  emitter.on("download", handle2)

  emitter.emit("download", true)
})

test("stringify handler result about obj to string with cool mode", (done) => {
  const emitter = new EventEmitter({
    mode: "cool",
    debug: true
  })

  const handle1 = jest.fn().mockReturnValueOnce(123)

  const handle2 = jest.fn().mockImplementation(() => {
    setTimeout(() => {
      done()
    }, 300)
    return {
      id: 4399,
      status: "success"
    }
  })

  emitter.on("pay", handle1)
  emitter.on("download", handle2)

  emitter.emit("download")
  emitter.emit("pay")
})

test("stringify handler result about obj to string with default mode", (done) => {
  const emitter = new EventEmitter({
    mode: "default",
    debug: true
  })

  const handle1 = jest.fn().mockImplementation(() => {
    setTimeout(() => {
      done()
    }, 300)
    return {
      random: Math.random()
    }
  })

  emitter.on("pay", handle1)

  emitter.emit("pay")
  emitter.emit("pay")
})

test("test emitType", (done) => {
  const emitter = new EventEmitter({
    mode: "cool",
    debug: true
  })

  const handle1 = jest.fn().mockImplementation(() => {
    setTimeout(() => {
      done()
    }, 300)
    return {
      random: Math.random()
    }
  })

  emitter.on("pay.sticker", handle1)

  emitter.emitType("sticker")
})
