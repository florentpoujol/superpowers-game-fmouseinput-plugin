///<reference path="typings/tsd.d.ts"/>
///<reference path="textEditorWidget/widget.d.ts"/>
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

declare module "jsonlint" {}
declare module "cson-parser" {}
declare module "domify" {}
declare module "jade" {}
declare module "stylus" {}
declare module "js-yaml" {}
declare module "markdown" {
  export var markdown: any;
}
