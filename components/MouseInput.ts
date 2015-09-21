let THREE = SupEngine.THREE;

export default class MouseInput extends SupEngine.ActorComponent {

  /**
  * Tell wether the mouse pointer is currently over the actor.
  */
  isMouseOver: boolean = false;
  
  /**
  * The ray used for the intersection check.
  * Set and updated by the component that is on the actor with the camera component.
  */
  ray: THREE.Ray;
  
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
  * @param actor - The actor to create the component on.
  * @param camera - The camera component from which 
  */
  constructor(actor: SupEngine.Actor) {
    super(actor, "MouseInput");

    if (actor.camera != null) {
      this.ray = new Sup.Math.Ray();
    }
    else {
      
      if (this.actor.event == null) {
        this.actor.event = new EventEmitterComponent(this.actor);
      }
    }
  }


  private _camera: Sup.Camera;

  set camera(camera: Sup.Camera) {
    if (camera.actor.mouseInput == null)
      this.actor.mouseInput = new MouseInput(camera.actor);

    this.ray = camera.mouseInput.ray;
    this._camera = camera;
  }

  get camera(): Sup.Camera {
    return this._camera;
  }


  update() {
    if (this.actor.camera != null) {
      this.mousePosition = Sup.Input.getMousePosition();
      this.mouseDelta = Sup.Input.getMouseDelta();
      this.ray.setFromCamera(this._camera, this.mousePosition);
    }
    
    else if (this.ray != null) {  
      let hit = this.ray.intersectActor(this.actor)[0];
      
      if (hit != null) {
        if(this.isMouseOver === false) {
          this.isMouseOver = true;
          this.actor.event.emitter.emit("onmouseenter");
        }
      }
      else if (this.isMouseOver === true) {
        this.isMouseOver = false;
        this.actor.event.emitter.emit("onmouseout");
      }

      if (this.isMouseOver === true) {
        if (this.mouseDelta.x !== 0 || this.mouseDelta.y !== 0)
          this.actor.event.emitter.emit("onmousemove");

        if (Sup.Input.wasMouseButtonJustReleased(0))
          this.actor.event.emitter.emit("onclick");

        if (Sup.Input.wasMouseButtonJustReleased(2))
          this.actor.event.emitter.emit("oncontextmenu");
      }
    }
  }
}


