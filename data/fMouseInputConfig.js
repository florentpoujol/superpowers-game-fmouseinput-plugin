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
