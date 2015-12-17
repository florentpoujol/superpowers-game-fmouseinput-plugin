(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var fMouseInputEditor = require("./fMouseInputEditor");
SupClient.registerPlugin("componentEditors", "fMouseInput", fMouseInputEditor.default);

},{"./fMouseInputEditor":2}],2:[function(require,module,exports){
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

},{}]},{},[1]);
