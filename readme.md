# Superpowers Game fMouseInput component

This plugin makes it super simple to setup interactions between the mouse and actors in the `Superpowers Game` system of [Superpowers, the extensible HTML5 2D+3D game engine](http://superpowers-html5.com).

It exposes the `fMouseInput` actor component on which mouse input events are emitted whenever the mouse hovers an actor and some mouse button are clicked.

It allows to easily answer questions like these and do something whenever these events happens:
- is the mouse pointer over my actor now ?
- did the player clicked on a button while hovering my actor ?
- has the mouse left my actor ?


## Installation

Directly from the `Server Settings` tab in Superpowers' App.

Or manually :
[Download the latest release](https://github.com/florentpoujol/superpowers-game-fmouseinput-plugin/releases), unzip it, rename the folder to `fMouseInput`, move it inside `resources/app/systems/game/plugins/florentpoujol/` then restart your server.


## Setup 

`fMouseInput` is an actor component (like a `SpriteRenderer`) which has to be first placed (via script or the scene editor) on each actors you want to check for interaction with the mouse.

Then, tell the newly placed component which camera the actor should be visible from.
- If you added the component in the scene editor, sets the camera's actor's name in the `Camera` field.

![Add and setup the component via the scene editor](fmouseinput_tutorial_add_component_in_scene.jpg)

- If you added the component by script, pass the camera component or the camera actor name to the `setCameraComponent()` or `setCameraActorName()` methods.

Example via script :

    class MouseInputBehavior extends Sup.Behavior {
      awake() {
        // add the component
        new fMouseInput(this.actor);
        
        // then set the camera component
        this.actor.fMouseInput.setCameraComponent( Sup.getActor("MyCamera").camera );
        // or
        this.actor.fMouseInput.setCameraActorName( "MyCamera" );     
      }
    }


## Usage

One way to setup interactions is to check the value of the component's `isMouseOver` property (which is `true` or `false`).

Once you are sure the mouse is over the actor, you can check for mouse button press to create a button for instance.

    class MouseInputBehavior extends Sup.Behavior {
      update() {
        if (this.actor.fMouseInput.isMouseOver && Sup.Input.wasMouseButtonJustReleased(0)) {
          // do stuff when the left mouse button has been released
        }
      }
    }

You can also listen to several events like `mouseEnter` or `leftClickReleased` for instance to make things even easier.  
So all you have to do is setup a listener function via the the component'ss event emiter :

    class MouseInputBehavior extends Sup.Behavior {
      awake() {

        this.actor.fMouseInput.emitter.on("mouseEnter", () => {
          // do stuff when the mouse just entered the actor
        });

        this.actor.fMouseInput.emitter.on("leftClickReleased", () => { this.onLeftClick(); });
      }

      onLeftCLick() {
        // do stuff when the left mouse button has been released
      }
    }


## Events

Here is the list of the default events that you can listen to:

- `mouseEnter` when the mouse wasn't on the actor the previous tick and is on the actor this tick.
- `mouseExit` when the mouse was on the actor the previous tick and isn't on the actor this tick.
- `mouseMove` when the mouse is on the actor and has moved from the previous tick (it isn't emitted if the mouse in over the actor but doesn't move).
- `leftClickPressed`, `leftClickDown`, `leftClickReleased` when the mouse is on the actor and the left mouse button was pressed/released during the previous tick or is currently down.
- `middleClickPressed`, `middleClickDown`, `middleClickReleased` when the mouse is on the actor and the middle mouse button (usually the wheel) was pressed/released during the previous tick or is currently down.
- `rightClickPressed`, `rightClickDown`, `rightClickReleased` when the mouse is on the actor and the right mouse button was pressed/released during the previous tick or is currently down.
- `wheelUp`, `wheelDown` when the mouse is on the actor and the wheel is turned up or down during this tick.

If you have the need to, the name and behavior of the "click" and "wheel" events can be modified by altering the `fMouseInput.behaviorByEvents` static property.


## Misc

The actors you want the mouse to interact with must have some kind of renderer like a sprite renderer.

The interactions happen even when :
- the renderer has an opacity of 0.
- the renderer is actually not visible because it is hidden by other renderers in front of him from the camera point of view.

The interactions don't happen when :
- the actor is hidden with `actor.setVisible(false)` (or by unchecking the actor's `Visible` checkbox in the scene editor).
- the layer the actor is part of is deactivated.

An `fMouseInput` component will be added automatically on the actor with the camera component.
