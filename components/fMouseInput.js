"use strict";
/// <reference path="../index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
class FMouseInputUpdater {
    /**
    * Called when the scene loads
    * initialize engine component from config
    * @param projectClient Of type ProjectClient
    * @param component Of type FMouseInput
    * @param config Of type FMouseInputConfigPub
    */
    constructor(projectClient, component, config) {
        component.setCameraActorName(config.cameraActorName);
    }
    destroy() { return; }
}
exports.FMouseInputUpdater = FMouseInputUpdater;
class FMouseInput extends SupEngine.ActorComponent {
    /**
    * Called when the scene loads
    * actor - the scene's actor
    */
    constructor(actor) {
        super(actor, "fMouseInput");
        /* tslint:enable:variable-name */
        this.cameraActorName = "";
        this.isLayerActive = true;
    }
    update() {
        if (this.outer != null && this.isLayerActive === true && this.actor.threeObject.visible === true)
            this.outer._update();
    }
    // called by Superpowers when a layer is (de)actived
    setIsLayerActive(active) {
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
    setOuter(outer) {
        if (this.cameraActorName !== "")
            outer.setCameraActorName(this.cameraActorName);
        this.outer = outer;
    }
    // called from the Updater
    setCameraActorName(name) {
        this.cameraActorName = name;
        if (this.outer != null)
            this.outer.setCameraActorName(this.cameraActorName);
    }
}
/* tslint:disable:variable-name */
FMouseInput.Updater = FMouseInputUpdater;
exports.default = FMouseInput;
