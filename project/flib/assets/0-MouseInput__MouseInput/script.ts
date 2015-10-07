class MouseInputBehavior extends Sup.Behavior {
  awake() {

    new f.MouseInput(this.actor);

    this.actor.mouseInput.camera = Sup.getActor("Camera").camera;
    this.actor.mouseInput.emitter.addListener("onmousemove", () => { console.log("mouse move"); divConsole.write("mouse move")});
    this.actor.mouseInput.emitter.addListener("onclick", () => { console.log("click"); divConsole.write(".    click")});
    this.actor.mouseInput.emitter.addListener("oncontextmenu", () => { console.log("right click"); divConsole.write(".    right click")});
    this.actor.mouseInput.emitter.addListener("onmouseenter", () => { console.log("enter"); divConsole.write(".    enter")});
    this.actor.mouseInput.emitter.addListener("onmouseout", () => { console.log("out"); divConsole.write(".    out    ")});

  }

}
Sup.registerBehavior(MouseInputBehavior);
