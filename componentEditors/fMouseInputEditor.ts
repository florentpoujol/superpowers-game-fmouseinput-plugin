/// <reference path="../index.d.ts" />

import { fMouseInputConfigPub } from "../data/fMouseInputConfig";

/**
* Handles the form to edit the fMouseInput component public parameters in the scene editor.
*/
export default class fMouseInputEditor {
  projectClient: SupClient.ProjectClient;
  editConfig: any;

  cameraActorNameField: HTMLInputElement;
  
  /**
  * called when an actor in the scene gain focus
  * editConfig is defined in app\system/supGame/plugins\sparklinlabs\scene\editors\scene.ts:createComponentElement()
  */
  constructor(tbody: HTMLTableSectionElement, config: fMouseInputConfigPub, projectClient: SupClient.ProjectClient, editConfig: any) {
    this.editConfig = editConfig;
    this.projectClient = projectClient;

    let textRow = SupClient.table.appendRow(tbody, "Camera");
    let textField = SupClient.table.appendTextField(textRow.valueCell, config.cameraActorName);
    this.cameraActorNameField = textField;

    this.cameraActorNameField.addEventListener("change", (event: any) => {
      this.editConfig("setProperty", "cameraActorName", event.target.value.trim());
    });
  }

  config_setProperty(path: string, value: any) {
    if (this.projectClient.entries == null) return;
    switch(path) {
      case "cameraActorName":
        this.cameraActorNameField.value = value;
        break;
    }
  }

  destroy() {}
  onEntriesReceived(entries: SupCore.Data.Entries) {}
  onEntryAdded(entry: any, parentId: string, index: number) {}
  onEntryMoved(id: string, parentId: string, index: number) {}
  onSetEntryProperty(id: string, key: string, value: any) {}
  onEntryTrashed(id: string) {}
}
