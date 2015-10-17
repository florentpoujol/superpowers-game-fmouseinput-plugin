
var fs = require("fs");

SupAPI.registerPlugin("typescript", "fLib", {
  code: fs.readFileSync(__dirname + "/main.ts", { encoding: "utf8" }).replace(/reference path/gi, ""),
  defs: fs.readFileSync(__dirname + "/main.d.ts", { encoding: "utf8" })
});

// --------------------------------------------------------------------------------
// accessors on actors

SupAPI.registerPlugin("typescript", "EventEmitter accessor", {
  exposeActorComponent: { propertyName: "eventEmitter", className: "any" }
  // can't set the className as EventEmitter
});

SupAPI.registerPlugin("typescript", "MouseInput", {
  exposeActorComponent: { propertyName: "mouseInput", className: "f.MouseInput" }
});
