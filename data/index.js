
var fTextSettingsResource = require("./fTextSettingsResource");
SupCore.data.registerResource("fTextSettings", fTextSettingsResource.default);

var fTextAsset = require("./fTextAsset");
SupCore.data.registerAssetClass("fText", fTextAsset.default);

var MouseInputConfig = require("./MouseInputConfig");
SupCore.data.registerComponentConfigClass("MouseInput", MouseInputConfig.default);
