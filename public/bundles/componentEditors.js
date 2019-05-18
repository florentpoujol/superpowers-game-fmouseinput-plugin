(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){

var fMouseInputEditor = require("./fMouseInputEditor");
SupClient.registerPlugin("componentEditors", "fMouseInput", fMouseInputEditor.default);

},{"./fMouseInputEditor":1}]},{},[2]);
