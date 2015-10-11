var fs = require("fs");

SupAPI.registerPlugin("typescript", "fLib", {
  code: fs.readFileSync(__dirname + "/main.ts", { encoding: "utf8" }).replace("<reference path=", ""),
  defs: fs.readFileSync(__dirname + "/main.d.ts", { encoding: "utf8" })
});

SupAPI.registerPlugin("typescript", "f.Lang", {
  code: fs.readFileSync(__dirname + "/lang.ts", { encoding: "utf8" })
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

SupAPI.registerPlugin("typescript", "fText", {
  code: fs.readFileSync(__dirname+"/fText.ts", { encoding: "utf8" }).replace("<reference path=", ""),
});

// --------------------------------------------------------------------------------
// accessors on actors

SupAPI.registerPlugin("typescript", "EventEmitter accessor", {
  exposeActorComponent: { propertyName: "eventEmitter", className: "any" }
});

SupAPI.registerPlugin("typescript", "MouseInput", {
  exposeActorComponent: { propertyName: "mouseInput", className: "f.MouseInput" }
});
