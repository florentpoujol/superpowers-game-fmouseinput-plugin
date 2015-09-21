
class EventEmitterComponent extends Sup.ActorComponent {
  emitter = new (<any>window).EventEmitter();

  constructor(actor: Sup.Actor) {
    super(actor);
  }

  destroy() {
    this.emitter.removeAllListeners();
    this.emitter = null;
    super.destroy();
  }
}

(<any>window).EventEmitterComponent = EventEmitterComponent;
