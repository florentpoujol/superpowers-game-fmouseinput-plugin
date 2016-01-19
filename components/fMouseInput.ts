/// <reference path="../index.d.ts" />

import { fMouseInputConfigPub } from "../componentConfigs/fMouseInputConfig";


export class fMouseInputUpdater {
  /**
  * Called when the scene loads
  * initialize engine component from config
  */
  constructor(client: SupClient.ProjectClient, mouseInput: fMouseInput, config: fMouseInputConfigPub, receiveAssetCallbacks: any, editAssetCallbacks: any) {
    // initialise
    mouseInput.setCameraActorName(config.cameraActorName);
  } 
  destroy() {}
}


export default class fMouseInput extends SupEngine.ActorComponent {

  static Updater = fMouseInputUpdater;

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
  
  update() {
    if (this.outer != null && this.isLayerActive === true && this.actor.threeObject.visible === true)
      this.outer._update();
  }

  // called by Superpowers when a layer is (de)actived
  setIsLayerActive(active: boolean) {
    this.isLayerActive = active;
  }

  // called by the API instance when it is destroyed
  _destroy() {
    this.isLayerActive = false;
    this.outer = null;
    super._destroy();
  }


  // called from the API component on creation
  // outer is the component's API instance, of type fMouseInput
  setOuter(outer: any) {
    if (this.cameraActorName != "")
      outer.camera = this.cameraActorName;
    this.outer = outer;
  }

  // called from the Updater
  setCameraActorName(name: string) {
    this.cameraActorName = name;
    if (this.outer != null)
      this.outer.camera = this.cameraActorName;
  }
}
