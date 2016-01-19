class MouseInputBehavior extends Sup.Behavior {
  id: number = 0;
  
  awake() { 
    
    this.actor.fMouseInput.emitter.addListener("mouseEnter", () => { console.log("enter", this.id); });
    this.actor.fMouseInput.emitter.addListener("mouseExit", () => { console.log("out", this.id); });
    // this.actor.fMouseInput.on("mouseMove", (mouseDelta) => { console.log("move", this.id, mouseDelta); });
      
    
    this.actor.fMouseInput.on("leftClickPressed", () => { console.log("left click pressed", this.id); });
    this.actor.fMouseInput.on("leftClickDown", () => { console.log("left click down", this.id); });
    this.actor.fMouseInput.on("leftClickReleased", () => { console.log("left click release", this.id); });

    this.actor.fMouseInput.on("middleClickPressed", () => { console.log("middle click pressed", this.id); });      
    this.actor.fMouseInput.on("middleClickDown", () => { console.log("middle click down", this.id); });  
    this.actor.fMouseInput.on("middleClickReleased", () => { console.log("middle click released", this.id); });  
    
    this.actor.fMouseInput.on("rightClickPressed", () => { console.log("right click pressed", this.id); });
    this.actor.fMouseInput.on("rightClickDown", () => { console.log("right clickdown", this.id); });
    this.actor.fMouseInput.on("rightClickReleased", ()=>{ this.onRightClickReleased() });

    this.actor.fMouseInput.on("wheelUp", () => { console.log("wheel up", this.id); });
    this.actor.fMouseInput.on("wheelDown", () => { console.log("wheel down", this.id); });
    
    let listener = () => { console.log("wheel down", this.id); };
    this.actor.fMouseInput.on("wheelDown", listener);
    this.actor.fMouseInput.off("wheelDown", listener);
    
  }
  
  onRightClickReleased() {
    console.log("right click released", this.id);
  }
  
  update() {
    if (Sup.Input.wasKeyJustReleased("SPACE"))
      this.actor.setVisible( !this.actor.getVisible() );
  }
}
Sup.registerBehavior(MouseInputBehavior);
