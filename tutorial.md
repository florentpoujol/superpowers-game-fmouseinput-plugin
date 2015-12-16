# Superpowers fMouseInput plugin

Once setup this plugin will emit mouse input events on actors that interact with the mouse.

The plugin expose to the API a single `fMouseInput` actor component, accessible on actors through the `fMouseInput` property.


## Events / Interactions

Each component instance has an event emitter accessible through the `eventEmitter` property on which the following events may be emitted :

- `onMouseEnter` when the mouse wasn't on the actor the previous tick and is on the actor this tick.
- `onMouseExit` when the mouse was on the actor the previous tick and isn't on the actor this tick.
- `onMouseMove` when the mouse is on the actor and has moved from the previous tick (it isn't emitted if the mouse in over the actor but doesn't move).
- `onLeftClick` / `onClick` when the mouse is on the actor and the left mouse button (button 0) was released during the previous tick.
- `onRightClick` when the mouse is on the actor and the right mouse button (button 2) was released during the previous tick.

The component also has a `isMouseOver` property that is `true` when the mouse is over the actor and `false` otherwise.

## Setup 

Place one component (via script or the scene editor) on each actors you want to check for interaction with the mouse.

Tell this newly placed component which camera the actor should be visible from :
- if added by script, pass the camera actor or its name to the `cameraActor` property.  
- if added in the scene editor, just set the camera actor name in the `Camera` field.

Note that an `fMouseInput` component will be added automatically on the camera actor.

Then from your scripts, just add some listeners on the event emitter exposed by the component under the `eventEmitter` property.


## Example 

Example of a basic button.

This behavior is on the button, actor which should be checked for interaction with the mouse.

There is another actor named `"Camera"` which already has a `fMouseInput` (and `Sup.Camera`) component.

    class ButtonBehavior extends Sup.Behavior {
      awake() {
        
        // if not already done from the scene editor :
        // add the component
        new fMouseInput(this.actor);
        
        // the set the camera
        this.actor.fMouseInput.cameraActor = "Camera";
        //or
        this.actor.fMouseInput.cameraActor = Sup.getActor("Camera");


        // then just setup some interactions
        this.actor.fMouseInput.eventEmitter.addListener("onLeftClick", () => { 
          // do stuff !
        });
      }
    }
    Sup.registerBehavior(ButtonBehavior);



## Misc

Of course, the actors you want the mouse to interact with must have some kind of renderer like a sprite renderer.

The interaction happens even if the renderer has an opacity of 0.

The interactions doesn't when the acotr is hidden or the layer is deactivated.