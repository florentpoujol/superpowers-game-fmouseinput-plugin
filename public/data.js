(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fMouseInputConfig = (function (_super) {
    __extends(fMouseInputConfig, _super);
    /**
    * Called when the serveur loads, the scene loads
    * pub is the loaded config, the call to super sets this.pub (and probably checks it agains schema)
    */
    function fMouseInputConfig(pub) {
        _super.call(this, pub, fMouseInputConfig.schema);
    }
    fMouseInputConfig.create = function () {
        var emptyConfig = {
            cameraActorName: ""
        };
        return emptyConfig;
    };
    fMouseInputConfig.prototype.restore = function () { };
    fMouseInputConfig.prototype.destroy = function () { };
    fMouseInputConfig.schema = {
        cameraActorName: { type: "string?", min: 0, mutable: true },
    };
    return fMouseInputConfig;
})(SupCore.Data.Base.ComponentConfig);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fMouseInputConfig;

},{}],2:[function(require,module,exports){

var fMouseInputConfig = require("./fMouseInputConfig");
SupCore.system.data.registerComponentConfigClass("fMouseInput", fMouseInputConfig.default);

},{"./fMouseInputConfig":1}]},{},[2]);
