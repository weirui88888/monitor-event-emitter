type IHandler = (...params: any[]) => any
interface IConfig {
  maxEvents?: number
  scope?: string
  debug?: boolean
}
interface IEventValue {
  type: string
  handler: IHandler
  id: string
}
interface IListeners {
  [eventName: string]: {
    handler: IHandler
    order?: number
  }
}

interface IMatchHandlers extends Pick<IEventValue, "id" | "type"> {
  handler: IHandler
  eventName: string
}

interface IHandlerDetails {
  count: number
  details: {
    result: any
    time: Date
    args: any[]
  }[]
}

export { IConfig, IHandler, IEventValue, IListeners, IMatchHandlers, IHandlerDetails }
