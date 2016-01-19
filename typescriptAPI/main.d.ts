// fMouseInput plugin
// https://github.com/florentpoujol/superpowers-game-fmouseinput-plugin
// Allows for easy setup of interactions between the mouse and actors

// Documentation:
// http://florentpoujol.github.io/superpowers-game-fmouseinput-plugin

// You can also access the documentation offline in the plugin's "public/docs" folder 
// or via the "Plugins documentation" tool provided by the "Plugins documentation" plugin: https://github.com/florentpoujol/superpowers-common-pluginsdocs-plugin

// accessible on actors throught the "fMouseInput" property
declare class fMouseInput extends Sup.ActorComponent {
  constructor(actor: Sup.Actor);

  camera: Sup.Camera|Sup.Actor|string; // actually always return a Sup.Camera instance
  
  emitter: EventEmitter;
  on(event: string, listener: Function): EventEmitter;
  off(event: string, listener: Function): EventEmitter;

  static eventsData: { [event: string]: { functionName: string, buttonId: number } };
  isMouseOver: boolean; 

  destroy(): void;
}
