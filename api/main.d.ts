// fMouseInput plugin
// https://github.com/florentpoujol/superpowers-fmouseinput-plugin
// Allows for easy setup of interactions between the mouse and actors

// Documentation:
// http://florentpoujol.github.io/superpowers-fmouseinput-plugin

// You can also access the documentation offline in the plugin's "public/docs" folder 
// or via the "Plugins documentation" tool provided by the "Plugins documentation" plugin: https://github.com/florentpoujol/superpowers-pluginsdocumentation-plugin


// accessible on actors throught the "mouseInput" property
declare class fMouseInput extends Sup.ActorComponent {
  isMouseOver: boolean; 
  ray: Sup.Math.Ray;
  isLayerActive: boolean;
  eventEmitter: EventEmitter;

  constructor(actor: Sup.Actor);

  camera: Sup.Camera;
  cameraActor: Sup.Actor|string;

  update(): void;
  destroy(): void;
}
