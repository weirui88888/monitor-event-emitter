import { IConfig, IHandler, IEventValue, IListeners, IMatchHandlers, IHandlerDetails } from "./type";
/**
 * @description 事件处理器
 * @class EventEmitter
 */
declare class EventEmitter {
    maxEvents: number | null;
    scope: string;
    events: Map<string, IEventValue[]>;
    eventEmitterWatcher: Map<string, IHandlerDetails>;
    protected debug: boolean;
    static version: string;
    constructor(config?: IConfig);
    /**
     * @description 获取当前已注册的事件
     * @readonly
     * @memberof EventEmitter
     */
    get eventKeys(): IterableIterator<string>;
    /**
     * @description 获取当前注册的事件数量，注册事件的数量并不等于处理器的数量，一个事件可能对应多个处理器
     * @readonly
     * @memberof EventEmitter
     */
    get countOfEvents(): number;
    /**
     * @description 获取处理器数量
     * @readonly
     * @memberof EventEmitter
     */
    get countOfAllHandlers(): number;
    /**
     * @description 获取事件名为event的处理器数量
     * @param {string} event
     * @returns {*}
     * @memberof EventEmitter
     */
    countOfEventHandlers(event: string): number;
    /**
     * @description 获取类型为type的处理器数量
     * @param {string} type
     * @returns {*}
     * @memberof EventEmitter
     */
    countOfTypeHandlers(type: string): number;
    on(event: string | IListeners, handler?: IHandler, order?: number): this | undefined;
    protected _registerEvent(identifier: string, handler: IHandler, order?: number): this;
    protected _registerListener(listener: string, handler: IHandler, order?: number): this;
    protected _registerListeners(listeners: IListeners): this;
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
    emit(event: string, ...args: any[]): this;
    /**
     * @description 清除所有的事件处理器
     * @returns {*}
     * @memberof EventEmitter
     */
    offAll(): void;
    /**
     * @description 清除事件处理器
     * @param {string} event
     * @returns {*}
     * @memberof EventEmitter
     */
    off(event: string): this;
    protected _off(eventName: string, type: string): this;
    /**
     * @description 删除类型为type的事件处理器
     * @param {string} type
     * @returns {*}
     * @memberof EventEmitter
     */
    offType(type: string): this;
    protected _deleteInvalidEvent(): void;
    /**
     * @description 以事件类型触发注册的事件
     * @param {string} type
     * @example emitType('font') 将会触发所有类型为font的事件，不区分时间名称
     * @param {...any[]} args
     * @return {*}
     * @memberof EventEmitter
     */
    emitType(type: string, ...args: any[]): this;
    protected _emit(event: string, ...args: any[]): void;
    protected _matchHandlers(eventName: string, type: string): IMatchHandlers[];
    protected _uuid(): string;
    protected _setWatcher(eventName: string, type: string, id: string, result: any, ...args: any[]): void;
    watch(): Map<string, IHandlerDetails>;
}
export default EventEmitter;
