import { EventEmitter } from "events";

export default class _EventEmitterComponent extends SupEngine.ActorComponent {
  emitter: EventEmitter = new EventEmitter();

  constructor(actor: SupEngine.Actor) {
    super(actor, "_EventEmitterComponent"); // accessible through the "event" property on the actor
  }

  _destroy() {
    this.emitter.removeAllListeners();
    this.emitter = null;
    super._destroy();
  }
}
