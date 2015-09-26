var fs = require("fs");

var main = fs.readFileSync(__dirname + "/main.ts", { encoding: "utf8" });
var lang = fs.readFileSync(__dirname + "/lang.ts", { encoding: "utf8" });

SupAPI.registerPlugin("typescript", "fFramework", {
  code: (main + lang).replace("reference path", "_reference path"),
  defs: fs.readFileSync(__dirname + "/main.d.ts", { encoding: "utf8" }),
});

SupAPI.registerPlugin("typescript", "f.Gui", {
  code: fs.readFileSync(__dirname + "/gui.ts", { encoding: "utf8" })
});

SupAPI.registerPlugin("typescript", "EventEmitter component accessor", {
  exposeActorComponent: { propertyName: "event", className: "f.EventEmitterComponent" }
});

SupAPI.registerPlugin("typescript", "MouseInput component accessor", {
  exposeActorComponent: { propertyName: "mouseInput", className: "f.MouseInput" }
});
