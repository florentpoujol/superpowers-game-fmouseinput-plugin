
export class MouseInputUpdater {
  /**
  * Called when the scene loads
  * initialize engine component from config
  */
  constructor(client: SupClient.ProjectClient, mouseInput: MouseInput, config: any, receiveAssetCallbacks: any, editAssetCallbacks: any) {
    console.log("MouseInputUpdater constructor", mouseInput, config);

    // initialise
    mouseInput.setCameraActorName(config.cameraActorName);
  } 
  destroy() {}

  // not mandatory
  config_setProperty(path: string, value: any) {
    console.log("MouseInputUpdater config_setProperty", path, value);
    switch (path) {
    }
  }
}

export default class MouseInput extends SupEngine.ActorComponent {

  static Updater = MouseInputUpdater;

  cameraActorName: string = "";
  isLayerActive: boolean = true;
  outer: any; // API instance, typeof f.MouseInput


  /**
  * Called when the scene loads
  * actor the the scene's actor
  */
  constructor(actor: SupEngine.Actor) {
    super(actor, "MouseInputMachin");
    console.log("MouseInput engine constructor", actor);
  }

  awake() {
    console.log("component awake");
  }

  start() {
    console.log("component start");
  }

  // called from the API component
  // outer is the component's API instance
  setOuter(outer: any) {
    if (this.cameraActorName != "")
      outer.cameraActor = this.cameraActorName;
    outer.isLayerActive = this.isLayerActive;
    this.outer = outer;
  }

  // called from the Updater
  setCameraActorName(name: string) {
    this.cameraActorName = name;
    console.log("MouseInput engine setCameraActorName", name, this.outer);
    if (this.outer != null)
      this.outer.cameraActor = this.cameraActorName;
  }
  
  update() {
    if (this.outer != null && this.isLayerActive === true)
      this.outer.update();
  }

  setIsLayerActive(active: boolean) {
    this.isLayerActive = active;
    if (this.outer != null)
      this.outer.isActive = active;
  }

  _destroy() {
    this.setIsLayerActive(false);
    this.outer = null;
    super._destroy();
  }
}
