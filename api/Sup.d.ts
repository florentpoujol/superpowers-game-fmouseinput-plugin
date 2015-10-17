declare module Sup {
  function getActor(name: string): Actor;

  class Asset {}

  class ActorComponent {
    constructor(actor: Actor);
    actor: Actor;
    destroy(): void;
  }
 
  module Math {
    class Ray {
      setFromCamera(camera: Sup.Camera, mousePosition: { x: number, y: number });
      intersectActor(actor: Sup.Actor);
    }
  }

  class Actor {
    eventEmitter: EventEmitter;
    mouseInput: f.MouseInput;
    camera: Camera;
  }

  class Camera extends ActorComponent {
  }

  module Input {
    function wasMouseButtonJustReleased(key: number): boolean;
    function getMousePosition(): { x: number, y: number };
    function getMouseDelta(): { x: number, y: number };
  }
}
