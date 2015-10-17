
export class MouseInputUpdater {
  constructor(client: SupClient.ProjectClient, mouseInput: MouseInput, config: any, receiveAssetCallbacks: any, editAssetCallbacks: any) {
    mouseInput.cameraActorName = config.cameraActorName;
  } 
  destroy() {}
}

export default class MouseInput extends SupEngine.ActorComponent {

  static Updater = MouseInputUpdater;

  cameraActorName: string = "";
  isLayerActive: boolean = true;
  outer: any; // API instance, typeof f.MouseInput

  constructor(actor: SupEngine.Actor) {
    super(actor, "MouseInput");
  }

  // called from the API component
  // outer is the component's API instance
  setOuter(outer: any) {
    outer.cameraActor = this.cameraActorName;
    outer.isLayerActive = this.isLayerActive;
    this.outer = outer;
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
