/// <reference path="../index.d.ts" />
/**
* Handles the form to edit the fMouseInput component public parameters in the scene editor.
*/
var fMouseInputEditor = (function () {
    /**
    * called when an actor in the scene gain focus
    * editConfig is defined in app\system/supGame/plugins\sparklinlabs\scene\editors\scene.ts:createComponentElement()
    */
    function fMouseInputEditor(tbody, config, projectClient, editConfig) {
        var _this = this;
        this.editConfig = editConfig;
        this.projectClient = projectClient;
        var textRow = SupClient.table.appendRow(tbody, "Camera");
        var textField = SupClient.table.appendTextField(textRow.valueCell, config.cameraActorName);
        this.cameraActorNameField = textField;
        this.cameraActorNameField.addEventListener("change", function (event) {
            _this.editConfig("setProperty", "cameraActorName", event.target.value.trim());
        });
    }
    fMouseInputEditor.prototype.config_setProperty = function (path, value) {
        if (this.projectClient.entries == null)
            return;
        switch (path) {
            case "cameraActorName":
                this.cameraActorNameField.value = value;
                break;
        }
    };
    fMouseInputEditor.prototype.destroy = function () { };
    fMouseInputEditor.prototype.onEntriesReceived = function (entries) { };
    fMouseInputEditor.prototype.onEntryAdded = function (entry, parentId, index) { };
    fMouseInputEditor.prototype.onEntryMoved = function (id, parentId, index) { };
    fMouseInputEditor.prototype.onSetEntryProperty = function (id, key, value) { };
    fMouseInputEditor.prototype.onEntryTrashed = function (id) { };
    return fMouseInputEditor;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fMouseInputEditor;
