///<reference path="../../../../../SupClient/SupClient.d.ts"/>
///<reference path="../../../../../SupCore/SupCore.d.ts"/>
///<reference path="../../../SupEngine/SupEngine.d.ts"/>
///<reference path="../../../SupRuntime/SupRuntime.d.ts"/>

declare class EventEmitter {
  on(event: string, listener: Function): EventEmitter;
  addListener(event: string, listener: Function): EventEmitter;
  once(event: string, listener: Function): EventEmitter;
  
  removeListener(event: string, listener: Function): EventEmitter;
  removeAllListeners(event?: string): EventEmitter;
  
  emit(event: string, ...args: any[]): boolean;

  static defaultMaxListeners: number;
  setMaxListeners(n: number): EventEmitter;
  getMaxListener(): number

  listeners(event: string): Function[];
  listenerCount(event: string): number;  
  static listenerCount(emitter: EventEmitter, event: string): number; // deprecated
}
