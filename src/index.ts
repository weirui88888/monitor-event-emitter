import { IConfig, IEvent, IHandler, IEventValue, IListeners } from "../typings"
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
    return Object.keys(this.events).reduce((acc, symbol) => {
      return (acc += this.events.get(symbol)?.length as number)
    }, 0)
  }

  on(eventName: string | IEvent, handler?: IHandler, order?: number) {
    if (!(isString(eventName) || isObject(eventName))) {
      console.log("请输入正确的事件标识符")
      return this
    }
    if (isString(eventName)) {
      if (!isFunction(handler)) {
        console.log("请输入正确的事件处理器")
        return this
      }
      return this._registerListener(eventName as string, handler as IHandler, order)
    }
    if (isObject(eventName)) {
      return this._registerListeners(eventName as IEvent)
    }

    return this
  }

  protected _registerEvent(identifier: string, handler: IHandler, order?: number) {
    const { events } = this
    const hasOrder = isNumber(order) && (order as number) >= 0
    const [eventName, type = ""] = identifier.split(".")
    if (!isFunction(handler)) {
      return this
    }

    if (!events.has(eventName)) {
      events.set(eventName, [])
    }

    if (hasOrder) {
      const handlers = events.get(eventName) as IEventValue[]
      handlers?.splice(order as number, 0, {
        type,
        handler
      })
      events.set(eventName, handlers)
    } else {
      const handlers = events.get(eventName) as IEventValue[]
      handlers.push({
        type,
        handler
      })
      events.set(eventName, handlers)
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
}

export default EventEmitter
