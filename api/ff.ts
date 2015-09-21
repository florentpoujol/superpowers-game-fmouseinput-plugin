
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



/**
* This ocmponent is to be added on the
**/
class MouseInput extends Sup.ActorComponent {

  /**
  * Tell wether the mouse pointer is currently over the actor.
  */
  isMouseOver: boolean = false;
  
  /**
  * The ray used for the intersection check.
  * Set and updated by the component that is on the actor with the camera component.
  */
  ray: Sup.Math.Ray;

  /**
  * The event emitter through which the mouse events are handled.
  */
  emitter: any = new (<any>window).EventEmitter();

  // ----------------------------------------

  /**
  * @param actor - The actor to create the component on.
  * @param camera - The camera component from which 
  */
  constructor(actor: Sup.Actor) {
    super(actor);
    this.actor.mouseInput = this;
    this.__inner = new SupEngine.componentClasses.MouseInput(this.actor.__inner);
    this.__inner.__outer = this;

    // this.emitter = (<any>window).EventEmitter();
    if (actor.camera != null)
      this.ray = new Sup.Math.Ray();
  }

  // ----------------------------------------

  private _camera: Sup.Camera;

  set camera(camera: Sup.Camera) {
    this._camera = camera;

    if (camera.actor.mouseInput == null)
      new MouseInput(camera.actor);

    this.ray = camera.actor.mouseInput.ray;
  }

  get camera(): Sup.Camera {
    return this._camera;
  }

  setCameraActor(actor: Sup.Actor|string) {
    if (typeof actor === "string")
      actor = <Sup.Actor>Sup.getActor(<string>actor);

    if ((<Sup.Actor>actor).camera != null) // asume actor
      this.camera = (<Sup.Actor>actor).camera;
  }

  // ----------------------------------------

  update() {
    if (this.actor.camera != null)
      this.ray.setFromCamera(this.actor.camera, Sup.Input.getMousePosition());
        
    else if (this.ray != null) {  
      let hit = this.ray.intersectActor(this.actor)[0];

      if (hit != null) {
        if(this.isMouseOver === false) {
          this.isMouseOver = true;
          this.emitter.emit("onmouseenter");
        }
      }
      else if (this.isMouseOver === true) {
        this.isMouseOver = false;
        this.emitter.emit("onmouseout");
      }

      if (this.isMouseOver === true) {
        let mouseDelta = Sup.Input.getMouseDelta();
        if (mouseDelta.x !== 0 || mouseDelta.y !== 0)
          this.emitter.emit("onmousemove");

        if (Sup.Input.wasMouseButtonJustReleased(0))
          this.emitter.emit("onclick");

        if (Sup.Input.wasMouseButtonJustReleased(2))
          this.emitter.emit("oncontextmenu");
      }
    }
  }

  destroy() {
    this.__inner._destroy();
    this.__inner = null;
    this.emitter.removeAllListeners();
    this.emitter = null;
    this.isMouseOver = false;
    this.camera = null;
    this.ray = null;
    this.actor.mouseInput = null;
    super.destroy();
  }
}

(<any>window).MouseInput = MouseInput;
