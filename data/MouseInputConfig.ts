export interface MouseInputConfigPub {
  cameraActorName: string;
}

export default class MouseInputConfig extends SupCore.data.base.ComponentConfig {

  static schema = {
    cameraActorName: { type: "string?", min: 0, mutable: true },
  }

  static create() {
    console.log("MouseInputConfig.create");

    let emptyConfig: MouseInputConfigPub = {
      cameraActorName: "",
    };
    return emptyConfig;
  }
  
  pub: MouseInputConfigPub;

  /**
  * Called when the serveur loads, the scene loads
  * pub is the loaded config, the call to super sets this.pub (and probably checks it agains schema)
  */
  constructor(pub: MouseInputConfigPub) {
    // if (pub.whatever == null) pub.whatever = false;
    super(pub, MouseInputConfig.schema);
    console.log("MouseInputConfig constructor", pub);
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
    console.log("MouseInputConfig setProperty", path, value, callback);
    super.setProperty(path, value, callback);
  }*/
}
