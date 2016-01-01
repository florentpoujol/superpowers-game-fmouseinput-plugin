(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../index.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fMouseInputUpdater = (function () {
    /**
    * Called when the scene loads
    * initialize engine component from config
    */
    function fMouseInputUpdater(client, mouseInput, config, receiveAssetCallbacks, editAssetCallbacks) {
        // initialise
        mouseInput.setCameraActorName(config.cameraActorName);
    }
    fMouseInputUpdater.prototype.destroy = function () { };
    return fMouseInputUpdater;
})();
exports.fMouseInputUpdater = fMouseInputUpdater;
var fMouseInput = (function (_super) {
    __extends(fMouseInput, _super);
    /**
    * Called when the scene loads
    * actor - the scene's actor
    */
    function fMouseInput(actor) {
        _super.call(this, actor, "fMouseInput");
        this.cameraActorName = "";
        this.isLayerActive = true;
    }
    fMouseInput.prototype.update = function () {
        if (this.outer != null && this.isLayerActive === true && this.actor.threeObject.visible === true)
            this.outer.update();
    };
    // called by Superpowers when a layer is (de)actived
    fMouseInput.prototype.setIsLayerActive = function (active) {
        this.isLayerActive = active;
    };
    // called by the API instance when it is destroyed
    fMouseInput.prototype._destroy = function () {
        this.isLayerActive = false;
        this.outer = null;
        _super.prototype._destroy.call(this);
    };
    // called from the API component on creation
    // outer is the component's API instance, of type fMouseInput
    fMouseInput.prototype.setOuter = function (outer) {
        if (this.cameraActorName != "")
            outer.camera = this.cameraActorName;
        this.outer = outer;
    };
    // called from the Updater
    fMouseInput.prototype.setCameraActorName = function (name) {
        this.cameraActorName = name;
        if (this.outer != null)
            this.outer.camera = this.cameraActorName;
    };
    fMouseInput.Updater = fMouseInputUpdater;
    return fMouseInput;
})(SupEngine.ActorComponent);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fMouseInput;

},{}],2:[function(require,module,exports){

var fMouseInput = require("./fMouseInput");
SupEngine.registerComponentClass("fMouseInput", fMouseInput.default);

},{"./fMouseInput":1}]},{},[2]);
