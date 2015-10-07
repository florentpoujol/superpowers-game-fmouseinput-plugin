

function fGuiTest() {
  let container = new f.Gui.Container(true, { className: "thecontainer" });
    
  let text = new f.Gui.Text("my text", { className: "mytext" });
  text.value = "150";
  text.label = "{{value}} : the text.";

  text.url = "#";

  let asset = Sup.get("Gui/My wall of text", fText);
  let text2 = new f.Gui.Text(asset.text, { className: "paragraph" });
  text2.on("click", function(){
    console.log("text clicked");
    
  });



  // button

  let button1 = new f.Gui.Button();

  let listener1 = function(e: f.Gui.Button) {
    console.log("button clicked", e.value);
  };
  let listener2 = function(e: f.Gui.Button) {
    console.log("button clicked agian", e.value);
  };
  let button = new f.Gui.Button("Click me !", "Clickme", {
    onClick: listener1,
  });
  button.on("click", listener2);
  //
  // button.removeListener("onClick", listener);


  //  input
  let input = new f.Gui.Input("text", "Your name:", { placeholder: "Please enter your" });
  input.on("change", function(i: f.Gui.Input) {
    console.log("text", i.value);
  });

  let input2 = new f.Gui.Input("number", "Your age: <br>", 27.5, { min: 0, max: 100, step: 0.5 });


  let box = new f.Gui.Checkbox("Chek if you are a human:", true);
  box.on("change", function(i: f.Gui.Checkbox) {
    console.log("box", i.isChecked);
  });

  let _onchange = function(e: f.Gui.Radio, ev) {
    console.log("radio change", e.value, e.isChecked)
  }

  let radio = new f.Gui.Radio("gender", "Male: ", true, { value: "male", onChange: _onchange } );

  let radio2 = new f.Gui.Radio("gender", "Female: ");
  radio2.value = "female";
  radio2.on("change", _onchange);

}

function fGuiExample() {
    
  // simple text, with independant value
  let score = new f.Gui.Text("Score: ", 0);

  // link
  let link = new f.Gui.Text("More awesome games");
  link.url = "http://itch.io";

  // paragraph
  let asset = Sup.get("Gui/My wall of text", fText);
  let paragraph = new f.Gui.Text(asset.text);

  // button 
  let button = new f.Gui.Button("Click me !", "button1");
  button.on("click", function(i: f.Gui.Button) {
      console.log("Button '"+i.value+"' has been clicked"); // "Button 'button1' has been clicked 
  });

  //  number input
  let input = new f.Gui.Input("number", "Your age: ", 27, { 
      placeholder: "Please enter your age",
      min: 0,
      max: 100,
      onChange: function(i: f.Gui.Input) {
        console.log("New age", i.value);
      }
  });

  // checkbox
  let box = new f.Gui.Checkbox("Are you a human ? ", false);

  // radio
  let onGenderChange = function(i: f.Gui.Radio) {
      console.log("New gender set:", i.value)
  };

  let radio = new f.Gui.Radio("gender", "{{input}} Male", true, { value: "male", onChange: onGenderChange } );
  let radio2 = new f.Gui.Radio("gender", "{{input}} Female");
  radio2.value = "female";
  radio2.on("change", onGenderChange);
  
}

class fGuiBehavior extends Sup.Behavior {
  awake() {
    // fGuiTest();
    fGuiExample();
  }
}
Sup.registerBehavior(fGuiBehavior);
