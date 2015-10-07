var fs = require("fs");

var main = fs.readFileSync(__dirname + "/main.ts", { encoding: "utf8" });
var lang = fs.readFileSync(__dirname + "/lang.ts", { encoding: "utf8" });

SupAPI.registerPlugin("typescript", "fLib", {
  code: main+lang,
  defs: fs.readFileSync(__dirname + "/main.d.ts", { encoding: "utf8" })
});

SupAPI.registerPlugin("typescript", "f.Gui", {
  code: fs.readFileSync(__dirname + "/gui.ts", { encoding: "utf8" })
});

SupAPI.registerPlugin("typescript", "FTWEEN", {
  code: "declare var FTWEEN;",
  defs: fs.readFileSync(__dirname + "/../lib/ftween.d.ts", { encoding: "utf8" })
});

SupAPI.registerPlugin("typescript", "f.Tween", {
  code: fs.readFileSync(__dirname + "/tween.ts", { encoding: "utf8" })
});

SupAPI.registerPlugin("typescript", "f.Text", {
  code: fs.readFileSync(__dirname+"/fText.ts", { encoding: "utf8" }).replace("<reference path=", ""),
});



SupAPI.registerPlugin("typescript", "EventEmitter component accessor", {
  exposeActorComponent: { propertyName: "event", className: "f.EventEmitterComponent" }
});

SupAPI.registerPlugin("typescript", "MouseInput component accessor", {
  exposeActorComponent: { propertyName: "mouseInput", className: "f.MouseInput" }
});
