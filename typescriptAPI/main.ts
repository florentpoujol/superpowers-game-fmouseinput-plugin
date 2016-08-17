/// <reference path="../index.d.ts" />
/// <reference path="Sup.d.ts" />

class fMouseInput extends Sup.ActorComponent {

  /**
  * @param actor - The API actor to create the component on.
  */
  constructor(actor: Sup.Actor) {
    super(actor);
    this.actor.fMouseInput = this;

    this["__inner"] = new SupEngine.componentClasses["fMouseInput"](this.actor["__inner"]);
    this["__inner"].setOuter(this);
    // __inner is the component instance on the engine side (of type "MouseInput extends SupEngine.ActorComponent").
    
    this.emitter = new window["EventEmitter"]();
    this.emitter.on("newListener", this._onNewListener);
    this.emitter.on("removeListener", this._onRemoveListener);

    if (actor.camera != null) {
      this._camera = actor.camera;
      this._ray = new Sup.Math.Ray();
    }
  }

  // ----------------------------------------

  /**
  * The ray used for the intersection check.
  * Set and updated by the component that is on the actor with the camera component.
  * On other components, it is set to the ray on the camera component's
  */
  private _ray: Sup.Math.Ray;

  private _camera: Sup.Camera;

  // only called by the Engine conmponent
  setCameraActorName(name: string): void {
    const actor: Sup.Actor = Sup.getActor(name);
    
    if (actor == null) {
      console.error("fMouseInput.setCameraActorName(): actor with name '"+name+"' isn't found.");
      return;
    }
    
    if (actor.camera == null) {
      console.error("fMouseInput.setCameraActorName(): actor with name '"+name+"' has no Camera component.");
      return;
    }
    
    this.setCameraComponent(actor.camera);
  }

  /**
  * The camera component the actor should be visible from.
  */
  setCameraComponent(camera: Sup.Camera): void {
    let actor: Sup.Actor = camera.actor;

    if (actor == null) { // unlikely to happend but better be safe
      console.error("fMouseInput.setCameraComponent(): the parameter's value does not appear to be an actor component.", camera);
      return;
    }

    this._camera = actor.camera;

    if (actor.fMouseInput == null)
      new fMouseInput(actor);

    this._ray = actor.fMouseInput["_ray"];
  }

  getCameraComponent(): Sup.Camera {
    return this._camera;
  };

  // ----------------------------------------

  /**
  * The event emitter on which mouse input events are emitted (of type EventEmitter).
  */
  emitter: any; // can't define as EventEmitter here...

  /**
  * The list of event name's listened to (except the mouse events)
  */
  private _eventsListenedTo = new Array<string>();

  /**
  * Tell whether the `mouseMove` event has listeners and should be emitted.
  */
  private _emitMouseMove = false;

  /**
  * Listener for the `newListener` event.
  * @param event The event name.
  * @param listener The listener function.
  */
  private _onNewListener = (event: string, listener: Function) => { // set as an arrow function so that 'this' stays the component
    if (this._eventsListenedTo.indexOf(event) === -1) {
      this._eventsListenedTo.push(event);
      
      if (event === "mouseMove")
        this._emitMouseMove = true;
      else if (
        event !== "mouseEnter" && event !== "mouseExit" 
        && event !== "newListener" && event !== "removeListener"
        && fMouseInput.behaviorByEvents[event] == null
      )
        console.error(`fMouseInput: You listen to the '${event}' event on the actor named '${this.actor.getName()}' but there is no data for such event. Make sure you didn't made a typo, or add the corresponding data to the 'fMouseInput.behaviorByEvents' object.`);
    }
  };

  /**
  * Listener for the `removeListener` event.
  * @param event The event name.
  * @param listener The listener function.
  */
  private _onRemoveListener = (event: string, listener: Function) => {
    // the removeListener event is emitted AFTER a listener has been removed
    if (this.emitter.listeners(event).length === 0) {
      // there is no more listener for that event
      const id = this._eventsListenedTo.indexOf(event);
      if (id >= -1) {
        this._eventsListenedTo.splice(id, 1);
        
        if (event === "mouseMove")
          this._emitMouseMove = false;
      }
    }
  };

  // ----------------------------------------

  /**
  * Tell which Sup.Input method and button id to check for each events.
  */
  static behaviorByEvents: { [event: string]: { functionName: string, buttonId: number } } = {
    leftClickPressed: { functionName: "wasMouseButtonJustPressed", buttonId: 0 },
    leftClickDown: { functionName: "isMouseButtonDown", buttonId: 0 },
    leftClickReleased: { functionName: "wasMouseButtonJustReleased", buttonId: 0 },

    middleClickPressed: { functionName: "wasMouseButtonJustPressed", buttonId: 1 },
    middleClickDown: { functionName: "isMouseButtonDown", buttonId: 1 },
    middleClickReleased: { functionName: "wasMouseButtonJustReleased", buttonId: 1 },

    rightClickPressed: { functionName: "wasMouseButtonJustPressed", buttonId: 2 },
    rightClickDown: { functionName: "isMouseButtonDown", buttonId: 2 },
    rightClickReleased: { functionName: "wasMouseButtonJustReleased", buttonId: 2 },

    wheelUp: { functionName: "isMouseButtonDown", buttonId: 5 },
    wheelDown: { functionName: "isMouseButtonDown", buttonId: 6 }
  };

  /**
  * Tell wether the mouse pointer is currently over the actor.
  */
  isMouseOver: boolean = false;

  // called by the engine instance
  private _update(): void {
    if (this.actor.camera != null) // this component is on the same actor as the camera
      this._ray.setFromCamera(this._camera, Sup.Input.getMousePosition());
        
    else if (this._ray != null && this._eventsListenedTo.length > 0) { // this component is on an actor to be checked
      const hit = this._ray.intersectActor(this.actor)[0];

      if (hit != null) { // the mouse is hover the actor's renderer this frame
        if(this.isMouseOver === false) {
          this.isMouseOver = true;
          this.emitter.emit("mouseEnter");
        }
      }
      else if (this.isMouseOver === true) {
        this.isMouseOver = false;
        this.emitter.emit("mouseExit");
      }

      if (this.isMouseOver === true) {
        if (this._emitMouseMove === true) {
          const mouseDelta = Sup.Input.getMouseDelta();
          if (mouseDelta.x !== 0 || mouseDelta.y !== 0)
            this.emitter.emit("mouseMove", mouseDelta);
        }

        for (const event of this._eventsListenedTo) {
          const behavior = fMouseInput.behaviorByEvents[event];
          if (behavior != null && Sup.Input[behavior.functionName](behavior.buttonId) === true)
            this.emitter.emit(event);
        }
      }
    }
  }

  destroy(): void {
    this._camera = null;
    this._ray = null;
    this._eventsListenedTo = null;
    this._emitMouseMove = false;
    this.isMouseOver = false;
    this.emitter.removeAllListeners();
    this["__inner"]._destroy();
    this["__inner"] = null;
    this.actor.fMouseInput = null;
    super.destroy();
  }
}

window["fMouseInput"] = fMouseInput;
