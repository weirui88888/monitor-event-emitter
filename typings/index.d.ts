type IHandler = (...params: any[]) => any
interface IConfig {
  maxEvents?: number
  scope?: string
  debug?: boolean
}
interface IEventValue {
  type?: string
  handler: Handler
  [key: string]: any
}
interface IEvent {
  [eventName: string]: IEventValue
}
interface IListeners {
  [eventName: string]: {
    handler: Handler
    order?: number
  }
}

export { IConfig, IEvent, IHandler, IEventValue, IListeners }
