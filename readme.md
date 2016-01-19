# Superpowers Game fMouseInput component

This plugin makes it super simple to setup interactions between the mouse and actors in the `Superpowers Game` system of [Superpowers, the extensible HTML5 2D+3D game engine](http://superpowers-html5.com).

It exposes the `fMouseInput` actor component on which mouse input events are emitted whenever the mouse hovers an actor and some mouse button are clicked.


## Documentation

[http://florentpoujol.github.io/superpowers-game-fmouseinput-plugin](http://florentpoujol.github.io/superpowers-game-fmouseinput-plugin)

You can also access it offline in Superpowers' client with the [plugin documentation](https://github.com/florentpoujol/superpowers-common-pluginsdocs-plugin) plugin, or find it directly in the plugin's `public/docs` folder.


## Installation

[Download the latest release](https://github.com/florentpoujol/superpowers-game-fmouseinput-plugin/releases), unzip it, rename the folder to `fMouseInput`, move it inside `app/systems/supGame/plugins/florentpoujol/` then restart your server.

__Advanced:__

Get it via `npm`:
        
    cd app/systems/game/plugins
    npm install superpowers-game-fmouseinput-plugin

The name of the vendors or plugins in the `app/systems/game/plugins/` folder don't matter.  
So you can leave the plugin path as `node_modules/superpowres-game-fmouseinput-plugin`.


## Quick Setup

Place one component (via script or the scene editor) on each actors you want to check for interaction with the mouse.

Tell this newly placed component which camera the actor should be visible from :
- if added by script, pass the camera component, its actor or its name to the `camera` property.  
- if added in the scene editor, sets the camera's actor's name in the `Camera` field.

Then from your scripts, add some listeners for the events bellow via the component's `on(event, listener)` method.

Events you can listen to are : 

- `mouseEnter`, `mouseExit`, `mouseMouve`, 
- `leftClickPressed`, `leftClickDown`, `leftClickReleased`
- `middleClickPressed`, `middleClickDown`, `middleClickReleased`
- `rightClickPressed`, `rightClickDown`, `rightClickReleased` 
- `wheelUp`, `wheelDown`.  

Example : 

This behavior is on an actor which should be checked for interaction with the mouse.  
There is another actor named `"Camera"` with a `Sup.Camera` component.

    class MouseInputBehavior extends Sup.Behavior {
      awake() {
        // the component has been added through the scene editor,
        // so all you have to do is setup some interactions
        this.actor.fMouseInput.on("leftClickReleased", () => { 
          // do stuff !
        });
      }
    }
    Sup.registerBehavior(MouseInputBehavior);
