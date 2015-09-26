# Superpowers fGUI plugin

`fGUI` makes it super easy to create simple GUIs for Superpowers games, with HTML/CSS.

The `fGUI` module provide several easy to use classes that controls elements like texts, buttons, inputs, checkbox, etc...

While the classes are rather barebone to keep things simple, you have access to the underling DOM elements if you want to get more out of your GUIs.

Similarly, you have the full power of CSS to style your GUIs.  
Using Text assets, you can easily write and re-use styles between projects, or even share them with the community.
And if you don't feel like creating a whole style from scratch yourself, you can just import one !

- Read below for a tutorial and detailed explanations.
- Or dive into the reference with the links on the left.
- [Or go back to the repository.](https://github.com/florentpoujol/superpowers-fgui-plugin)

## Create lines or paragraphs of text and links

    let score = new fGui.Text("Score: ", 0);

This will display `Score: 0` on screen.

As many elements, a text as two parts: the __label__ and the __value__. You can change any of the two independently.

By default, the value is on the right of the label.  
Write `{{value}}` in the label's text (on its right or left) __once__ to change the position of value relative to the label's text.  
You can then update the value or the label's text without worring about the text's layout.

    let score = new fGui.Text("{{value}} whatever", 0); 
    score.label = " points";
    score.value = 10;

This will display `10 points`.

The label's or value's content may be HTML, so you may make the text wrap to the next line with `<br>` tags.

But standard line breaks will also makes the text wrap to the next line, so you have nothing more to do to create paragraph instead of simple lines.

## Links

Just set the `url` property to turn the text into a standard link:

    let link = new fGui.Text("More awesome games");
    link.url = "http://itch.io";


## Create buttons
    
    let button = new fGui.Button("Click here", "button1");

    // add a listener for the onClick event
    let onClick = function(buttonInstance: fGui.Button) {
        console.log("Button "+buttonInstance.value+" has been clicked!");
    }
    button.on("click", onClick);

This will print `Button 'button1' has been clicked!` in the console when the button `"Click here"` is clicked.

You can remove a listener with `removeListener()`. The full event name is expected as first argument, not just the short event name as with the `on()` mehtod:
    
    button.removeListener("onClick", onClick);

## Create inputs

Text: 

    let playerName = new fGui.Input("text", "Your name: ", { placeholder: "Enter your name" });

    // add a listener for the onChange event
    // emited when the value in the field changes
    let onChange = function(i: fGui.Input) {
        console.log("The new player name is ", i.value);
    }
    playerName.on("change", onChange);

Number:

    let playerAge = new fGui.Input("number", "{{input}} your age", { 
        min: 10,
        max: 100,
        onChange: function(i: fGui.Input) {
            console.log("The new player age is ", i.value);
        }
     });

As for the text, you can set the input's label on the right or left of the label's text. Write `{{input}}` on the right or left of the label's text.  
This works for any input types.

The `onChange` event is only emitted on user input. Setting a new value or checked state (see below) doesn't emit it.  
But you can emit it manually like so:

    playerAge.emitter.emit("onChange");


### Checkboxes

    let checkbox = new fGui.Checkbox("{{input}} Just check this because why not.");
    // check if the checkbox is checked with the isChecked property
    // if (checkbox.isChecked === true) { ...

You can also listen for the `onChange` event via the `on()` method or the `params` argument.

### Radios
    
    let onChange = function(i: fGui.Input) {
        console.log("The player has chosen another side:", i.value);
    }
    
    let zergRadio = new fGui.Radio("side", "Zerg:", true, { value: "zerg", onChange: onChange });
    
    let protosRadio = new fGui.Radio("side", "Protos:", { value: "protos" });
    protosRadio.on("change", onChange);
    
    let terranRadio = new fGui.Radio("side", "Terran:", { value: "terran"});
    terranRadio.value = "terran";
    terranRadio.on("change", onChange);
    terranRadio.isChecked = true; // Terran becomes the radio checked by default

The `onChange` event is only emitted on the radio that is newly checked.

## Create containers

Containers allows to group your elements and style them together since nested element shares the styles of theirs parent thery don't overrite themselves.

### Adding objects (children) to containers

You can add and remove children to/from a container in two ways:

#### - element.container property

Every objects, including containers have a `container` property you can use to get/set their container.

    let container = new fGui.Container();

    let text = new fGui.Text("my text", {
      container: container
    });
    // or
    text.container = container;

    // To remove it from the container
    text.container = null;

#### - container.isOpen property

Containers also have an `isOpen` property.  
All elements created when a container is open (when the property is set to `true`) are automatically added to the container.  

    container.isOpen = true;

    let text = new fGui.Text("I am inside the container!");
    let text2 = new fGui.Text("I am inside the container, too!");

    container.isOpen = false;

    let text3 = new fGui.Text("Boo, the container is closed, I am not inside it!");

It is possible to nest containers:

    container1.isOpen = true;
    // inside container1

    let container2 = new fGui.Container();
    // container2 itself is created inside container1

    container2.isOpen = true;
    // inside container2
    container2.isOpen = false

    // inside container1
    container.isOpen = false;


## The params argument

Every constructors as well as the `set()` method accept a `params` argument which can contain any of the following:

- The `fGui` instance's properties like `value`, `label`, `isChecked`, `container`...

- Event name like `onClick`, `onChange`. You can add standard HTML events directly on the DOM element instance (so not via the params argument).

- The DOM element's properties/attributes, like `id` or `className`. Note that the class(es) name(s) you may set via `className` are always _appended_ to the existing classes names existing on the element (some always exits, see below).

- The DOM element's style (CSS properties). Note that it is way more practical to use a Text asset to write some CSS classes, add then to the game via `fGui.addStyle()` then set the element's `className` property.



## HTML structure of the elements

All `fGui` elements are rendered by one or several standard HTML elements.

You can get the root element via the `domElement` property.

    let checkbox = new fGui.Checkbox("whatever");
    let elt = checkbox.domElement;
    // elt is now an HTMLLabelElement instance

All elements (including containers) are always children of a container or `fGui`'s  main container.

You can find below the struture of the HTML elements created when you instanciate one of every `fGui` elements all inside a container:

    <div id="fgui-main-container">
        
        <!-- container -->
        <div class="fgui-container [className]">

            <!-- text -->
            <p class="fgui-text [className]">
                <span class="fgui-text-label">[label]</span>
                <span class="fgui-text-value">[value]</span>
            </p>
            <!-- or when it's a link: -->
            <a class="fgui-text [className]" href="[url]">
                <span class="fgui-text-label">[label]</span>
                <span class="fgui-text-value">[value]</span>
            </a>

            <!-- button -->
            <button class="fgui-button [className]" value="[value]">
                [label]
            </button>

            <!-- input -->
            <label class="fgui-input-[type] [className]">
                <span class="fgui-input-[type]-label">[label]</span>
                <input type="[type]" class="fgui-input-[type]-value" value="[value]" />
            </label>

            <!-- checkbox -->
            <label class="fgui-input-checkbox [className]">
                <span class="fgui-input-checkbox-label">[label]</span>
                <input type="checkbox" class="fgui-input-checkbox-value" checked="[isChecked]" />
            </label>

            <!-- radio -->
            <label class="fgui-input-radio [className]">
                <span class="fgui-input-radio-label">[label]</span>
                <input type="radio" class="fgui-input-radio-value" name=["name"] checked="[isChecked]" />
            </label>

        </div>

    </div>

## Style

Use the `fGui.addStyle()` function to append some CSS string to the game's `head` tag.  
[A text asset is the best place](https://github.com/florentpoujol/superpowers-text-asset-plugin) (actually, the only one) to write chucks of CSS.

This, plus setting additional classes to your elements is a very practical way to improve the looks of your GUIs.

Most of `fGui`'s elements have a default style applied when they are created or modified: 
    
    /* <div> */
    #fgui-main-container {
        position: absolute;
        top: 0px;
        left: 0px;
        color: white;
    }

    /* <div> */
    .fgui-container {
        position: relative;
        overflow: auto;
    }

    .fgui-text {
        white-space: pre-line;

        /* when <p> */
        margin: 0;
        
        /* when <a> */
        display: block;
        color: rgb(100,100,255);
    }

    /* <button> */
    .fgui-button {
        display: block;
    }

    /* <label> */
    .fgui-input-[type],
    .fgui-input-checkbox,
    .fgui-input-radio {
        display: block;
    }
