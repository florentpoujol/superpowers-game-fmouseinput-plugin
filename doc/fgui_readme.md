# Superpowers fGui plugin

`fGUI` is a super easy solution to create simple HTML GUIs in [Superpowers, the extensible HTML5 2D+3D game engine](http://sparklinlabs.com).


## Documentation

[http://florentpoujol.github.io/superpowers-fgui-plugin](http://florentpoujol.github.io/superpowers-fgui-plugin)

You can also access it offline in Superpowers' client with the [docs browser](https://github.com/florentpoujol/superpowers-docs-browser-plugin) plugin, or find it directly in the plugin's `public/docs` folder.

## Installation

[Download the latest release](https://github.com/florentpoujol/superpowers-fGui-plugin/releases), unzip it, rename the folder to `fGui`, move it inside `app/plugins/florentpoujol/` then restart your server.

Works in Superpower `v0.5.x` and above.

## Quick look

![Simple UI without style](https://dl.dropboxusercontent.com/u/51314747/superpowers/fgui_readme_example.jpg)

This UI is produced by this code:

    // simple text, with independant value
    let score = new fGui.Text("Score: ", 0);

    // link
    let link = new fGui.Text("More awesome games");
    link.url = "http://itch.io";

    // paragraph
    let asset = Sup.get("My wall of text", fText);
    let paragraph = new fGui.Text(asset.text, { isMultiline: true });

    // button
    let button = new fGui.Button("Click me !", "button1");
    button.on("click", function(i: fGui.Button) {
      console.log("Button '"+i.value+"' has been clicked"); // "Button 'button1' has been clicked 
    });

    //  number input
    let input = new fGui.Input("number", "Your age: ", 27, { 
      min: 0,
      max: 100,
      onChange: function(i: fGui.Input) {
        console.log("New age", i.value);
      }
    });

    // checkbox
    let box = new fGui.Checkbox("Are you a human ? ", false);

    // radio
    let onGenderChange = function(i: fGui.Radio) {
      console.log("New gender set:", i.value)
    };

    let radio = new fGui.Radio("gender", "{{input}} Male", true, { value: "male", onChange: onGenderChange } );
    let radio = new fGui.Radio("gender", "{{input}} Female");
    radio.value = "female";
    radio.on("change", onGenderChange);

