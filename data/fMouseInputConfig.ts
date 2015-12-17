
export interface fMouseInputConfigPub {
  cameraActorName: string;
}

export default class fMouseInputConfig extends SupCore.Data.Base.ComponentConfig {

  static schema = {
    cameraActorName: { type: "string?", min: 0, mutable: true },
  }

  static create() {
    let emptyConfig: fMouseInputConfigPub = {
      cameraActorName: ""
    };
    return emptyConfig;
  }
  
  pub: fMouseInputConfigPub;

  /**
  * Called when the serveur loads, the scene loads
  * pub is the loaded config, the call to super sets this.pub (and probably checks it agains schema)
  */
  constructor(pub: fMouseInputConfigPub) {
    super(pub, fMouseInputConfig.schema);
  }

  restore() {}
  destroy() {}
}
