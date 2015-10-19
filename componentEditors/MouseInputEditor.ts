import { MouseInputConfigPub } from "../data/MouseInputConfig";

export default class MouseInputEditor {
  projectClient: SupClient.ProjectClient;
  editConfig: any;

  cameraActorNameField: HTMLInputElement;
  
  /**
  * called when an actor in the scene gain focus
  * editConfig is defined in app\plugins\sparklinlabs\scene\editors\scene.ts:createComponentElement()
  */
  constructor(tbody: HTMLTableSectionElement, config: MouseInputConfigPub, projectClient: SupClient.ProjectClient, editConfig: any) {
    console.log("MouseInputEditor constructor", config);
    this.editConfig = editConfig;
    this.projectClient = projectClient;

    let textRow = SupClient.table.appendRow(tbody, "Camera");
    let textField = SupClient.table.appendTextField(textRow.valueCell, config.cameraActorName);
    this.cameraActorNameField = textField;

    this.cameraActorNameField.addEventListener("change", (event: any) => {
      console.log("cameraActorNameField listener", event.target.value.trim());
      this.editConfig("setProperty", "cameraActorName", event.target.value.trim());
      // calls MouseInputConfig setProperty on the serveur
    });

    // this.projectClient.subEntries(this);
  }

  config_setProperty(path: string, value: any) {
    if (this.projectClient.entries == null) return;
    console.log("MouseInputEditor config_setProperty", path, value);
    switch(path) {
      case "cameraActorName":
        this.cameraActorNameField.value = value;
        break;
    }
  }

  destroy() {
    // this.projectClient.subEntries(this);
  }
  onEntriesReceived(entries: SupCore.data.Entries) {}
  onEntryAdded(entry: any, parentId: string, index: number) {}
  onEntryMoved(id: string, parentId: string, index: number) {}
  onSetEntryProperty(id: string, key: string, value: any) {}
  onEntryTrashed(id: string) {}
}
