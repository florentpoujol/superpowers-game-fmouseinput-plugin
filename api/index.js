var fs = require("fs");

SupAPI.registerPlugin("typescript", "fFramework", {
  code: fs.readFileSync(__dirname + "/ff.ts", { encoding: "utf8" }).replace("reference path", "_reference path"),
  defs: fs.readFileSync(__dirname + "/ff.d.ts", { encoding: "utf8" }),
  exposeActorComponent: { propertyName: "event", className: "EventEmitterComponent" }
});
SupAPI.registerPlugin("typescript", "fFramework", {
  exposeActorComponent: { propertyName: "mouseInput", className: "MouseInput" }
});
