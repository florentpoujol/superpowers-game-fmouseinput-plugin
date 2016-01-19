# Superpowers Game fMouseInput component

This plugin brings the `fMouseInput` actor component which makes it super simple to setup interactions between the mouse and actors.

It allows to easily answer questions like these and do something whenever these events happens:
- is the mouse pointer over my actor now ?
- did the player clicked on a button while hovering my actor ?
- has the mouse left my actor ?

[Return to the GitHub repo](https://github.com/florentpoujol/superpowers-game-fmouseinput-plugin).


## Setup 

`fMouseInput` is an actor component (like a `SpriteRenderer`) which has to be first placed (via script or the scene editor) on each actors you want to check for interaction with the mouse.

Then, tell the newly placed component which camera the actor should be visible from.
- If you added the component in the scene editor, sets the camera's actor's name in the `Camera` field.

![Add and setup the component via the scene editor](https://dl.dropboxusercontent.com/u/51314747/superpowers/fmouseinput_tutorial_add_component_in_scene.jpg)

- If you added the component by script, pass the camera component, its actor or its name to the `camera` property.

Example via script :

    class MouseInputBehavior extends Sup.Behavior {
      awake() {
        // add the component
        new fMouseInput(this.actor);
        
        // then set the camera
        this.actor.fMouseInput.camera = "Camera";
        // or
        this.actor.fMouseInput.camera = Sup.getActor("Camera");
        // or
        this.actor.fMouseInput.camera = Sup.getActor("Camera").camera;
      }
    }
    Sup.registerBehavior(MouseInputBehavior);

Note that the actor must also have some kind of renderer (like a `SpriteRenderer`) and that an `fMouseInput` component will be added automatically on the camera's actor.


## Interactions

One way to setup interactions is to check the value of the component's `isMouseOver` property.

Once you are sure the mouse is over the actor, you can check for mouse button press to create a button for instance.

    class MouseInputBehavior extends Sup.Behavior {
      update() {
        if (this.actor.fMouseInput.isMouseOver && Sup.Input.wasMouseButtonJustReleased(0)) {
            // do stuff
        }
      }
    }
    Sup.registerBehavior(MouseInputBehavior);

You can also check when the value change to know when the mouse enters or exits the actor but their is an even easier way.

You can listen to a whole bunch of events like `mouseEnter` or `leftClickReleased` for instance.  
So all you have to do is setup a listener function with the component's `on(eventName, listenerFunction)` method :

    class MouseInputBehavior extends Sup.Behavior {
      awake() {

        this.actor.fMouseInput.on("mouseEnter", () => {
          // do stuff when the mouse just entered the actor
        });

        this.actor.fMouseInput.on("leftClickReleased", () => { this.onLeftClick(); });
      }

      onLeftCLick() {
        // do stuff when the left mouse button has been released
      }
    }
    Sup.registerBehavior(MouseInputBehavior);


## Events

For convenience, you have full access to the event emitter via the component's `emitter` property.

Here is the list of the default events that you can listen to:

- `mouseEnter` when the mouse wasn't on the actor the previous tick and is on the actor this tick.
- `mouseExit` when the mouse was on the actor the previous tick and isn't on the actor this tick.
- `mouseMove` when the mouse is on the actor and has moved from the previous tick (it isn't emitted if the mouse in over the actor but doesn't move).
- `leftClickPressed`, `leftClickDown`, `leftClickReleased` when the mouse is on the actor and the left mouse button was pressed/released during the previous tick or is currently down.
- `middleClickPressed`, `middleClickDown`, `middleClickReleased` when the mouse is on the actor and the middle mouse button (usually the wheel) was pressed/released during the previous tick or is currently down.
- `rightClickPressed`, `rightClickDown`, `rightClickReleased` when the mouse is on the actor and the right mouse button was pressed/released during the previous tick or is currently down.
- `wheelUp`, `wheelDown` when the mouse is on the actor and the wheel is turned up or down during this tick.

The component also has a `isMouseOver` property that is `true` when the mouse is over the actor and `false` otherwise.








## Misc

The actors you want the mouse to interact with must have some kind of renderer like a sprite renderer.

The interactions happen even when :
- the renderer has an opacity of 0.
- the renderer is actually not visible because it is hidden by other renderers in front of him from the camera point of view

The interactions don't happen when :
- the layer is hidden with `actor.setVisible(false)` (or by unchecking the actor's `Visible` checkbox in the scene editor)
- the layer the actor is part of is deactivated.

Yet the component's `camera` property accept a value of type `Sup.Camera`, `Sup.Actor` or `string`, it always return a `Sup.Camera`.
