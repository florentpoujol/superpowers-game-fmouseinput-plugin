let divConsole:any = {};

class MainBehavior extends Sup.Behavior {
  awake() {
    let elt = document.createElement("div");
    document.body.appendChild(elt);
    
    elt.style.position = "absolute";
    elt.style.top = "1s0px";
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
    
    
    let root = Sup.getActor("Root");
    let currentBehavior: any;
    
    let cleanScene = function() {
      root.destroy();
      root = new Sup.Actor("Root");
      root.setPosition(0,0,0);
      
      if (currentBehavior != null) {
        currentBehavior.onCleanScene();
        currentBehavior = null;
      }
      
      divConsole.elt.innerHTML = "";
      
      let container = fGui.mainDomContainer;
      if (container != null)
        container.innerHTML = "";
    }
    
    
    let menu = {
      "Mouseinput": function() {
        cleanScene();
        Sup.appendScene("MouseInput/Scene", root);
      },
    };
    
    
    let gui = new dat.GUI();
    for (let key in menu)
      gui.add(menu, key);
  }
}
Sup.registerBehavior(MainBehavior);
