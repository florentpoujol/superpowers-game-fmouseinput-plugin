/// <reference path="../../../default/scene/ComponentConfig.d.ts" />

export interface FMouseInputConfigPub {
  cameraActorName: string;
}

export default class FMouseInputConfig extends SupCore.Data.Base.ComponentConfig {

  static schema: SupCore.Data.Schema = {
    cameraActorName: { type: "string?", min: 0, mutable: true },
  };

  static create() {
    let emptyConfig: FMouseInputConfigPub = {
      cameraActorName: ""
    };
    return emptyConfig;
  }

  pub: FMouseInputConfigPub;

  /**
  * Called when the serveur loads, the scene loads
  * pub is the loaded config, the call to super sets this.pub (and probably checks it agains schema)
  */
  constructor(pub: FMouseInputConfigPub) {
    super(pub, FMouseInputConfig.schema);
  }
}
