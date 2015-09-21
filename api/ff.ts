
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
  * The normalized mouse position.
  * Each property is and between -1 (left/bottom) and 1 (right/up).
  */
  mousePosition: { x: number, y: number } = { x: 0, y: 0 };

  /**
  * The normalized mouse delta since the last frame.
  * Each property is and between -1 (move toward left/bottom) and 1 (move toward right/up).
  */
  mouseDelta: { x: number, y: number } = { x: 0, y: 0 };

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
    if (this.actor.camera != null) {
      this.mousePosition = Sup.Input.getMousePosition();
      this.mouseDelta = Sup.Input.getMouseDelta();
      this.ray.setFromCamera(this.actor.camera, this.mousePosition);
    }
    
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
        if (this.mouseDelta.x !== 0 || this.mouseDelta.y !== 0)
          this.emitter.emit("onmousemove");

        if (Sup.Input.wasMouseButtonJustReleased(0))
          this.emitter.emit("onclick");

        if (Sup.Input.wasMouseButtonJustReleased(2))
          this.emitter.emit("oncontextmenu");
      }
    }
  }

  destroy() {
    this.isMouseOver = false;
    this.emitter.removeAllListeners();
    this.emitter = null;
    this.camera = null;
    this.ray = null;
    this.actor.mouseInput = null;
    super.destroy();
  }
}

(<any>window).MouseInput = MouseInput;
