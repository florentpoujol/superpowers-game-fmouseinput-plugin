// fFramework plugin
// https://github.com/florentpoujol/superpowers-fframework-plugin

// Documentation:
// http://florentpoujol.github.io/superpowers-fframework-plugin

// You can also access the documentation offline in the plugin's "public/docs" folder 
// or via the "Docs browser" tool provided by the "Docs browser" plugin: https://github.com/florentpoujol/superpowers-docs-browser-plugin


declare module f {

  class MouseInput extends Sup.ActorComponent {
    isMouseOver: boolean; 
    ray: Sup.Math.Ray;
    emitter: EventEmitter;

    constructor(actor: Sup.Actor);

    camera: Sup.Camera;
    setCameraActor(actor: Sup.Actor|string): void;

    update(): void;
    destroy(): void;
  }

  module Lang {
    interface Config {
      locales: string[];
      defaultLocale: string;
      currentLocale: string;
      searchInDefaultLocale: boolean;
      replacementPattern: string;
      cache: boolean;
    }
    
    var config: Config;
    var emitter: EventEmitter;
    var cache: any; // { [key:string]: string }
    var dictionariesByLocale: any; // { [key:string]: Object }
    
    function get(key: string, replacements?: { [key:string]: string }): string;
    function update(newCurrentLocale: string);
    function onUpdate(listener: (locale: string)=>void, removeListener?: boolean); // default = false
  }

  class EventEmitterComponent extends Sup.ActorComponent {
    emitter: EventEmitter;
    constructor(actor: Sup.Actor);
  }
}
