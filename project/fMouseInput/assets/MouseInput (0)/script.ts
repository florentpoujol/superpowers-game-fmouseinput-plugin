class MouseInputBehavior extends Sup.Behavior {
  id: number = 0;
  
  awake() {    
    this.actor.fMouseInput.emitter.addListener("mouseEnter", () => { console.log("enter", this.id); });
    this.actor.fMouseInput.emitter.addListener("mouseExit", () => { console.log("out", this.id); });
    this.actor.fMouseInput.emitter.addListener("mouseMove", () => { console.log("move", this.id); });
    
    this.actor.fMouseInput.emitter.on("leftClick", () => { console.log("left click", this.id); });
    this.actor.fMouseInput.emitter.on("middleClick", () => { console.log("middle click", this.id); });  
    this.actor.fMouseInput.emitter.on("rightClick", () => { console.log("right click", this); });
    this.actor.fMouseInput.emitter.on("rightClick", this.onRightClick);

    this.actor.fMouseInput.emitter.on("wheelUp", () => { console.log("wheel up", this.id); });
    this.actor.fMouseInput.emitter.on("wheelDown", () => { console.log("wheel down", this.id); });
    
    let listener = () => { console.log("wheel down 2"); };
    this.actor.fMouseInput.emitter.on("onWheelDown", listener);
    this.actor.fMouseInput.emitter.removeListener("onWheelDown", listener);
  }
  
  onRightClick() {
    console.log("behavior onRightClick", this);
  }
  
  update() {
    if (Sup.Input.wasKeyJustReleased("SPACE"))
      this.actor.setVisible( !this.actor.getVisible() );
  }
}
Sup.registerBehavior(MouseInputBehavior);
