type IHandler = (...params: any[]) => any

declare const enum Mode {
  "default" = "default",
  "cool" = "cool"
}

declare const enum HandlerType {
  "async" = "async",
  "sync" = "sync"
}

type ModeType = keyof typeof Mode

interface IConfig {
  maxEvents?: number
  maxHandlers?: number
  scope?: string
  debug?: boolean
  mode?: ModeType
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

interface IHandlerDetails<T = any[]> {
  count: number
  details: {
    result: any
    time: Date
    args: T
    handlerType: keyof typeof HandlerType
  }[]
}

declare const enum SuggestionTips {
  EVENT_TYPE_WARN = "event type should be provided as string",
  TYPE_TYPE_WARN = "param type should be provided as string",
  NO_EVENT_HANDLER_TIP = "the number of handlers with event name ",
  ON_METHOD_EVENT_TYPE_WARN = "param event should provided with type string or object",
  HANDLER_TYPE_WARN = "handler type should be provided as function",
  EVENT_WITH_TYPE_ONLY_TIP = "when you're ready to register an event handler, it's best to provide an event name. such as download.privilege",
  EMIT_METHOD_EVENT_TYPE_WARN = "event type should be string, such as 'download.pic' or 'download.pic pay' or 'download.pic pay.privilege'",
  NO_EVENT_TIP = "no events are registered in the event center",
  NO_TYPE_HANDLER_TIP = "no handlers are registered in the event center with type ",
  OFF_METHOD_EVENT_TYPE_WARN = "event type should be string, such as 'download.pic' or 'download.pic pay' or 'download.pic pay.privilege'",
  OFFTYPE_METHOD_TYPE_WARN = "param type should be provided as string",
  REGISTER_EXCEEDED_WARN = "the number of events or handlers has exceeded the limit",
  NO_HANDLER_TIP = "no handlers found based on your input ",
  WATCH_MODE_WARN = 'param type should be provided as "cool" or "default"'
}

export {
  IHandler,
  IConfig,
  IEventValue,
  IListeners,
  IMatchHandlers,
  IHandlerDetails,
  SuggestionTips,
  Mode,
  ModeType,
  HandlerType
}
