// fLib plugin
// https://github.com/florentpoujol/superpowers-flib-plugin

// Documentation:
// http://florentpoujol.github.io/superpowers-flib-plugin

// You can also access the documentation offline in the plugin's "public/docs" folder 
// or via the "Docs browser" tool provided by the "Docs browser" plugin: https://github.com/florentpoujol/superpowers-docs-browser-plugin

declare module f {

  // accessible on actors throught the "mouseInput" property
  class MouseInput extends Sup.ActorComponent {
    isMouseOver: boolean; 
    ray: Sup.Math.Ray;
    isLayerActive: boolean;

    constructor(actor: Sup.Actor);

    camera: Sup.Camera;
    cameraActor: Sup.Actor|string;

    update(): void;
    destroy(): void;
  }
}
