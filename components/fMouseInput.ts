/// <reference path="../index.d.ts" />

import { fMouseInputConfigPub } from "../data/fMouseInputConfig";


export class fMouseInputUpdater {
  /**
  * Called when the scene loads
  * initialize engine component from config
  */
  constructor(client: SupClient.ProjectClient, mouseInput: fMouseInput, config: fMouseInputConfigPub, receiveAssetCallbacks: any, editAssetCallbacks: any) {
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
    super(actor, "MouseInputMachin");
    console.log("MouseInput engine constructor", actor);
  }

  awake() {
    console.log("component awake");
  }

  start() {
    console.log("component start");
  } 
  
  update() {
    if (this.outer != null && this.isLayerActive === true && this.actor.threeObject.visible === true)
      this.outer.update();
  }

  // called by superpowers when a layer is (de)actived
  setIsLayerActive(active: boolean) {
    this.isLayerActive = active;
    if (this.outer != null)
      this.outer.isLayerActive = active;
  }

  // may be called by the API instance
  _destroy() {
    this.setIsLayerActive(false);
    this.outer = null;
    super._destroy();
  }


  // called from the API component
  // outer is the component's API instance, of type fMouseInput
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
}
