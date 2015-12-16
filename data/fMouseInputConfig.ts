export interface fMouseInputConfigPub {
  cameraActorName: string;
}

export default class fMouseInputConfig extends SupCore.Data.Base.ComponentConfig {

  static schema = {
    cameraActorName: { type: "string?", min: 0, mutable: true },
  }

  static create() {
    console.log("fMouseInputConfig.create");

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
    // if (pub.whatever == null) pub.whatever = false;
    super(pub, fMouseInputConfig.schema);
    console.log("fMouseInputConfig constructor", pub);
  }

  restore() {}
  destroy() {}

  /**
  * called when this.editConfig("setProperty", path, value) is called from a component editor
  * If the method is overloaded here, it's super must be called for the new value to be saved
  *
  * calls in return the component's Updater and Editor with the actual value
  */
  /*setProperty(path: string, value: any, callback: (err: string, actualValue?: any) => any) {
    console.log("fMouseInputConfig setProperty", path, value, callback);
    super.setProperty(path, value, callback);
  }*/
}
