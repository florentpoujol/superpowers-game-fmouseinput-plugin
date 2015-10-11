import { MouseInputConfigPub } from "../data/MouseInputConfig";

export default class MouseInputEditor {
  projectClient: SupClient.ProjectClient;
  editConfig: any;

  cameraActorNameField: HTMLInputElement;
  
  constructor(tbody: HTMLTableSectionElement, config: MouseInputConfigPub, projectClient: SupClient.ProjectClient, editConfig: any) {
    this.editConfig = editConfig;
    this.projectClient = projectClient;

    let textRow = SupClient.table.appendRow(tbody, "Camera");
    let textField = SupClient.table.appendTextField(textRow.valueCell, config.cameraActorName);
    this.cameraActorNameField = textField;

    this.cameraActorNameField.addEventListener("change", (event: any) => {
      this.editConfig("setProperty", "cameraActorName", event.target.value.trim());
    });

    // this.projectClient.subEntries(this);
  }

  config_setProperty(path: string, value: any) {
    if (this.projectClient.entries == null) return;

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
