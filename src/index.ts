import { IConfig, IEvent } from "../typings"
const defaultEventScope = "EventEmitter"

class EventEmitter {
  public maxEvents: number | null
  public scope: string
  protected version: string
  public events: IEvent
  constructor(config?: IConfig) {
    this.version = "v0.0.1"
    this.maxEvents = config?.maxEvents ? config.maxEvents : null
    this.scope = config?.scope || defaultEventScope
    this.events = {}
  }
}

export default EventEmitter
