"use strict";
/// <reference path="../index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
/**
* Handles the form to edit the fMouseInput component public parameters in the scene editor.
*/
class FMouseInputEditor {
    /**
    * called when an actor in the scene gain focus
    * editConfig is defined in app\system/supGame/plugins\sparklinlabs\scene\editors\scene.ts:createComponentElement()
    */
    constructor(tbody, config, projectClient, editConfig) {
        this.editConfig = editConfig;
        this.projectClient = projectClient;
        let textRow = SupClient.table.appendRow(tbody, "Camera");
        let textField = SupClient.table.appendTextField(textRow.valueCell, config.cameraActorName);
        this.cameraActorNameField = textField;
        this.cameraActorNameField.addEventListener("change", (event) => {
            this.editConfig("setProperty", "cameraActorName", event.target.value.trim());
        });
    }
    config_setProperty(path, value) {
        if (this.projectClient.entries == null)
            return;
        switch (path) {
            case "cameraActorName":
                this.cameraActorNameField.value = value;
                break;
        }
    }
    /* tslint:disable:no-empty */
    // empty methods necessary to prevent errors when in the scene editor
    destroy() { }
    onEntriesReceived(entries) { }
    onEntryAdded(entry, parentId, index) { }
    onEntryMoved(id, parentId, index) { }
    onSetEntryProperty(id, key, value) { }
    onEntryTrashed(id) { }
}
exports.default = FMouseInputEditor;
