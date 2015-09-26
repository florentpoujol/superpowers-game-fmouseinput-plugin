/// <_reference path="../gitignore/EventEmitter.d.ts" />

module f.Gui {
  /**
  * @private
  */
  let nextUniqueElementId: number = 1;

  // 
  /**
  * the list of JS properties on HTMLInputElement
  * @private
  */
  let inputProperties = ["autocomplete", "autofocus", "checked", "disabled", 
  "list", "max", "maxlength", "min", "multiple", "name", "pattern", "placeholder", 
  "readonly", "size", "step", "type", "value"];
  /* omitted properties
  accept, align, alt, height, required, src, width
  all fomr*
  */

  /**
  * `fGui`'s main container (`HTMLDivElement`), with the `fgui-main-container` id.
  */
  export let mainDomContainer = null;

  /**
  * @private
  */
  function _createMainContainer() {
    if (mainDomContainer !== null)
      return;

    mainDomContainer = window.document.createElement("div");
    window.document.body.appendChild(mainDomContainer);

    mainDomContainer.id = "fgui-main-container";
    mainDomContainer.style.position = "absolute";
    mainDomContainer.style.top = "0px";
    mainDomContainer.style.left = "0px";
    mainDomContainer.style.color = "white";
  }

  /**
  * Append the provided style (CSS string) to the page's head.
  * @returns The HTMLStyleElement element it creates.
  */
  export function addStyle(css: string)  {
    if (mainDomContainer === null)
      _createMainContainer();

    let elt = window.document.createElement("style");
    elt.type = "text/css";
    elt.innerHTML = css;
    window.document.head.appendChild(elt);
    return elt;
  }

  // --------------------------------------------------------------------------------

  /**
  * The base class of all `fGui`'s elements.
  */
  export class Element {
    /**
    * Creates a new DOM element and append it to the main container.
    * @param tagName - The name of the HTML tag to create.
    * @param type - The element's type. Usually its lowercase class name.
    * @param params - Some optional parameters.
    */
    constructor(tagName: string, type: string, params?: Params) {
      if (mainDomContainer === null)
        _createMainContainer();

      this._id = nextUniqueElementId++;
      this._type = type;

      this._domElement = window.document.createElement(tagName);
      this._domElement.className = "fgui-"+type;

      // set default container
      if (Container.openContainers.length > 0)
        this.container = Container.openContainers[Container.openContainers.length-1];
      else
        mainDomContainer.appendChild(this._domElement);

      if (params !== undefined)
        this.set(params);
    }

    /**
    * Set element's parameters in mass.
    * @param params - The element's parameters. See the "Params argument" chapter in the tutorial.
    */
    set(params: Params): void {
      for (let key in params) {
        let value = params[key];
        if (key === "className")
          this._domElement.className += " "+value;

        else if (key === "style" && typeof value === "object") {
          for (let cssProp in <Object>value)
            this._domElement.style[cssProp] = value[cssProp];
        }

        else if (key.slice(0, 2) === "on") 
          this.on(key, value);

        else if (this[key] !== undefined)
          this[key] = value;

        else if (this._domElement[key] !== undefined)
          this._domElement[key] = value;

        else if (this._domElement.style[key] !== undefined)
          this._domElement.style[key] = value;

        else
          console.warn("fGui.Element.set(): Don't know what to do with property '"+key+"' with value:", value, this);
      }
    }

    // ----------------------------------------

    private _domElement; // child of HTMLElement

    /**
    * The element's inner root DOM element.
    */
    set domElement(elt: any) {
      this._domElement = elt;
    }

    get domElement(): any {
      return this._domElement;
    }

    /**
    * Get an HTML element by class name among the children of the root element. <br>
    * The className must be relative to the element's base class name (the className of the root element).<br>
    * Ie for a text element: `text.getDomElement("label")` returns the span element containing the label.
    * @param className - The "relative" className of the element you want to retrieve.
    * @return An instance, child of HTMLElement.
    */
    getChildDomElement(className: string) { // returns child of HTMLElement
      return this._domElement.getElementsByClassName( "fgui-"+this._type+"-"+className )[0];
    }

    // ----------------------------------------
    
    private _emitter = new (<any>window).EventEmitter(); // provided by Sparklinlabs' eventEmitter plugin
    
    /**
    * The element's event emitter.
    */
    get emitter() {
      return this._emitter;
    }

    /**
    * Adds a new listener function for the specified event.
    * @param eventName - The event name. Can be "short", aka without the "on" prefix: "click" instead of "onClick".
    */
    on(eventName: string, listener: Listener): void {
      // turn "event" in "onEvent"
      if (eventName.slice(0, 2) !== "on")
        eventName = "on" + eventName.charAt(0).toUpperCase() + eventName.slice(1);
      this._emitter.addListener(eventName, listener);
      
      eventName = eventName.toLowerCase();
      if (this._domElement[eventName] === null) {
        this._domElement[eventName] = (function(event: any) {
          let eventName = "on"+event.type.charAt(0).toUpperCase() + event.type.slice(1);
          this.emitter.emit(eventName, this, event);
        }).bind(this);
      }
    }

    /**
    * Removes a listener function from the specified event.
    * @param eventName - The full event name (with the "on" prefix).
    */
    removeListener(eventName: string, listener: Listener): void {
      this.removeListener(eventName, listener);
    }

    // ----------------------------------------

    private _container: Container;

    /**
    * The element's container instance. <br>
    * Elements with no container are children of `fGui`'s main DOM container.
    */
    set container(container: Container) {
      if (container !== null)
        container.domElement.appendChild(this._domElement);
      else
        mainDomContainer.appendChild(this._domElement);
      this._container = container;
    }

    get container(): Container {
      return this._container;
    }

    // ----------------------------------------

    // The value of the DOM element's `style.display` property when he was hidden via `isDisplayed = false;`
    private _visibleDisplayType: string = null;
    
    /**
    * Set to `true` or `false` to display or hide the elemet. <br>
    * Change the value of the inner DOM element style `display` property. <br>
    */
    set isDisplayed(state: boolean) {
      if (state === true) {
        if (this._visibleDisplayType !== null) {
          this._domElement.style.display = this._visibleDisplayType;
          this._visibleDisplayType = null;
        }
      }
      else {
        let display = this._domElement.style.display;
        if (this._visibleDisplayType === null && display !== "none") {
          this._visibleDisplayType = display;
          this._domElement.style.display = "none";
        }
      }
    }

    get isDisplayed(): boolean {
      return (this._domElement.style.display !== "none");
    }

    // ----------------------------------------

    private _id: number = 0;

    /**
    * A positive integer as unique identifier. Readonly.
    */
    get id(): number {
      return this._id;
    }

    private _type: string = "element";

    /**
    * The element's type. Usually its lowercase class name. Readonly.
    */
    get type(): string {
      return this._type;
    }
  }

  // --------------------------------------------------------------------------------

  /**
  * A container (div) for other elements.
  *
  *     <div class="fgui-container">
  *     </div>
  */
  export class Container extends Element {
    /**
    * @param isOpen - Set to true or false to allow or prevent any elements created after that to be automatically added to this container.
    * @param params - Some optional parameters.
    */
    constructor(isOpen: boolean, params?: Params);
    constructor(params?: Params);

    constructor(isOpen: boolean|Params, params?: Params) {
      super("div", "container");
      this.domElement.style.position = "relative";
      this.domElement.style.overflow = "auto";
      if (typeof isOpen === "object") {
        params = <Params>isOpen;
        isOpen = null;
      }
      if (<boolean>isOpen === true)
        this.isOpen = true;
      if (params !== undefined)
        this.set(params);
    }

    // ----------------------------------------

    /**
    * The list of open containers, in the order they were openned.
    */
    static openContainers: Container[] = new Array<Container>();

    /**
    * Set to true or false to allow or prevent any elements created after that to be automatically added to this container.
    */
    set isOpen(isOpen: boolean) {
      if (isOpen === true && this.isOpen === false) {
        Container.openContainers.push(this);
      }
      else if (isOpen === false && this.isOpen === true) {
        let lastOpenContainer = Container.openContainers.pop();
        if (lastOpenContainer !== this) {
          Container.openContainers.push(lastOpenContainer);
          console.warn("fGui.Container.close(): Can't close this container because it is not the last open container. [this] [lastOpenContainer]", this, lastOpenContainer);
        }
      }
    }

    get isOpen(): boolean {
      return (Container.openContainers.indexOf(this) !== -1);
    }   
  }

  // --------------------------------------------------------------------------------

  /**
  * A (block) button with label and value.
  *
  *     <button class="fgui-button" value="[value]">
  *       [label]
  *     </button>
  */
  export class Button extends Element {
    /**
    * @param params - Some optional parameters.
    */
    constructor(label: string, value: string, params?: Params);
    constructor(label: string, params?: Params);
    constructor(params?: Params);

    constructor(label?: string|Params, value?: string|Params, params?: Params) {
      super("button", "button");
      this.domElement.style.display = "block";

      if (typeof label === "object") {
        params = <Params>label;
        label = null;
      }
      this.label = <string>label || "fGui.Button "+this.id;

      if (typeof value === "object") {
        params = <Params>value;
        value = null;
      }
      this.value = <string>value || "";

      if (params !== undefined)
        this.set(params);
    }

    // ----------------------------------------

    /**
    * The button's label. <br>
    * The DOM element's `innerHTML` value.
    */
    set label(label: string) {
      this.domElement.innerHTML = label || "";
    }

    get label(): string {
      return this.domElement.innerHTML;
    }

    // ----------------------------------------

    /**
    * The button's value. <br>
    * The DOM element's `value` attibute.
    */
    set value(value: string) {
      this.domElement.value = value || "";
    }

    get value(): string {
      return this.domElement.value;
    }
  }

  // --------------------------------------------------------------------------------

  /**
  * A paragraph with independant label and value.
  *
  *     <p class="fgui-text">
  *       <span class="fgui-text-label">[label]</span>
  *       <span class="fgui-text-value">[value]</span>
  *     </p>
  * 
  * Can be turned into a link.
  *
  *     <a class="fgui-text" href="[url]">
  *       <span class="fgui-text-label">[label]</span>
  *       <span class="fgui-text-value">[value]</span>
  *     </p>
  */
  export class Text extends Element {
    /**
    * @param params - Some optional parameters.
    */
    constructor(label: string, value: any, params?: Params);
    constructor(label: string, params?: Params);
    constructor(params?: Params);

    constructor(label?: string|Params, value?: any|Params, params?: Params) {
      super("p", "text");
      this.domElement.style.margin = "0";
      this.domElement.style.whiteSpace = "pre-line";

      this._labelDomElement = window.document.createElement("span");
      this._labelDomElement.className = "fgui-text-label";
      this.domElement.appendChild(this._labelDomElement);

      this._valueDomElement = window.document.createElement("span");
      this._valueDomElement.className = "fgui-text-value";
      this.domElement.appendChild(this._valueDomElement);

      if (typeof label === "object") {
        params = <Params>label;
        label = null;
      }
      this.label = <string>label || "fGui.Text "+this.id;

      if (typeof value === "object") {
        params = <Params>value;
        value = null;
      }
      if (value !== undefined && value !== null && value.toString !== undefined)
        value = value.toString();
      this.value = value || "";

      if (params !== undefined)
        this.set(<Params>params);
    }

    // ----------------------------------------

    private _labelDomElement; // HTMLSpanElement

    /**
    * The element's text. <br>
    * The span element's `innerHTML` value.
    */
    set label(label: string) {
      let result = /^([^{]*)?({{value}})?(.*)?$/.exec(label);
      if (result !== null) {
        label = result[1] || result[3];
        if (result[2] !== undefined) { // "{{value}}" is found in the label, change the structure
          this.domElement.removeChild(this._labelDomElement);
          // remove the label in case the value is the only element to display
          // the value element is now the first and only child of the p

          if (result[1] !== undefined) {
            // label is needed before the value
            this.domElement.insertBefore(this._labelDomElement, this._valueDomElement);
          }
          else if (result[3] !== undefined) {
            // label is needed after the value
            this.domElement.appendChild(this._labelDomElement);
          }
        }
      }
      this._labelDomElement.innerHTML = label || "";
    }

    get label(): string {
      return this._labelDomElement.innerHTML;
    }

    // ----------------------------------------

    private _valueDomElement; // HTMLSpanElement
    
    /**
    * The element's value. Accept any type castable to string but always returns a string.<br>
    * The span element's `innerHTML` value.
    */
    set value(value: any) {
      this._valueDomElement.innerHTML = value || "";
    }

    get value(): any {
      return this._valueDomElement.innerHTML;
    }

    // ----------------------------------------

    private _switchTextElement(tagName: string) {
      let elt = window.document.createElement(tagName);
      elt.style.whiteSpace = "pre-line";
      if (tagName === "a") {
        elt.style.display = "block";
        elt.style.color = "rgb(100,100,255)";
      }
      else
        elt.style.margin = "0";
      elt.className = this.domElement.className;
      let children = this.domElement.children;
      elt.appendChild(children[0]);
      elt.appendChild(children[0]);
      let parent = this.domElement.parentElement;
      parent.replaceChild(elt, this.domElement);
      this.domElement = elt;
    }

    /**
    * Turn the text into a link (a). <br>
    * The a element's `href` attribute.
    */
    set url(url: string) {
      if (url !== null) {
        if (this.domElement.nodeName !== "A")
          this._switchTextElement("a");
        this.domElement.href = url;
      }
      else {
        if (this.domElement.nodeName !== "P")
          this._switchTextElement("p");
      }
    }

    get url(): string {
      return this.domElement.href;
    }
  }

  // --------------------------------------------------------------------------------

  /**
  *     <label class="fgui-input-[type]">
  *       <span class="fgui-input-[type]-label">[label]</span>
  *       <input type="[type]" class="fgui-input-[type]-value" value="[value]" />
  *     </label>
  *
  * Even if the actual input element is nested inside a label element, you can set input properties (like `placeholder`) via the params argument.
  */
  export class Input extends Element {
    /**
    * @param type - The element's type.
    */
    constructor(type: string, label: string, value: any, params?: Params);
    constructor(type: string, label: string, params?: Params);
    constructor(type: string, params?: Params);
    constructor(params?: Params);

    constructor(type?: string|Params, label?: string|Params, value?: any, params?: Params) {
      if (typeof type === "object") {
        params = <Params>type;
        type = null;
      }
      type = <string>type || "text";
      let className = "input-"+type;
      
      super("label", className);

      this._labelTextDomElement = window.document.createElement("span");
      this._labelTextDomElement.className = "fgui-"+className+"-label";

      this._inputDomElement = window.document.createElement("input");
      this._inputDomElement.type = type;
      this._inputDomElement.className = "fgui-"+className+"-value";
      
      this.domElement.style.display = "block";
      this.domElement.appendChild(this._labelTextDomElement);
      this.domElement.appendChild(this._inputDomElement);

      // ----------------------------------------

      if (typeof label === "object") {
        params = <Params>label;
        label = null;
      }
      this.label = <string>label || "";

      if (typeof value === "object") {
        params = <Params>value;
        value = null;
      }
      this.value = <string>value || "";

      if (params !== undefined)
        this.set(params);
    }

    // ----------------------------------------

    set(params: Params): void {
      for (let key in params) {
        if (inputProperties.indexOf(key) !== -1) {
          this._inputDomElement[key] = params[key];
          delete params[key];
        }
      }

      super.set(params);
    }

    // ----------------------------------------

    on(eventName: string, listener: Listener): void {
      if (eventName.slice(0, 2) !== "on")
        eventName = "on" + eventName.charAt(0).toUpperCase() + eventName.slice(1);

      if (eventName === "onChange") {
        this.emitter.addListener(eventName, listener);
        
        eventName = "oninput";
        console.log(this.type);
        if (this.type === "input-checkbox" || this.type === "input-radio")
          eventName = "onchange";

        if (this.domElement[eventName] === null) {
          this.domElement[eventName] = (function(event: any) {
            this.emitter.emit("onChange", this, event);
          }).bind(this);
        }
      }
      else
        super.on(eventName, listener);
    }

    // ----------------------------------------

    private _inputDomElement; // HTMLInputElement
    private _labelTextDomElement; // HTMLSpanElement

    /**
    * The label's text. <br>
    * The span element's `innerHTML` value.
    */
    set label(label: string) {
      let result = /^([^{]*)?({{input}})?(.*)?$/.exec(label);
      if (result !== null) {
        label = result[1] || result[3];
        if (result[2] !== undefined) { // "{{input}}" is found in the text, change the structure
          this.domElement.removeChild(this._labelTextDomElement);
          // remove the text in case the value is the only element to display
          // the value element is now the first and only child of the p

          if (result[1] !== undefined) {
            // text is needed before the value
            this.domElement.insertBefore(this._labelTextDomElement, this._inputDomElement);
          }
          else if (result[3] !== undefined) {
            // text is needed after the value
            this.domElement.appendChild(this._labelTextDomElement);
          }
        }
      }
      this._labelTextDomElement.innerHTML = label || "";
    }

    get label(): string {
      return this._labelTextDomElement.innerHTML;
    }

    // ----------------------------------------

    /**
    * The element's value. <br>
    * The input element's `value` property.
    */
    set value(value: any) {
      this._inputDomElement.value = value || "";
    }

    get value(): any {
      return this._inputDomElement.value;
    }
  }

  // --------------------------------------------------------------------------------

  /**
  *     <label class="fgui-input-checkbox">
  *       <span class="fgui-input-checkbox-label">[label]</span>
  *       <input type="checkbox" class="fgui-input-checkbox-value" checked="[isChecked]" />
  *     </label>
  */
  export class Checkbox extends Input {
    /**
    * @param label - The label's text.
    * @param isChecked - The box's checked state.
    * @param params - Some optional parameters.
    */
    constructor(label: string, isChecked: boolean, params?: Params);
    constructor(label: string, params?: Params);
    constructor(params?: Params);

    constructor(label?: string|Params, isChecked?: boolean|Params, params?: Params) {
      super("checkbox");
      this._checkboxDomElement = this.domElement.getElementsByTagName("input")[0];
      
      if (typeof label === "object") {
        params = <Params>label;
        label = null;
      }
      this.label = <string>label || "";

      if (typeof isChecked === "object") {
        params = <Params>isChecked;
        isChecked = null;
      }
      this.isChecked = <boolean>isChecked || false;

      if (params !== undefined)
        this.set(params);
    }

    private _checkboxDomElement; // HTMLInputElement
    /**
    * The checkbox's checked state. <br>
    * The input element's `checked` property.
    */
    set isChecked(isChecked: boolean) {
      this._checkboxDomElement.checked = isChecked;
    }

    get isChecked(): boolean {
      return this._checkboxDomElement.checked;
    }
  }

  // --------------------------------------------------------------------------------

  /**
  *     <label class="fgui-input-radio">
  *       <span class="fgui-input-radio-label">[label]</span>
  *       <input type="radio" class="fgui-input-radio-value" checked=[isChecked] name=["name"] />
  *     </label>
  */
  export class Radio extends Input {
    /**
    * @param label - The label's text.
    * @param isChecked - The radio's checked state.
    * @param params - Some optional parameters.
    */
    constructor(name: string, label: string, isChecked: boolean, params?: Params);
    constructor(name: string, label: string, params?: Params);
    constructor(params?: Params);
    
    constructor(name?: string|Params, label?: string|Params, isChecked?: boolean|Params,  params?: Params) {
      super("radio");
      this._radioDomElement = this.domElement.getElementsByTagName("input")[0];

      if (typeof name === "object") {
        params = <Params>name;
        name = null;
      }
      this.name = <string>name || "";

      if (typeof label === "object") {
        params = <Params>label;
        label = null;
      }
      this.label = <string>label || "";

      if (typeof isChecked === "object") {
        params = <Params>isChecked;
        isChecked = null;
      }
      this.isChecked = <boolean>isChecked || false;

      if (params !== undefined)
        this.set(params);
    }

    private _radioDomElement; // HTMLInputElement
    /**
    * The radio's checked state. <br>
    * The input element's `checked` property.
    */
    set isChecked(isChecked: boolean) {
      this._radioDomElement.checked = isChecked;
    }

    get isChecked(): boolean {
      return this._radioDomElement.checked;
    }

    /**
    * The radio's name. <br>
    * The input element's `name` property.
    */
    set name(name: string) {
      this._radioDomElement.name = name;
    }

    get name(): string {
      return this._radioDomElement.name;
    }
  }

  // --------------------------------------------------------------------------------

  /**
  * Every constructors as well as the `set()` method accept a `params` argument which can contain any of the following: <br>
  * - The `fGui` instance's properties like `value`, `label`, `isChecked`, `container`... <br>
  * - Event name like `onClick`, `onChange`. You can add standard HTML events directly on the DOM element instance (so not via the params argument). <br>
  * - The DOM element's properties/attributes, like `id` or `className`. Note that the class(es) name(s) you may set via `className` are always _appended_ to the existing classes names existing on the element (some always exits, see below). <br>
  * - The DOM element's style (CSS properties). Note that it is way more practical to use a Text asset to write some CSS classes, add then to the game via `fGui.addStyle()` then set the element's `className` property.
  */
  export interface Params {
    [key:string]: any;
  }

  export interface Listener {
    /**
    * @param element - The `fGui` instance.
    * @param event - The HTML event.
    */
    (element: Element, event: any): void;
  }
}
