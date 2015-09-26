var navListElt = document.querySelector("nav ul");
var req = new XMLHttpRequest(); // use XHR because fs doesn't get browserified

var vendorNames = [];
var ulEltsByVendor = {};
var pluginsData = {};

// loop on plugins to check if they have a public/docs folder and a manifest
// fill pluginsData object

for (var i in SupClient.pluginPaths.all) {
  var name = SupClient.pluginPaths.all[i];
  var pluginDocUrl = "../../../../"+name+"/docs/"; // ../../../../#{name} si the plugin's public/ folder
  req.open("GET", pluginDocUrl, false); // using async would stop the loop at the first 404 error
  req.send();

  if (req.status === 200) {
    var manifest = {};
    req.open("GET", pluginDocUrl+"manifest.json", false);
    req.send();
    if (req.status === 200)
      manifest = JSON.parse(req.responseText);

    var chunks = name.split("/");
    var vendorName = chunks[0];

    if (pluginsData[vendorName] === undefined) {
      pluginsData[vendorName] = {
        niceName: vendorName,
        plugins: []
      };
    }

    if (manifest.vendorName !== undefined)
      pluginsData[vendorName].niceName = manifest.vendorName;

    if (manifest.vendorUrl !== undefined)
      pluginsData[vendorName].url = manifest.vendorUrl;

    pluginsData[vendorName].plugins.push({ 
      fullName: name, // vendor/plugin
      niceName: manifest.pluginName || chunks[1],
      docUrl: pluginDocUrl
    });
  }
}

// loop on plugins' data to built the navigation menu
for (var vendorName in pluginsData) {
  var vendorData = pluginsData[vendorName];
  var liElt = document.createElement("li"); // vendor li
  navListElt.appendChild(liElt);

  if (vendorData.url !== undefined) {
    var a = document.createElement("a");
    a.href = vendorData.url;
    a.title = "Go to "+vendorData.url;
    a.textContent = vendorData.niceName;
    liElt.appendChild(a);
  }
  else
    liElt.textContent = vendorData.niceName;

  var vendorUlElt = document.createElement("ul"); // vendor plugin list
  liElt.appendChild(vendorUlElt);

  for (var i in vendorData.plugins) {
    var liElt = document.createElement("li"); // plugin li
    vendorUlElt.appendChild(liElt);

    var anchorElt = document.createElement("a"); // plugin link
    liElt.appendChild(anchorElt);

    var plugin = vendorData.plugins[i];    
    anchorElt.id = "link-"+plugin.fullName;
    anchorElt.docRelPath = plugin.docUrl;
    anchorElt.href = "#"+plugin.fullName;
    anchorElt.textContent = plugin.niceName;
  }
}

// handle clicks on the "links"
var iframe = document.querySelector("iframe");

navListElt.addEventListener("click", function(event) {
  // don't do anything if the element isn't a plugin link
  if (event.target.docRelPath === undefined)
    return;

  var activeElt = navListElt.querySelector("li a.active");
  if (activeElt !== undefined)
    activeElt.classList.remove("active");
  event.target.classList.add("active");
  iframe.src = event.target.docRelPath;
});

// select the first item in the list
var selectFirst = function() {
  var a = navListElt.querySelector("li li a");
  a.classList.add("active");
  iframe.src = a.docRelPath;
};

// when the page is (re)loaded select the same plugin as before, or the first plugin
if (window.location.hash.length > 1) {
  var hash = window.location.hash.substring(1);
  var a = document.getElementById("link-"+hash);
  if (a !== undefined) {
    a.classList.add("active");
    iframe.src = a.docRelPath;
  }
  else {
    window.location.hash = "";
    selectFirst();
  }
}
else
  selectFirst();
