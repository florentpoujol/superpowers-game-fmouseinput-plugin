"use strict";
/// <reference path="../../../default/scene/ComponentConfig.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
class FMouseInputConfig extends SupCore.Data.Base.ComponentConfig {
    /**
    * Called when the serveur loads, the scene loads
    * pub is the loaded config, the call to super sets this.pub (and probably checks it agains schema)
    */
    constructor(pub) {
        super(pub, FMouseInputConfig.schema);
    }
    static create() {
        let emptyConfig = {
            cameraActorName: ""
        };
        return emptyConfig;
    }
}
FMouseInputConfig.schema = {
    cameraActorName: { type: "string?", min: 0, mutable: true },
};
exports.default = FMouseInputConfig;
