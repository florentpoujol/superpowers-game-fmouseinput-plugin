export interface MouseInputConfigPub {
  cameraActorName: string;
}

export default class MouseInputConfig extends SupCore.data.base.ComponentConfig {

  static schema = {
    cameraActorName: { type: "string?", min: 0, mutable: true },
  }

  static create() {
    let emptyConfig: MouseInputConfigPub = {
      cameraActorName: "",
    };
    return emptyConfig;
  }
  
  pub: MouseInputConfigPub;

  constructor(pub: MouseInputConfigPub) {
    // if (pub.whatever == null) pub.whatever = false;
    super(pub, MouseInputConfig.schema);
  }

  restore() {}
  destroy() {}

  /*setProperty(path: string, value: any, callback: (err: string, actualValue?: any) => any) {
    super.setProperty(path, value, (err, actualValue) => {
      if (err != null) { callback(err); return; }
      callback(null, actualValue);
    });
  }*/
}
