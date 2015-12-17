# Superpowers fMouseInput plugin

Once setup, this plugin will emit mouse input events on actors that interact with the mouse.

The plugin expose to the API a single `fMouseInput` actor component, accessible on actors through the `fMouseInput` property.


## Events / Interactions

Each component instance has an event emitter accessible through the `emitter` property on which the following events may be emitted :

- `mouseEnter` when the mouse wasn't on the actor the previous tick and is on the actor this tick.
- `mouseExit` when the mouse was on the actor the previous tick and isn't on the actor this tick.
- `mouseMove` when the mouse is on the actor and has moved from the previous tick (it isn't emitted if the mouse in over the actor but doesn't move).
- `leftClick` when the mouse is on the actor and the left mouse button was released during the previous tick.
- `middleClick` when the mouse is on the actor and the middle mouse button (usually the wheel) was released during the previous tick.
- `rightClick` when the mouse is on the actor and the right mouse button was released during the previous tick.
- `wheelUp`, `wheelDown` when the mouse is on the actor and the wheel was turned up or down during the previous tick.

The component also has a `isMouseOver` property that is `true` when the mouse is over the actor and `false` otherwise.


## Setup 

Place one component (via script or the scene editor) on each actors you want to check for interaction with the mouse.

Tell this newly placed component which camera the actor should be visible from :
- if added by script, pass the camera component, its actor or its name to the `camera` property.  
- if added in the scene editor, sets the camera's actor's name in the `Camera` field.

Then from your scripts, just add some listeners for the events above.

Note that an `fMouseInput` component will be added automatically on the camera's actor.


## Example of a basic button

This behavior is on a button, an actor which should be checked for interaction with the mouse.

There is another actor named `"Camera"` with a `Sup.Camera` component.

    class ButtonBehavior extends Sup.Behavior {
      awake() {
        
        // if not already done from the scene editor :
        // add the component
        new fMouseInput(this.actor);
        
        // then set the camera
        this.actor.fMouseInput.camera = "Camera";
        // or
        this.actor.fMouseInput.camera = Sup.getActor("Camera");
        // or
        this.actor.fMouseInput.camera = Sup.getActor("Camera").camera;

        // then just setup some interactions
        this.actor.fMouseInput.emitter.on("leftClick", () => { 
          // do stuff !
        });
      }
    }
    Sup.registerBehavior(ButtonBehavior);


## Misc

The actors you want the mouse to interact with must have some kind of renderer like a sprite renderer.

The interactions happen even when :
- the renderer has an opacity of 0.
- the renderer is actually not visible because it is hidden by other renderers in front of him from the camera point of view

The interactions don't happen when :
- the layer is hidden with `actor.setVisible(false)` (or by unchecking the actor's `Visible` checkbox in the scene editor)
- the layer the actor is part of is deactivated.

Yet the component's `camera` property accept a value of type `Sup.Camera`, `Sup.Actor` or `string`, it always return a `Sup.Camera`.