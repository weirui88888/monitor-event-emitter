import { IConfig, IHandler, IEventValue, IListeners, IMatchHandlers, IHandlerDetails } from "../typings"
import { isFunction, isAsyncFunction, isNumber, isObject, isString } from "./util"
const defaultEventScope = "EventEmitter"

/**
 * @description 事件处理器
 * @class EventEmitter
 */
class EventEmitter {
  public maxEvents: number | null
  public scope: string
  public events: Map<string, IEventValue[]>
  public eventEmitterWatcher: Map<string, IHandlerDetails>
  protected debug: boolean
  static version = "v0.0.1"
  constructor(config?: IConfig) {
    this.maxEvents = config?.maxEvents ? config.maxEvents : null
    this.scope = config?.scope || defaultEventScope
    this.debug = config?.debug || false
    this.events = new Map()
    this.eventEmitterWatcher = new Map()
  }

  /**
   * @description 获取当前已注册的事件
   * @readonly
   * @memberof EventEmitter
   */
  get eventKeys() {
    return this.events.keys()
  }

  /**
   * @description 获取当前注册的事件数量，注册事件的数量并不等于处理器的数量，一个事件可能对应多个处理器
   * @readonly
   * @memberof EventEmitter
   */
  get countOfEvents() {
    return this.events.size
  }

  /**
   * @description 获取处理器数量
   * @readonly
   * @memberof EventEmitter
   */
  get countOfAllHandlers() {
    let count = 0
    for (const handlers of this.events.values()) {
      count += handlers.length
    }
    return count
  }

  /**
   * @description 获取事件名为event的处理器数量
   * @param {string} event
   * @returns {*}
   * @memberof EventEmitter
   */
  countOfEventHandlers(event: string) {
    if (!isString(event)) {
      console.log("param event show be string")
      return 0
    }
    const handlers = this.events.get(event)
    if (!handlers) {
      console.log(`The number of handlers with event name ${event} is 0`)
      return 0
    }
    return handlers.length
  }

  /**
   * @description 获取类型为type的处理器数量
   * @param {string} type
   * @returns {*}
   * @memberof EventEmitter
   */
  countOfTypeHandlers(type: string) {
    if (!isString(type)) {
      console.log("param type should be string")
      return 0
    }
    let allHandlers: IEventValue[] = []
    for (const eventHandlers of this.events.values()) {
      allHandlers = [...allHandlers, ...eventHandlers]
    }
    return allHandlers.filter((symbol) => symbol.type === type).length
  }

  on(event: string | IListeners, handler?: IHandler, order?: number) {
    if (!(isString(event) || isObject(event))) {
      console.log("param event should provided with type string or object")
      return this
    }
    if (isString(event)) {
      if (!(isFunction(handler) || isAsyncFunction(handler))) {
        console.log("param handler should provided")
        return this
      }
      return this._registerListener(event as string, handler as IHandler, order)
    }
    if (isObject(event)) {
      return this._registerListeners(event as IListeners)
    }
  }

  protected _registerEvent(identifier: string, handler: IHandler, order?: number) {
    const { events } = this
    const hasOrder = isNumber(order) && (order as number) >= 0
    const [event, type = ""] = identifier.split(".")
    if (!event) {
      console.log("when you're ready to register an event handler, it's best to provide an event name")
      return this
    }

    if (!events.has(event)) {
      events.set(event, [])
    }

    if (hasOrder) {
      const handlers = events.get(event) as IEventValue[]
      handlers.splice(order as number, 0, {
        type,
        handler,
        id: this._uuid()
      })
    } else {
      const handlers = events.get(event) as IEventValue[]
      handlers.push({
        type,
        handler,
        id: this._uuid()
      })
    }
    return this
  }

  protected _registerListener(listener: string, handler: IHandler, order?: number) {
    const listenerKeys = listener.split(" ")
    listenerKeys.forEach((key) => {
      this._registerEvent(key, handler, order)
    })
    return this
  }

  protected _registerListeners(listeners: IListeners) {
    Object.keys(listeners).forEach((key) => {
      const listenerConfig = listeners[key]
      const { handler, order } = listenerConfig
      const listenerKeys = key.split(" ")
      listenerKeys.forEach((key) => {
        this._registerEvent(key, handler, order)
      })
    })
    return this
  }

  /**
   * @description 触发注册的事件
   * @param {string} event 支持pay || pay.sticker  || pay.sticker download.font
   * @example emit('pay') 将会触发事件名为pay的所有事件处理器
   * @example emit('download.font') 将仅会触发事件名为download且事件类型为font的事件处理器
   * @example emit('pay download.font') 将会触发事件名为pay的所有事件处理器以及事件名为download且事件类型为font的事件处理器
   * @param {...any[]} args
   * @return {*}
   * @memberof EventEmitter
   */
  emit(event: string, ...args: any[]) {
    const reg = /^[A-Za-z][A-Za-z.]+(\s{1}[A-Za-z.]+)*/g
    if (!reg.test(event)) {
      console.log(
        "param event show be string,such as 'download.pic' or 'download.pic pay' or 'download.pic pay.privilege'"
      )
      return this
    }

    if (!this.events.size) {
      console.log("no events are registered in the event center")
      return this
    }
    const events = event.split(" ")
    for (const event of events) {
      this._emit(event, ...args)
    }
    return this
  }

  /**
   * @description 清除所有的事件处理器
   * @returns {*}
   * @memberof EventEmitter
   */
  offAll() {
    return this.events.clear()
  }

  /**
   * @description 清除事件处理器
   * @param {string} event
   * @returns {*}
   * @memberof EventEmitter
   */
  off(event: string) {
    const reg = /^[A-Za-z][A-Za-z.]+(\s{1}[A-Za-z.]+)*/g
    if (!reg.test(event)) {
      console.log(
        "param event show be string,such as 'download.pic' or 'download.pic pay' or 'download.pic pay.privilege'"
      )
      return this
    }
    const events = event.split(" ")
    for (const event of events) {
      const [eventName, type = ""] = event.split(".")
      this._off(eventName, type)
    }
    return this
  }

  protected _off(eventName: string, type: string) {
    if (eventName && type) {
      const handlers = this.events.get(eventName) || []
      const handlerOfTypeIndex = handlers.findIndex((handler) => handler.type === type)
      if (handlerOfTypeIndex >= 0) {
        handlers.splice(handlerOfTypeIndex, 1)
      }
    } else {
      if (this.events.has(eventName)) {
        this.events.delete(eventName)
      }
    }
    this._deleteInvalidEvent()
    return this
  }

  /**
   * @description 删除类型为type的事件处理器
   * @param {string} type
   * @returns {*}
   * @memberof EventEmitter
   */
  offType(type: string) {
    if (!isString(type)) {
      console.log("param type should be string")
      return this
    }
    for (const key of this.eventKeys) {
      const handlers = this.events.get(key) || []
      const handlerOfTypeIndex = handlers.findIndex((handler) => handler.type === type)
      if (handlerOfTypeIndex >= 0) {
        handlers.splice(handlerOfTypeIndex, 1)
      }
    }
    this._deleteInvalidEvent()
    return this
  }

  protected _deleteInvalidEvent() {
    for (const key of this.eventKeys) {
      const handlers = this.events.get(key) || []
      if (handlers.length === 0) {
        this.events.delete(key)
      }
    }
  }

  /**
   * @description 以事件类型触发注册的事件
   * @param {string} type
   * @example emitType('font') 将会触发所有类型为font的事件，不区分时间名称
   * @param {...any[]} args
   * @return {*}
   * @memberof EventEmitter
   */
  emitType(type: string, ...args: any[]) {
    if (!isString(type)) {
      console.log("请输入字符串格式的事件类型")
      return this
    }
    let typeHandlers: IMatchHandlers[] = []
    for (const [eventName, handlers] of this.events.entries()) {
      const [typeHandler] = handlers.filter((handler) => handler.type === type) as IEventValue[]
      if (typeHandler) {
        const { id, type: eventType, handler } = typeHandler
        typeHandlers = [
          ...typeHandlers,
          {
            id,
            type: eventType,
            handler,
            eventName
          }
        ]
      }
    }
    for (const { handler, id, type, eventName } of typeHandlers) {
      const result = handler(...args)
      this._setWatcher(eventName, type, id, result, ...args)
    }

    return this
  }

  protected _emit(event: string, ...args: any[]) {
    const [eventName, type = ""] = event.split(".")
    const handlers = this._matchHandlers(eventName, type)
    for (const { handler, id, type, eventName } of handlers) {
      const result = handler(...args)
      this._setWatcher(eventName, type, id, result, ...args)
    }
  }

  protected _matchHandlers(eventName: string, type: string): IMatchHandlers[] {
    const handlers = this.events.get(eventName) || []
    if (type)
      return handlers
        .filter((listener) => listener.type === type)
        .map((symbol) => {
          const { handler, id, type } = symbol
          return {
            handler,
            id,
            type,
            eventName
          }
        })
    return handlers.map((symbol) => {
      const { handler, id, type } = symbol
      return {
        handler,
        id,
        type,
        eventName
      }
    })
  }

  protected _uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  protected _setWatcher(eventName: string, type: string, id: string, result: any, ...args: any[]) {
    if (!type) {
      type = "global"
    }
    const eventUuid = `${eventName}-${type}-${id}`
    if (!this.eventEmitterWatcher.has(eventUuid)) {
      this.eventEmitterWatcher.set(eventUuid, {
        count: 1,
        details: [
          {
            result,
            time: new Date(),
            args
          }
        ]
      })
    } else {
      const applyCount = (this.eventEmitterWatcher.get(eventUuid) as IHandlerDetails).count
      const applyDetails = (this.eventEmitterWatcher.get(eventUuid) as IHandlerDetails).details
      this.eventEmitterWatcher.set(eventUuid, {
        count: applyCount + 1,
        details: [...applyDetails, { result, time: new Date(), args }]
      })
    }
  }

  watch() {
    return this.eventEmitterWatcher
  }
}

export default EventEmitter
