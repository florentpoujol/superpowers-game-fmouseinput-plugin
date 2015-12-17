# Superpowers fMouseInput plugin

Ths plugin expose the `fMouseInput` actor component and allows for easy setup of interactions between the mouse and actors in the `Sup Game` system of [Superpowers, the extensible HTML5 2D+3D game engine](http://arklinlabs.com).  


## Documentation

[http://florentpoujol.github.io/superpowers-fmouseinput-plugin](http://florentpoujol.github.io/superpowers-fmouseinput-plugin)

You can also access it offline in Superpowers' client with the [plugin documentation](https://github.com/florentpoujol/superpowers-pluginsdocumentation-plugin) plugin, or find it directly in the plugin's `public/docs` folder.


## Installation

[Download the latest release](https://github.com/florentpoujol/superpowers-fmouseinput-plugin/releases), unzip it, rename the folder to `fMouseInput`, move it inside `app/systems/supGame/plugins/florentpoujol/` then restart your server.

__Advanced:__

Get it via `npm`:
        
    cd app/systems/supGame/plugins
    npm install sup-fmouseinput-plugin

The name of the vendors or plugins in the `app/systems/supGame/plugins/` folder don't matter.  
So you can leave the plugin path as `node_modules/sup-fmouseinput-plugin`.


## Quick Setup

Place one component (via script or the scene editor) on each actors you want to check for interaction with the mouse.

Tell this newly placed component which camera the actor should be visible from :
- if added by script, pass the camera component, its actor or its name to the `camera` property.  
- if added in the scene editor, sets the camera's actor's name in the `Camera` field.

Then from your scripts, add some listeners for the events bellow on the event emitter exposed by the component through the `emitter` property.

Events you can listen to are : `mouseEnter`, `mouseExit`, `mouseMouve`, `leftClick`, `middleClick`, `rightClick`, `wheelUp`, `wheelDown`.

Example : 

This behavior is on an actor which should be checked for interaction with the mouse.  
There is another actor named `"Camera"` with a `Sup.Camera` component.

    class MouseInputBehavior extends Sup.Behavior {
      awake() {
        
        // if not already done from the scene editor :
        // add the component
        new fMouseInput(this.actor);
        
        // the set the camera
        this.actor.fMouseInput.camera = "Camera";

        // then just setup some interactions
        this.actor.fMouseInput.emitter.on("leftClick", () => { 
          // do stuff !
        });
      }
    }
    Sup.registerBehavior(ButtonBehavior);