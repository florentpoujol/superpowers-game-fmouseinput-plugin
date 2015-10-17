///<reference path="../../app/typings/tsd.d.ts"/>
///<reference path="../../app/SupAPI/SupAPI.d.ts"/>
///<reference path="../../app/SupClient/SupClient.d.ts"/>
///<reference path="../../app/SupCore/SupCore.d.ts"/>
///<reference path="../../app/system/SupEngine/SupEngine.d.ts"/>
///<reference path="../../app/system/SupRuntime/SupRuntime.d.ts"/>

declare class EventEmitter {
  static listenerCount(emitter: EventEmitter, event: string): number;

  addListener(event: string, listener: Function): EventEmitter;
  on(event: string, listener: Function): EventEmitter;
  once(event: string, listener: Function): EventEmitter;
  removeListener(event: string, listener: Function): EventEmitter;
  removeAllListeners(event?: string): EventEmitter;
  setMaxListeners(n: number): void;
  listeners(event: string): Function[];
  emit(event: string, ...args: any[]): boolean;
}
