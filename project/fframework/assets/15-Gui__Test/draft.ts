
function fGuiTest() {
  let container = new fGui.Container(true, { className: "thecontainer" });
  
  let text = new fGui.Text("my text", { className: "mytext" });
  text.value = "150";
  text.label = "{{value}} : the text.";

  text.url = "#";

  let asset = Sup.get("My wall of text", fText);
  let text2 = new fGui.Text(asset.text, { className: "paragraph" });
  text2.on("click", function(){
    console.log("text clicked");
    
  });



  // button

  let button1 = new fGui.Button();

  let listener1 = function(e: fGui.Button) {
    console.log("button clicked", e.value);
  };
  let listener2 = function(e: fGui.Button) {
    console.log("button clicked agian", e.value);
  };
  let button = new fGui.Button("Click me !", "Clickme", {
    onClick: listener1,
  });
  button.on("click", listener2);
  //
  // button.removeListener("onClick", listener);


  //  input
  let input = new fGui.Input("text", "Your name:", { placeholder: "Please enter your" });
  input.on("change", function(i: fGui.Input) {
    console.log("text", i.value);
  });

  let input2 = new fGui.Input("number", "Your age: <br>", 27.5, { min: 0, max: 100, step: 0.5 });


  let box = new fGui.Checkbox("Chek if you are a human:", true);
  box.on("change", function(i: fGui.Checkbox) {
    console.log("box", i.isChecked);
  });

  let _onchange = function(e: fGui.Radio, ev) {
    console.log("radio change", e.value, e.isChecked)
  }

  let radio = new fGui.Radio("gender", "Male: ", true, { value: "male", onChange: _onchange } );

  let radio2 = new fGui.Radio("gender", "Female: ");
  radio2.value = "female";
  radio2.on("change", _onchange);

}
