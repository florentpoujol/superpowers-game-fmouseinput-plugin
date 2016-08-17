// fMouseInput plugin
// https://github.com/florentpoujol/superpowers-game-fmouseinput-plugin
// Allows for easy setup of interactions between the mouse and actors

declare class fMouseInput extends Sup.ActorComponent {
  constructor(actor: Sup.Actor);

  setCameraActorName(name: string);
  setCameraComponent(camera: Sup.Camera);
  getCameraComponent(): Sup.Camera;
  destroy(): void;
  
  emitter: EventEmitter;
  isMouseOver: boolean;

  static behaviorByEvents: { [event: string]: { functionName: string, buttonId: number } };
}
