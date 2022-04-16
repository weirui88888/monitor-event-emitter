import { IConfig, IHandler, IEventValue, IListeners } from "../typings"
import { isFunction, isNumber, isObject, isString } from "./util"
const defaultEventScope = "EventEmitter"

/**
 * @description 事件处理器
 * @class EventEmitter
 */
class EventEmitter {
  public maxEvents: number | null
  public scope: string
  public events: Map<string, IEventValue[]>
  public debug: boolean
  static version = "v0.0.1"
  constructor(config?: IConfig) {
    this.maxEvents = config?.maxEvents ? config.maxEvents : null
    this.scope = config?.scope || defaultEventScope
    this.debug = config?.debug || false
    this.events = new Map()
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
  get countOfHandlers() {
    let count = 0
    for (const handlers of this.events.values()) {
      count += handlers.length
    }
    return count
  }

  on(event: string | IListeners, handler?: IHandler, order?: number) {
    if (!(isString(event) || isObject(event))) {
      console.log("请输入正确的事件标识符")
      return this
    }
    if (isString(event)) {
      if (!isFunction(handler)) {
        console.log("请输入正确的事件处理器")
        return this
      }
      return this._registerListener(event as string, handler as IHandler, order)
    }
    if (isObject(event)) {
      return this._registerListeners(event as IListeners)
    }

    return this
  }

  protected _registerEvent(identifier: string, handler: IHandler, order?: number) {
    const { events } = this
    const hasOrder = isNumber(order) && (order as number) >= 0
    const [event, type = ""] = identifier.split(".")
    if (!isFunction(handler)) {
      return this
    }

    if (!events.has(event)) {
      events.set(event, [])
    }

    if (hasOrder) {
      const handlers = events.get(event) as IEventValue[]
      handlers?.splice(order as number, 0, {
        type,
        handler
      })
      events.set(event, handlers)
    } else {
      const handlers = events.get(event) as IEventValue[]
      handlers.push({
        type,
        handler
      })
      events.set(event, handlers)
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
    const reg = /^[.|A-Za-z][A-Za-z.]+(\s{1}[A-Za-z.]+)*/g
    if (!reg.test(event)) {
      console.log("请输入正确的触发事件标识符")
      return this
    }
    const events = event.split(" ")
    for (const event of events) {
      this._emit(event, ...args)
    }
    return this
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
    let typeHandlers: IHandler[] = []
    for (const handlers of this.events.values()) {
      const typeHandler = handlers.filter((event) => event.type === type).map((symbol) => symbol.handler)
      typeHandlers = [...typeHandlers, ...typeHandler]
    }
    for (const handler of typeHandlers) {
      handler(...args)
    }
    return this
  }

  protected _emit(event: string, ...args: any[]) {
    const [eventName, type = ""] = event.split(".")
    const handlers = this._matchHandlers(eventName, type)
    for (const handler of handlers) {
      handler(...args)
    }
  }

  protected _matchHandlers(eventName: string, type: string): IHandler[] {
    const handlers = this.events.get(eventName) || []
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!type) return handlers.filter((listener) => listener.type === type).map((symbol) => symbol.handler)
    return handlers.map((symbol) => symbol.handler)
  }
}

export default EventEmitter
