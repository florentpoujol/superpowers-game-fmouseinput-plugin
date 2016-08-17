/// <reference path="../index.d.ts" />

export class FMouseInputUpdater {
  /**
  * Called when the scene loads
  * initialize engine component from config
  * @param projectClient Of type ProjectClient
  * @param component Of type FMouseInput
  * @param config Of type FMouseInputConfigPub
  */
  constructor(projectClient: any, component: any, config: any) {
    component.setCameraActorName(config.cameraActorName);
  }

  destroy(): void { return; }
}

export default class FMouseInput extends SupEngine.ActorComponent {
  /* tslint:disable:variable-name */
  static Updater = FMouseInputUpdater;
  /* tslint:enable:variable-name */

  cameraActorName: string = "";
  isLayerActive: boolean = true;
  outer: any; // the API instance, of type fMouseInput

  /**
  * Called when the scene loads
  * actor - the scene's actor
  */
  constructor(actor: SupEngine.Actor) {
    super(actor, "fMouseInput");
  }

  update(): void {
    if (this.outer != null && this.isLayerActive === true && this.actor.threeObject.visible === true)
      this.outer._update();
  }

  // called by Superpowers when a layer is (de)actived
  setIsLayerActive(active: boolean): void {
    this.isLayerActive = active;
  }

  // called by the API instance when it is destroyed
  _destroy(): void {
    this.isLayerActive = false;
    this.outer = null;
    super._destroy();
  }

  // called from the API component on creation
  // outer is the component's API instance, of type fMouseInput
  setOuter(outer: any): void {
    if (this.cameraActorName !== "")
      outer.setCameraActorName(this.cameraActorName);
    this.outer = outer;
  }

  // called from the Updater
  setCameraActorName(name: string): void {
    this.cameraActorName = name;
    if (this.outer != null)
      this.outer.setCameraActorName(this.cameraActorName);
  }
}
