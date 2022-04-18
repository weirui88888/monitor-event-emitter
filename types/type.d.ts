declare type IHandler = (...params: any[]) => any;
interface IConfig {
    maxEvents?: number;
    scope?: string;
    debug?: boolean;
}
interface IEventValue {
    type: string;
    handler: IHandler;
    id: string;
}
interface IListeners {
    [eventName: string]: {
        handler: IHandler;
        order?: number;
    };
}
interface IMatchHandlers extends Pick<IEventValue, "id" | "type"> {
    handler: IHandler;
    eventName: string;
}
interface IHandlerDetails {
    count: number;
    details: {
        result: any;
        time: Date;
        args: any[];
    }[];
}
declare const enum SuggestionTips {
    EVENT_TYPE_WARN = "event type should be provided as string",
    TYPE_TYPE_WARN = "param type should be provided as string",
    NO_EVENT_HANDLER_TIP = "the number of handlers with event name",
    ON_METHOD_EVENT_TYPE_WARN = "param event should provided with type string or object",
    HANDLER_TYPE_WARN = "handler type should be provided as function",
    EVENT_WITH_TYPE_ONLY_TIP = "when you're ready to register an event handler, it's best to provide an event name.such as download.privilege",
    EMIT_METHOD_EVENT_TYPE_WARN = "event type show be string,such as 'download.pic' or 'download.pic pay' or 'download.pic pay.privilege'",
    NO_EVENT_TIP = "no events are registered in the event center",
    OFF_METHOD_EVENT_TYPE_WARN = "event type show be string,such as 'download.pic' or 'download.pic pay' or 'download.pic pay.privilege'",
    OFFTYPE_METHOD_TYPE_WARN = "param type should be provided as string"
}
export { IConfig, IHandler, IEventValue, IListeners, IMatchHandlers, IHandlerDetails, SuggestionTips };
