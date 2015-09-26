// fFramework plugin
// https://github.com/florentpoujol/superpowers-fframework-plugin

// Documentation:
// http://florentpoujol.github.io/superpowers-fframework-plugin

// You can also access the documentation offline in the plugin's "public/docs" folder 
// or via the "Docs browser" tool provided by the "Docs browser" plugin: https://github.com/florentpoujol/superpowers-docs-browser-plugin


declare module f {

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

  // --------------------------------------------------------------------------------

  module Gui {

    let mainDomContainer: HTMLDivElement;

    function addStyle(css: string): HTMLStyleElement;

    class Element {
      constructor(tagName: string, type: string, params?: Params);
      set(params: Params): void;

      domElement: HTMLElement;
      getChildDomElement(className: string): HTMLElement;

      emitter: EventEmitter;
      on(eventName: string, listener: Listener): void;
      removeListener(eventName: string, listener: Listener): void;

      container: Container;
      isDisplayed: boolean;
      id: number; // readonly
      type: string; // readonly
    }

    class Container extends Element {
      constructor(isOpen: boolean, params?: Params);
      constructor(params?: Params);

      static openContainers: Container[];
      isOpen: boolean;
    }

    // ----------------------------------------

    class Text extends Element {
      constructor(label: string, value: any, params?: Params);
      constructor(label: string, params?: Params);
      constructor(params?: Params);

      label: string;
      value: any; // always return string
      url: string;
    }

    class Button extends Element {
      constructor(label: string, value: string, params?: Params);
      constructor(label: string, params?: Params);
      constructor(params?: Params);

      label: string;
      value: string;
    }

    // ----------------------------------------

    class Input extends Element {
      constructor(type: string, label: string, value: any, params?: Params);
      constructor(type: string, label: string, params?: Params);
      constructor(type: string, params?: Params);
      constructor(params?: Params);

      label: string;
      value: any;
    }

    class Checkbox extends Input {
      constructor(label: string, isChecked: boolean, params?: Params);
      constructor(label: string, params?: Params);
      constructor(params?: Params);

      isChecked: string;
    }

    class Radio extends Input {
      constructor(name: string, label: string, isChecked: boolean, params?: Params);
      constructor(name: string, label: string, params?: Params);
      constructor(params?: Params);

      isChecked: string;
      name: string;
    }

    // ----------------------------------------

    interface Params {
      [key:string]: any;
    }

    interface Listener {
      (element: Element, event: any): void; // event is the DOM's Event instance
    }
  }

  // --------------------------------------------------------------------------------

  // accessible on actors throught the "mouseInput" property
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
  
  // --------------------------------------------------------------------------------

  // accessible on actors throught the "event" property
  class EventEmitterComponent extends Sup.ActorComponent {
    emitter: EventEmitter;
    constructor(actor: Sup.Actor);
  }
}
