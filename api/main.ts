/// <reference path="../index.d.ts" />
/// <reference path="Sup.d.ts" />

/**
*
*/
class fMouseInput extends Sup.ActorComponent {

  /**
  * Tell wether the mouse pointer is currently over the actor.
  */
  isMouseOver: boolean = false;
  
  /**
  * The ray used for the intersection check.
  * Set and updated by the component that is on the actor with the camera component.
  * On other components, it is set to the ray on the camera component's
  */
  ray: Sup.Math.Ray;

  /**
  * Tell whether the component is active.
  * Usually set by the engine instance's isLayerActive() method
  */
  isLayerActive: boolean = true;

  /**
  * The event emitter on which mouse input events are emitted.
  */
  eventEmitter: any;

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
    
    this.eventEmitter = new window["EventEmitter"]();

    if (actor.camera != null) {
      this._camera = actor.camera;
      this.ray = new Sup.Math.Ray();
    }
  }

  // ----------------------------------------

  private _camera: Sup.Camera;

  /**
  * The camera component.
  */
  set camera(camera: Sup.Camera) {
    this._camera = camera;

    if (camera.actor.fMouseInput == null)
      new fMouseInput(camera.actor);

    this.ray = camera.actor.fMouseInput.ray;
  }

  get camera(): Sup.Camera {
    return this._camera;
  }

  /**
  * Sets the camera's actor or camera's actor's name.
  */
  set cameraActor(actor: Sup.Actor|string) {
    // console.log("api component set cameraActor", actor);
    if (typeof actor === "string") {
      let actorName = <string>actor;
      actor = <Sup.Actor>Sup.getActor(actorName);
      if (actor == null) {
        console.warn("fMouseInput.cameraActor setter: actor with name '"+actorName+"' not found.");
        return;
      }
    }

    if ((<Sup.Actor>actor).camera != null) // asume actor
      this.camera = (<Sup.Actor>actor).camera; // call set camera above
  }

  // ----------------------------------------

  // called by the engine instance
  update(): void {
    if (this.actor.camera != null) // this component is on the same actor as the camera
      this.ray.setFromCamera(this._camera, Sup.Input.getMousePosition());
        
    else if (this.ray != null) { // this component is on an actor to be checked
      let hit = this.ray.intersectActor(this.actor)[0];

      if (hit != null) {
        if(this.isMouseOver === false) {
          this.isMouseOver = true;
          this.eventEmitter.emit("onMouseEnter");
        }
      }
      else if (this.isMouseOver === true) {
        this.isMouseOver = false;
        this.eventEmitter.emit("onMouseExit");
      }

      if (this.isMouseOver === true) {
        let mouseDelta = Sup.Input.getMouseDelta();
        if (mouseDelta.x !== 0 || mouseDelta.y !== 0)
          this.eventEmitter.emit("onMouseMove");

        if (Sup.Input.wasMouseButtonJustReleased(0)) {
          this.eventEmitter.emit("onLeftClick");
          this.eventEmitter.emit("onClick");
        }

        if (Sup.Input.wasMouseButtonJustReleased(2)) {
          this.eventEmitter.emit("onRightClick");
        }
      }
    }
  }

  destroy(): void {
    this.isLayerActive = false;
    this.isMouseOver = false;
    this.camera = null;
    this.ray = null;
    this.actor.fMouseInput = null;
    (<any>this).__inner._destroy();
    (<any>this).__inner = null;
    super.destroy();
  }
}

(<any>window).fMouseInput = fMouseInput;
