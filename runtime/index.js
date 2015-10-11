
window.FTWEEN = require("../lib/ftween.js");

SupEngine.registerEarlyUpdateFunction("fTween", function() {
  window.FTWEEN.update();
});

var fText = require("./fText");
SupRuntime.registerPlugin("fText", fText); 
// the name of the plugin must be the same as the asset type
