(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../index.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FMouseInputUpdater = (function () {
    /**
    * Called when the scene loads
    * initialize engine component from config
    * @param projectClient Of type ProjectClient
    * @param component Of type FMouseInput
    * @param config Of type FMouseInputConfigPub
    */
    function FMouseInputUpdater(projectClient, component, config) {
        component.setCameraActorName(config.cameraActorName);
    }
    FMouseInputUpdater.prototype.destroy = function () { return; };
    return FMouseInputUpdater;
}());
exports.FMouseInputUpdater = FMouseInputUpdater;
var FMouseInput = (function (_super) {
    __extends(FMouseInput, _super);
    /**
    * Called when the scene loads
    * actor - the scene's actor
    */
    function FMouseInput(actor) {
        _super.call(this, actor, "fMouseInput");
        /* tslint:enable:variable-name */
        this.cameraActorName = "";
        this.isLayerActive = true;
    }
    FMouseInput.prototype.update = function () {
        if (this.outer != null && this.isLayerActive === true && this.actor.threeObject.visible === true)
            this.outer._update();
    };
    // called by Superpowers when a layer is (de)actived
    FMouseInput.prototype.setIsLayerActive = function (active) {
        this.isLayerActive = active;
    };
    // called by the API instance when it is destroyed
    FMouseInput.prototype._destroy = function () {
        this.isLayerActive = false;
        this.outer = null;
        _super.prototype._destroy.call(this);
    };
    // called from the API component on creation
    // outer is the component's API instance, of type fMouseInput
    FMouseInput.prototype.setOuter = function (outer) {
        if (this.cameraActorName !== "")
            outer.setCameraActorName(this.cameraActorName);
        this.outer = outer;
    };
    // called from the Updater
    FMouseInput.prototype.setCameraActorName = function (name) {
        this.cameraActorName = name;
        if (this.outer != null)
            this.outer.setCameraActorName(this.cameraActorName);
    };
    /* tslint:disable:variable-name */
    FMouseInput.Updater = FMouseInputUpdater;
    return FMouseInput;
}(SupEngine.ActorComponent));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FMouseInput;

},{}],2:[function(require,module,exports){

var fMouseInput = require("./fMouseInput");
SupEngine.registerComponentClass("fMouseInput", fMouseInput.default);

},{"./fMouseInput":1}]},{},[2]);
