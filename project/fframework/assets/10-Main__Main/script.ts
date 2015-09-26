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
    
    let cleanScene = function() {
      root.destroy();
      root = new Sup.Actor("Root");
      root.setPosition(0,0,0);
      
//       let container = document.getElementById("fGui-main-container");
      let container = f.Gui.mainDomContainer;
      if (container != null)
        container.innerHTML = "";
      
//       let children = root.getChildren();
//       for (let child of children)
//         child.destroy();
    }
    
    let menu = {
      "Lang": function() {
        cleanScene();
        root.addBehavior(fLangBehavior);
      },
      
      "Mouseinput": function() {
        cleanScene();
        Sup.appendScene("MouseInput/Scene", root);
      },
      "Gui": function() {
        cleanScene();
        root.addBehavior(fGuiBehavior);
      }
    };
    
    
    let gui = new dat.GUI();
    for (let key in menu)
      gui.add(menu, key);
  }

  update() {
    
  }
}
Sup.registerBehavior(MainBehavior);
