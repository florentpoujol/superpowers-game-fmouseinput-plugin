
var fs = require("fs");

SupCore.system.registerPlugin("typescriptAPI", "fMouseInput", {
  code: fs.readFileSync(__dirname + "/main.ts", { encoding: "utf8" }).replace(/reference path/gi, ""),
  defs: fs.readFileSync(__dirname + "/main.d.ts", { encoding: "utf8" }),
  exposeActorComponent: { propertyName: "fMouseInput", className: "fMouseInput" }
});
