/// <reference path="../index.d.ts" />
/// <reference path="Sup.d.ts" />


class fMouseInput extends Sup.ActorComponent {

  /**
  * Tell wether the mouse pointer is currently over the actor.
  */
  isMouseOver: boolean = false;
  
  /**
  * The event emitter on which mouse input events are emitted.
  */
  emitter: any; // can't define as EventEmitter here...

  /**
  * The ray used for the intersection check.
  * Set and updated by the component that is on the actor with the camera component.
  * On other components, it is set to the ray on the camera component's
  */
  private _ray: Sup.Math.Ray;

  // ----------------------------------------

  /**
  * @param actor - The actor to create the component on.
  */
  constructor(actor: Sup.Actor) {
    super(actor);
    this.actor.fMouseInput = this;

    this["__inner"] = new SupEngine.componentClasses["fMouseInput"](this.actor["__inner"]);
    this["__inner"].setOuter(this);
    // __inner is the component instance on the engine side (of type "MouseInput extends SupEngine.ActorComponent").
    
    this.emitter = new window["EventEmitter"]();

    if (actor.camera != null) {
      this._camera = actor.camera;
      this._ray = new Sup.Math.Ray();
    }
  }

  // ----------------------------------------

  private _camera: Sup.Camera;

  /**
  * The camera component.
  */
  set camera(camera: Sup.Camera|Sup.Actor|string) {
    let actor: Sup.Actor;
    if (typeof camera === "string") {
      let actorName = <string>camera;
      actor = <Sup.Actor>Sup.getActor(actorName);
      if (actor == null) {
        console.error("fMouseInput.camera2 setter: actor with name '"+actorName+"' not found.");
        return;
      }
    }
    else {
      if (camera["camera"] != null) { // suppose actor
        actor = <Sup.Actor>camera;
      }
      else if (camera["actor"] != null) // suppose camera component
        actor = <Sup.Actor>camera["actor"];
      else {
        // unlikely to happend but better be safe !
        console.error("fMouseInput.camera setter: unable to do anything with the value.", camera);
        return;
      }
    }

    if (actor.camera == null) {
      console.error("fMouseInput.camera2 setter: actor with name '"+actor.getName()+"' has no Camera component.");
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

  // called by the engine instance
  update(): void {
    if (this.actor.camera != null) // this component is on the same actor as the camera
      this._ray.setFromCamera(this._camera, Sup.Input.getMousePosition());
        
    else if (this._ray != null) { // this component is on an actor to be checked
      let hit = this._ray.intersectActor(this.actor)[0];

      if (hit != null) {
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
        let mouseDelta = Sup.Input.getMouseDelta();
        if (mouseDelta.x !== 0 || mouseDelta.y !== 0)
          this.emitter.emit("mouseMove");

        if (Sup.Input.wasMouseButtonJustReleased(0)) {
          this.emitter.emit("leftClick");
        }

        else if (Sup.Input.wasMouseButtonJustReleased(1)) {
          this.emitter.emit("middleClick");
        }

        else if (Sup.Input.wasMouseButtonJustReleased(2)) {
          this.emitter.emit("rightClick");
        }
        
        else if (Sup.Input.wasMouseButtonJustReleased(5)) {
          this.emitter.emit("wheelUp");
        }

        else if (Sup.Input.wasMouseButtonJustReleased(6)) {
          this.emitter.emit("wheelDown");
        }
      }
    }
  }

  destroy(): void {
    this.isMouseOver = false;
    this.camera = null;
    this["_ray"] = null;
    this.actor.fMouseInput = null;
    this["__inner"]._destroy();
    this["__inner"] = null;
    super.destroy();
  }
}

(<any>window).fMouseInput = fMouseInput;
