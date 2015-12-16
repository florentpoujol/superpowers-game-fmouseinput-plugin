let divConsole: any = {};

class MouseInputBehavior extends Sup.Behavior {
  awake() {
    
    this.actor.fMouseInput.eventEmitter.addListener("onMouseMove", () => { console.log("mouse move"); divConsole.write("mouse move")});
    this.actor.fMouseInput.eventEmitter.addListener("onLeftClick", () => { 
      console.log("click");
      divConsole.write(".    click")
      // this.actor.setVisible(false);
    });
    this.actor.fMouseInput.eventEmitter.addListener("onRightClick", () => { console.log("right click"); divConsole.write(".    right click")});
    this.actor.fMouseInput.eventEmitter.addListener("onMouseEnter", () => { console.log("enter"); divConsole.write(".    enter")});
    this.actor.fMouseInput.eventEmitter.addListener("onMouseExit", () => { console.log("out"); divConsole.write(".    out    ")});
  }
  
  start() {
    let elt = document.createElement("div");
    document.body.appendChild(elt);
    
    elt.style.position = "absolute";
    elt.style.top = "10px";
    elt.style.left = "10px";
    elt.style.minWidth = "200px";
    elt.style.height = "50%";
    elt.style.color = "white";
    elt.style.overflow = "auto";
    
    divConsole.lineCount = 0;
    divConsole.elt = elt;
    divConsole.write = function(s: any) {
      let elt = document.createElement("div");
      elt.innerHTML = (divConsole.lineCount++)+" "+s;
      divConsole.elt.appendChild(elt);
      divConsole.elt.scrollTop = divConsole.elt.scrollHeight;
    }
  }
  
  update() {
    if (Sup.Input.wasKeyJustReleased("SPACE"))
      this.actor.setVisible( !this.actor.getVisible() );
  }
}
Sup.registerBehavior(MouseInputBehavior);
