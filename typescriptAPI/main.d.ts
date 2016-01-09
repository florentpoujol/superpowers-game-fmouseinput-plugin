// fMouseInput plugin
// https://github.com/florentpoujol/superpowers-fmouseinput-plugin
// Allows for easy setup of interactions between the mouse and actors

// Documentation:
// http://florentpoujol.github.io/superpowers-fmouseinput-plugin

// You can also access the documentation offline in the plugin's "public/docs" folder 
// or via the "Plugins documentation" tool provided by the "Plugins documentation" plugin: https://github.com/florentpoujol/superpowers-pluginsdocumentation-plugin

// accessible on actors throught the "fMouseInput" property
declare class fMouseInput extends Sup.ActorComponent {
  isMouseOver: boolean; 
  emitter: EventEmitter;
  camera: Sup.Camera|Sup.Actor|string; // actually always return a Sup.Camera instance

  constructor(actor: Sup.Actor);
  update(): void;
  destroy(): void;
}
