(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/// <reference path="../../../default/scene/ComponentConfig.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
class FMouseInputConfig extends SupCore.Data.Base.ComponentConfig {
    /**
    * Called when the serveur loads, the scene loads
    * pub is the loaded config, the call to super sets this.pub (and probably checks it agains schema)
    */
    constructor(pub) {
        super(pub, FMouseInputConfig.schema);
    }
    static create() {
        let emptyConfig = {
            cameraActorName: ""
        };
        return emptyConfig;
    }
}
FMouseInputConfig.schema = {
    cameraActorName: { type: "string?", min: 0, mutable: true },
};
exports.default = FMouseInputConfig;

},{}],2:[function(require,module,exports){

var fMouseInputConfig = require("./fMouseInputConfig");
SupCore.system.registerPlugin("componentConfigs", "fMouseInput", fMouseInputConfig.default);

},{"./fMouseInputConfig":1}]},{},[2]);
