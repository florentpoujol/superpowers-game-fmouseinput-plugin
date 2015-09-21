
declare class EventEmitterComponent extends Sup.ActorComponent {
  emitter: EventEmitter;
  constructor(actor: Sup.Actor);
}


declare class MouseInput extends Sup.ActorComponent {

  isMouseOver: boolean; 
  ray: Sup.Math.Ray;
  mousePosition: { x: number, y: number };
  mouseDelta: { x: number, y: number };
  emitter: EventEmitter;

  constructor(actor: Sup.Actor);

  camera: Sup.Camera;
  setCameraActor(actor: Sup.Actor|string): void;

  update(): void;
  destroy(): void;
}
