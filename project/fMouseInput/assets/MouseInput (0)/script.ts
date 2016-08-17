class MouseInputBehavior extends Sup.Behavior {
  id: number = 0;
  
  awake() { 
    
    this.actor.fMouseInput.emitter.addListener("mouseEnter", () => { Sup.log("enter", this.id); });
    this.actor.fMouseInput.emitter.on("mouseExit", () => { Sup.log("out", this.id); });
    this.actor.fMouseInput.emitter.on("mouseMove", (mouseDelta) => { Sup.log("move", this.id, mouseDelta); });
      
    
    this.actor.fMouseInput.emitter.on("leftClickPressed", () => { Sup.log("left click pressed", this.id); });
    this.actor.fMouseInput.emitter.on("leftClickDown", () => { Sup.log("left click down", this.id); });
    this.actor.fMouseInput.emitter.on("leftClickReleased", () => { Sup.log("left click release", this.id); });

    this.actor.fMouseInput.emitter.on("middleClickPressed", () => { Sup.log("middle click pressed", this.id); });      
    this.actor.fMouseInput.emitter.on("middleClickDown", () => { Sup.log("middle click down", this.id); });  
    this.actor.fMouseInput.emitter.on("middleClickReleased", () => { Sup.log("middle click released", this.id); });  
    
    this.actor.fMouseInput.emitter.on("rightClickPressed", () => { Sup.log("right click pressed", this.id); });
    this.actor.fMouseInput.emitter.on("rightClickDown", () => { Sup.log("right clickdown", this.id); });
    this.actor.fMouseInput.emitter.on("rightClickReleased", ()=>{ this.onRightClickReleased() });

    this.actor.fMouseInput.emitter.on("wheelUp", () => { Sup.log("wheel up", this.id); });
    this.actor.fMouseInput.emitter.on("wheelDown", () => { Sup.log("wheel down", this.id); });
    
    let listener = () => { Sup.log("wheel down", this.id); };
    this.actor.fMouseInput.emitter.on("wheelDown", listener);
    this.actor.fMouseInput.emitter.removeListener("wheelDown", listener);
    
  }
  
  onRightClickReleased() {
    Sup.log("right click released", this.id);
  }
  
  update() {
    if (Sup.Input.wasKeyJustReleased("SPACE"))
      this.actor.setVisible( !this.actor.getVisible() );
  }
}
Sup.registerBehavior(MouseInputBehavior);
