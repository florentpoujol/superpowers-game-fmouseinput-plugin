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

  /**
  * The camera component the actor should be visible from.
  */
  set camera(camera: Sup.Camera|Sup.Actor|string) {
    let actor: Sup.Actor;
    if (typeof camera === "string") {
      const actorName = (camera as string);
      actor = (Sup.getActor(actorName) as Sup.Actor);
      if (actor == null) {
        console.error("fMouseInput.camera setter: actor with name '"+actorName+"' not found.");
        return;
      }
    }
    else {
      if (camera["camera"] != null) { // suppose actor
        actor = (camera as Sup.Actor);
      }
      else if (camera["actor"] != null) // suppose camera component
        actor = (camera["actor"] as Sup.Actor);
      else {
        // unlikely to happend but better be safe !
        console.error("fMouseInput.camera setter: unable to do anything with the value.", camera);
        return;
      }
    }

    if (actor.camera == null) {
      console.error("fMouseInput.camera setter: actor with name '"+actor.getName()+"' has no Camera component.");
      return;
    }

    this._camera = actor.camera;
    
    if (actor.fMouseInput == null)
      new fMouseInput(actor);

    this._ray = actor.fMouseInput["_ray"];
  }

  get camera(): Sup.Camera|Sup.Actor|string {
    return this._camera; // actually always return a Sup.Camera instance
  }

  // ----------------------------------------

  /**
  * The event emitter on which mouse input events are emitted.
  */
  emitter: any; // can't define as EventEmitter here...

  /**
  * Adds the `listener` function for the specified `event`.
  * @param event The event name.
  * @param listener The listener function.
  * @return The event emitter so that calls can be chained.
  */
  on(event: string, listener: Function) {
    return this.emitter.on(event, listener);
  }

  /**
  * Removes the `listener` function for the specified `event`.
  * @param event The event name.
  * @param listener The listener function.
  * @return The event emitter so that calls can be chained.
  */
  off(event: string, listener: Function) {
    return this.emitter.removeListener(event, listener);
  }

  // ----------------------------------------
  
  /**
  * The list of event name's listened to.
  */
  private _events = new Array<string>();

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
    if (this._events.indexOf(event) === -1) {
      this._events.push(event);
      
      if (event === "mouseMove")
        this._emitMouseMove = true;
      else if (
        event !== "mouseEnter" && event !== "mouseExit" 
        && event !== "newListener" && event !== "removeListener"
        && fMouseInput.eventsData[event] == null
      )
        console.error(`fMouseInput: You listen to the '${event}' event on the actor named '${this.actor.getName()}' but there is no data for such event. Make sure you didn't made a typo, or add the corresponding data to the 'fMouseInput.eventsData' object.`);
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
      const id = this._events.indexOf(event);
      if (id >= -1) {
        this._events.splice(id, 1);
        
        if (event === "mouseMove")
          this._emitMouseMove = false;
      }
    }
  };

  // ----------------------------------------

  /**
  * Tell which Sup.Input method and button id check for each events.
  */
  static eventsData: { [event: string]: { functionName: string, buttonId: number } } = {

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
        
    else if (this._ray != null && this._events.length > 0) { // this component is on an actor to be checked
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

        for (const event of this._events) {
          const data = fMouseInput.eventsData[event];
          if (data != null && Sup.Input[data.functionName](data.buttonId) === true)
            this.emitter.emit(event);
        }
      }
    }
  }

  destroy(): void {
    this.isMouseOver = false;
    this.camera = null;
    this._emitMouseMove = false;
    this.emitter.removeAllListeners();
    this._events = null;
    this["_ray"] = null;
    this["__inner"]._destroy();
    this["__inner"] = null;
    this.actor.fMouseInput = null;
    super.destroy();
  }
}

window["fMouseInput"] = fMouseInput;
