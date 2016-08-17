(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../index.d.ts" />
"use strict";
/**
* Handles the form to edit the fMouseInput component public parameters in the scene editor.
*/
var FMouseInputEditor = (function () {
    /**
    * called when an actor in the scene gain focus
    * editConfig is defined in app\system/supGame/plugins\sparklinlabs\scene\editors\scene.ts:createComponentElement()
    */
    function FMouseInputEditor(tbody, config, projectClient, editConfig) {
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
    FMouseInputEditor.prototype.config_setProperty = function (path, value) {
        if (this.projectClient.entries == null)
            return;
        switch (path) {
            case "cameraActorName":
                this.cameraActorNameField.value = value;
                break;
        }
    };
    /* tslint:disable:no-empty */
    // empty methods necessary to prevent errors when in the scene editor
    FMouseInputEditor.prototype.destroy = function () { };
    FMouseInputEditor.prototype.onEntriesReceived = function (entries) { };
    FMouseInputEditor.prototype.onEntryAdded = function (entry, parentId, index) { };
    FMouseInputEditor.prototype.onEntryMoved = function (id, parentId, index) { };
    FMouseInputEditor.prototype.onSetEntryProperty = function (id, key, value) { };
    FMouseInputEditor.prototype.onEntryTrashed = function (id) { };
    return FMouseInputEditor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FMouseInputEditor;

},{}],2:[function(require,module,exports){

var fMouseInputEditor = require("./fMouseInputEditor");
SupClient.registerPlugin("componentEditors", "fMouseInput", fMouseInputEditor.default);

},{"./fMouseInputEditor":1}]},{},[2]);
