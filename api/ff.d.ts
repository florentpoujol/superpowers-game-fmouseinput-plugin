
declare class EventEmitterComponent extends Sup.ActorComponent {
  emitter: EventEmitter;
  constructor(actor: Sup.Actor);
}


declare class MouseInput extends Sup.ActorComponent {
  isMouseOver: boolean; 
  ray: Sup.Math.Ray;
  emitter: EventEmitter;

  constructor(actor: Sup.Actor);

  camera: Sup.Camera;
  setCameraActor(actor: Sup.Actor|string): void;

  update(): void;
  destroy(): void;
}
