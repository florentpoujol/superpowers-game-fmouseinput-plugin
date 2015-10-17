class MouseInputBehavior extends Sup.Behavior {
  awake() {
//     new f.MouseInput(this.actor);

    this.actor.mouseInput.camera = Sup.getActor("Camera").camera;   
    
    this.actor.eventEmitter.addListener("onMouseMove", () => { console.log("mouse move"); divConsole.write("mouse move")});
    this.actor.eventEmitter.addListener("onLeftClick", () => { console.log("click"); divConsole.write(".    click")});
    this.actor.eventEmitter.addListener("onRightClick", () => { console.log("right click"); divConsole.write(".    right click")});
    this.actor.eventEmitter.addListener("onMouseEnter", () => { console.log("enter"); divConsole.write(".    enter")});
    this.actor.eventEmitter.addListener("onMouseExit", () => { console.log("out"); divConsole.write(".    out    ")});
  }
}
Sup.registerBehavior(MouseInputBehavior);
