interface IConfig {
  maxEvents?: number
  scope?: string
}

interface IEventValue {
  className: string
  handler(...args: any[]): any
}

interface IEvent {
  [eventName: string]: IEventValue[]
}

export { IConfig, IEvent }
