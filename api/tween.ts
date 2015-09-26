
module f.Tween {

  /**
  * @private
  */
  var shortEventNames = [ "start", "pause", "resume", "update", "loopComplete", "complete", "stop" ];

  /**
  * @private
  */
  var eventNames = [ "onStart", "onPause", "onResume", "onUpdate", "onLoopComplete", "onComplete", "onStop" ];

  /**
  * @private
  */
  var copyObject = function(source: Object): any {
    var dest: any = {};
    for (var property in source) {
      dest[ property ] = source[ property ];
    }
    return dest;
  }

  /**
  * The object containing the easing functions segregated into families (ie: `f.Tween.Easing.Cubic`) and variants (ie: `f.Tween.Easing.Cubic.In`).
  */
  export var Easing = (<any>FTWEEN).Easing;
  
  /**
  * The object containing the interpolation functions (ie: `f.Tween.Interpolation.Cubic`).
  */
  export var Interpolation = (<any>FTWEEN).Interpolation;

  export class Tween {
    /**
    * Returns an instance of `f.Tween.Tween`.
    * @param from The object containing the start values.
    * @param to The object containing the end values.
    * @param duration The time in seconds to complete the tween.
    * @param params An object containing parameters.
    * @returns The tween instance.
    */
    constructor( from: Object, to: Object, duration: number, params?: Params );
    constructor( to: Object, duration: number, params?: Params );
    constructor( params: Params );
    constructor();
    
    /**
    * @param time The time in seconds to complete the timer. Setting the `time` property makes the `from`, `to` and `duration` being ignored.
    * @param onComplete The listener for the `onComplete` event.
    */
    constructor( time: number, onComplete: Callback, params?: Params );

    constructor( ...args: any[] ) {
      var argsCount = args.length;
      var types: string[] = [];
      for ( var i=0; i<argsCount; i++ ) {
        types[i] = typeof args[i];
      }
      var params: any = {};

      if ( (argsCount === 3 || argsCount === 4) && types[0] === "object" && types[1] === "object" && types[2] === "number" ) {
        params = args[3] || {};
        params.from = args[0];
        params.to = args[1];
        params.duration = args[2];
      }
      else if ( (argsCount === 2 || argsCount === 3) && types[0] === "object" && types[1] === "number" ) {
        params = args[2] || {};
        params.to = args[0];
        params.duration = args[1];
      }
      else if ( (argsCount === 2 || argsCount === 3) && types[0] === "number" && types[1] === "function" ) {
        params = args[2] || {};
        params.time = args[0];
        params.onComplete = args[1];
      }
      else if ( argsCount === 1 && args[0] !== null && typeof args[0] === "object") {
        params = args[0] || {};
      }
      else if (argsCount > 0) {
        console.error( "f.Tween.Tween(): Unknow constructor with "+argsCount+" arguments, see details below" );
        for (var i = 0; i < args.length; i++) {
          console.log( "argument #"+i+": type="+types[i]+" value=", args[i]);
        }
      }

      if (params.onComplete === undefined) {
        var self = this;
        this.__inner.onComplete( function() { 
          self._isComplete = true; 
          if (self._destroyOnComplete === true)
            self.destroy();
        } );
      }

      var start = params.start;
      delete params.start;
      
      if ( Object.keys( params ).length > 0 ) {
        this.set( params );
      }

      if ( this._to !== undefined && this._duration > 0 &&
        (start === undefined || start >= 0) ) {
        this.start( start );
      }
    }

    // --------------------------------------------------------------------------------
    // methods

    /**
    * Sets several of the tweener's properties at once.
    * @param params The list of parameters.
    */
    set( params: Params ) {
      params = copyObject( params );

      if ( params.from !== undefined ) {
        this.from = params.from;
        delete params.from;
      }
      if ( params.to !== undefined ) {
        this.to = params.to;
        delete params.to;
      }
      
      var start = params.start;
      delete params.start;
      
      for ( var key in params ) {
        if ( eventNames.indexOf( key ) !== -1 ) {
          this.on( key, params[ key ] )
        }
        else {
          // TODO FIXME: can a local property can be set this way ?
          this[ key ] = params[ key ];
        }
      }

      if ( typeof start === "number" && start >= 0 ) {
        this.start( start );
      }
    }

    /**
    * Make the provided callback be called when the specified event occurs.
    * @param eventName The event name.
    * @param callback The callback function.
    * @returns The tween instance.
    */
    on( eventName: "onStart", callback?: Callback ): Tween;
    on( eventName: "onPause", callback?: Callback ): Tween;
    on( eventName: "onResume", callback?: Callback ): Tween;
    on( eventName: "onUpdate", callback?: UpdateCallback ): Tween;
    on( eventName: "onLoopComplete", callback?: LoopCompleteCallback ): Tween;
    on( eventName: "onComplete", callback?: Callback ): Tween;
    on( eventName: "onStop", callback?: Callback ): Tween;
    on( eventName: string, callback?: Function ): Tween;

    on( eventName: string, callback?: Function ): Tween {
      var eventPos = shortEventNames.indexOf( eventName );
      eventName = eventNames[ eventPos ] || eventName; // transform short event name in "long" name or leave it as it is.
      if ( eventNames.indexOf( eventName ) === -1 ) {
        console.error( "f.Tween.Tween.on(): ERROR: wrong event name: "+eventName+". Expected values are:", shortEventNames, eventNames );
        return;
      }
      if (callback === undefined)
        callback = null;
      if (eventName === "onComplete") {
        var userCallback = callback;
        var self = this;
        callback = function() {
          self._isComplete = true;
          if (userCallback !== null)
            userCallback.call( this );
          if (self._destroyOnComplete === true)
            self.destroy();
        };
      }
      this.__inner[ eventName ]( callback );
      return this;
    }

    /**
    * Starts the tween. <br>
    * Tweens are automatically started after their creation if the duration and the `to` object are supplied. You can prevent this by setting the `start` property to a negative value in the constructor's `params` argument. 
    * @param time The time (a timetamp in milliseconds) at which to start the tween.
    */
    start( time?: number ) {
      if ( this._to === undefined || this._duration === 0  ) {
        console.log( "f.Tween.Tween.start(): ERROR: Can't start the tweener now because The 'to' object and/or the duration have not been set: ", this._to, this._duration );
        return;
      }

      if ( this._from === undefined ) {
        this.from = {};
      }

      this._isComplete = false;
      if ( time !== undefined ) {
        if ( time < 0 ) {
          time = 0
        }
      }
      this.__inner.start( time );
    }

    /**
    * Pause the tween, stopping the update of its values.
    */
    pause() { 
      this._isPaused = true;
      this.__inner.pause(); 
    }

    /**
    * Resume the tween after it has been paused, resuming the update of its values where they have been paused.
    */
    resume() { 
      this._isPaused = false;
      this.__inner.resume(); 
    }

    /**
    * Stop the tween, stopping the update of its values.  <br>
    * A stopped tween can not be resumed, but can be restarted by calling start() again, with unpredictable results.
    */
    stop() { this.__inner.stop(); }
    
    /**
    * Stop the tween and all its chained tweens then remove all its listeners and de-reference as much objects as possible to let them be garbage collected.
    */
    destroy() {
      this.__inner.destroy();
      this.__inner = null;
      this._from = null;
      this._to = null;
      this._isDestroyed = true;
    }

    /**
    * Check that the provided value is not too big. <br>
    * If that's the case, suppose that it is a number of milliseconds instead of seconds and display a warning. <br>
    * Called by duration, delay and time setters.
    * @param value The value.
    * @param propName The name of the evaluated property.
    */
    private _checkMilliseconds( value: number, propName: string ) {
      if ( value >= 500 ) {
        console.log( "f.Tween."+propName+": WARNING: The provided value '"+value+"' is superior to 500! The value has to be expressed in seconds, not in milliseconds. Are you sure you didn't meant the value to be '"+value/1000+"' seconds instead ?" );
      }
    }

    // --------------------------------------------------------------------------------
    // properties

    /**
    * The `FTWEEN.Tween` instance that actually perform the tweening.
    */
    private __inner = new (<any>FTWEEN).Tween();

    private _to: Object;
    /**
    * The `to` object containing the end values.
    */
    set to( to: Object ) {
      this._to = to;
      this.__inner.to( to );
    }
    get to(): Object { return this._to; }


    private _duration: number = 0;
    /**
    * The time in seconds to complete the tween.
    */
    set duration( duration: number ) {
      if ( duration < 0 ) {
        duration = 0
      }
      this._checkMilliseconds( duration, "duration" );
      this.__inner.duration( duration * 1000 );
      this._duration = duration;
    } 
    get duration(): number { return this._duration; }


    /**
    * The time in seconds to complete the timer. Setting the `time` property makes the `from`, `to` and `duration` being ignored.
    */
    set time( time: number ) {
      if ( time < 0 ) {
        time = 0
      }
      this._checkMilliseconds( time, "time" );
      this.from = { elapsedTime: 0, remainingTime: time };
      this.to = { elapsedTime: time, remainingTime: 0 };
      this.duration = time;
    }
    get time(): number { return this._duration; }


    private _from: Object; // from has to exist but is completely optionnal
    /**
    * The `from` object containing the start values.
    */
    set from( from: Object ) {
      this._from = from;  
      this.__inner.from( from );
    }
    get from(): Object { return this._from; }


    private _isRelative: boolean = false;
    /**
    * Tell whether to consider number values in the to object as relative (true) or absolute (false). <br>
    * Default is `false`.
    */
    set isRelative( isRelative: boolean ) { 
      this.__inner.isRelative( isRelative );
      this._isRelative = isRelative; 
    }
    get isRelative(): boolean { return this._isRelative; }


    private _delay: number = 0;
    /**
    * The time in milliseconds before the tween's values actually starts to updates after the tween has been started. <br>
    * Default is `0`.
    */
    set delay( delay: number ) { 
      if ( delay < 0 ) {
        delay = 0;
      }
      this._checkMilliseconds( delay, "delay" );
      this.__inner.delay( delay * 1000 );
      this._delay = delay;
    } 
    get delay(): number { return this._delay; }


    private _repeat: number = 0;
    /**
    * The number of times the tween will repeat, after having completed once. <br>
    * Settings `x` repeats is the same as setting `x+1` loops. <br>
    * Default is `0`.
    */
    set repeat( repeat: number ) { 
      if ( repeat < 0 ) {
        repeat = 0;
      }
      this.__inner.repeat( repeat );
      this._repeat = repeat; 
    }
    get repeat(): number { return this._repeat; }


    /**
    * The total number of times the tween will run. <br>
    * Settings `x` loops is the same as setting `x-1` repeats. <br>
    * Default is `1`.
    */
    set loops( loops: number ) { 
      if ( loops < 1 ) {
        loops = 1;
      }
      this._repeat = loops - 1; 
      this.__inner.repeat( this._repeat );
    }
    get loops(): number { return this._repeat + 1; }


    private _yoyo: boolean = false;
    /**
    * After having completed once and when repeat is strictly positive, tell whether the tween restart from its original state (false) (from 'from' to 'to', and repeat) or its current state (true) (from 'from' to 'to', then from 'to' to 'from', and repeat). <br>
    * Default is `false`.
    */
    set yoyo( yoyo: boolean ) { 
      this.__inner.yoyo( yoyo );
      this._yoyo = yoyo; 
    }
    get yoyo(): boolean { return this._yoyo; }


    private _easing: EasingFunction = null;
    /**
    * The easing function to use.
    * Default is `f.Tween.Easing.Linear.None`.
    */
    set easing(fn: EasingFunction) { 
      this._easing = fn; 
      this.__inner.easing(this._easing);

      var fnName: string = null;
      if (fn !== null) {
        for (var familly in f.Tween.Easing) {
          for (var variant in f.Tween.Easing[familly]) {
            if (fn === f.Tween.Easing[familly][variant]) {
              fnName = familly+variant;
              break;
            }
          }
        }
        if (fnName === null)
          console.warn("f.Tween.Tween.easing property: An easing function has been set but it wasn't found in the f.Tween.Easing object. It is required if you want to set it by name, or get its name via the f.Tween.Tween.easingName property.");
      }
      this._easingName = fnName;
    }
    get easing(): EasingFunction { return this._easing; }


    private _easingName: string = null;
    /**
    * The name of the easing function to use, its "path" in the `f.Tween.Easing` object. <br>
    * The name is composed of the familly followed by the variant. The `"None"` variant is optional. <br>
    * Ie: `"QuadraticIn"` `"CircularInOut"` `"Linear"` `"LinearNone"`
    * Default is `"LinearNone"`.
    */
    set easingName(name: string) {
      name = name.charAt(0).toUpperCase() + name.slice(1); // make sure first letter is uppercase
      var result = /^([_A-Z]{1}[a-z0-9_-]+)(([A-Z]{1}.+)?)$/.exec(name);
      if (result !== null) {

        var familly: Object = f.Tween.Easing[ result[1] ]; // if result isn't null, there is no reason the familly should be null, undefined or ""
        if (familly !== undefined) {

          var variant: string = result[2] || "None"; // if the variant is not supplied, result[2] === ""
          var fn: EasingFunction = familly[variant];

          if (fn !== undefined) {
            this._easing = fn; 
            this.__inner.easing(this._easing);
            this._easingName = name;
            return;
          }
        }
      }
      console.warn("f.Tween.Tween.easingName property: No easing function found for name '${name}'. Nothing has been done.", result);
    }
    get easingName(): string { return this._easingName; }


    private _interpolation: InterpolationFunction = null;
    /**
    * The interpolation function to use. <br>
    * Default is `f.Tween.Interpolation.Linear`.
    */
    set interpolation(fn: InterpolationFunction) {
      this._interpolation = fn;
      this.__inner.interpolation(this._interpolation);

      var fnName: string = null;
      if (fn !== null) {
        for (var _fnName in f.Tween.Interpolation) {
          if (fn === f.Tween.Interpolation[_fnName]) {
            fnName = _fnName;
            break;
          }
        }
        if (fnName === null)
          console.warn("f.Tween.Tween.interpolation property: An interpolation function has been set but it wasn't found in the f.Tween.Interpolation object. It is required if you want to set it by name, or get its name via the f.Tween.Tween.interpolationName property.");
      }
      this._interpolationName = fnName;
    }
    get interpolation(): InterpolationFunction { return this._interpolation; }


    private _interpolationName: string = null; // "name" of the interpolation function in the f.Tween.Interpolation object.
    /**
    * The name of interpolation function to use, its key in the `f.Tween.Interpolation` object. <br>
    * Default is `"Linear"`.
    */
    set interpolationName(name: string) {
      name = name.charAt(0).toUpperCase() + name.slice(1); // make sure first letter is uppercase
      var fn = f.Tween.Interpolation[name];
      if (fn !== undefined) {
        this._interpolation = fn; 
        this.__inner.interpolation(this._interpolation);
        this._interpolationName = name;
      }
      else     
        console.error("f.Tween.Tween.interpolationName property: No interpolation function found in the f.Tween.Interpolation object for name '${name}'.");
    }
    get interpolationName(): string { return this._interpolationName; }


    private _isPaused: boolean = false;
    /**
    * The tween's paused state. Use the `pause()` and `resume()` methods to control the paused state. <br>
    * Default is `false`.
    */
    get isPaused(): boolean { return this._isPaused; }


    // (re)set to false in start()
    // set to true in the onComplete callback set in the constructor
    private _isComplete: boolean = false; 
    /**
    * The tween's completed state.
    * Default is `false`.
    */
    get isComplete(): boolean { return this._isComplete; }


    private _destroyOnComplete: boolean = true;
    /**
    * Tell whether to destroy the tween once it has completed (true), or not (false). <br>
    * Default is `true`.
    */
    set destroyOnComplete( destroyOnComplete: boolean ) {
      this._destroyOnComplete = destroyOnComplete;
    }
    get destroyOnComplete(): boolean { return this._destroyOnComplete; }


    private _isDestroyed: boolean = false; 
    /**
    * The tween's destroyed state. Call destroy() to destroy a tween and free some objects for GC. <br>
    * Default is `false`.
    */
    get isDestroyed(): boolean { return this._isDestroyed; }

  } // end of f.Tween.Tween class

  // ----------------------------------------

  /**
  * Signature for the easing functions. All available easing functions can be found inside the `f.Tween.Easing` object.
  */
  export interface EasingFunction {
    /**
    * @param k The progression toward the end (between 0 and 1).
    * @returns The eased progression (between 0 and 1), taking the easing into account.
    */
    (k: number): number;
  }

  /**
  * Signature for the interpolation functions. All available interpolation functions can be found inside the `f.Tween.Interpolation` object.
  */
  export interface InterpolationFunction {
    /**
    * @param v The list of values to interpolate through.
    * @param k The progression toward the end (between 0 and 1).
    * @returns The interpolatied value.
    */
    (v: number[], k: number): number;
  }

  /**
  * Signature for all callbacks except `onUpdate`, to be set via the `f.Tween.Tween.on()` function.
  */
  export interface Callback {
    (): void;
  }

  /**
  * Signature for the `onUpdate` callback, to be set via the `f.Tween.Tween.on()` function.
  */
  export interface UpdateCallback {
    /**
    * @param progression The progression of the tween as a number between 0 and 1.
    */
    (progression: number): void;
  }

  /**
  * Signature for the `onLoopComplete` callback, to be set via the `f.Tween.Tween.on()` function.
  */
  export interface LoopCompleteCallback {
    /**
    * @param remainingLoops The number of loops the tween has still to run.
    */
    (remainingLoops: number): void;
  }

  /**
  * Interface for the `params` argument of `f.Tween.Tween`'s constructors and `set()` function.
  */
  export interface Params {
    /**
    * The object containing the start values.
    */
    from?: Object;
    /** 
    * The object containing the end values.
    */
    to?: Object;
    /**
    * The time in seconds to complete the tween.
    */
    duration?: number;
    /**
    * The time in seconds to complete the timer. Setting the `time` property makes the `from`, `to` and `duration` being ignored.
    */
    time?: number;
    /**
    * Tell whether to consider number values in the to object as relative (true) or absolute (false).
    */
    isRelative?: boolean;
    /**
    * The time in seconds before the tween's values actually starts to updates after the tween has been started.
    */
    delay?: number;
    /**
    * The number of times the tween will repeat, __after having completed once__. <br>
    * Settings `x` repeats is the same as setting `x+1` loops.
    */
    repeat?: number;
    /**
    * The total number of times the tween will run. <br>
    * Settings `x` loops is the same as setting `x-1` repeats.
    */
    loops?: number;
    /**
    * After having completed once and when repeat is strictly positive, tell whether the tween restart from its original state (false) (from 'from' to 'to', and repeat) or its current state (true) (from 'from' to 'to', then from 'to' to 'from', and repeat).
    */
    yoyo?: boolean;
    /**
    * The easing function to use.
    */
    easing?: EasingFunction;
    /**
    * The name of the easing function to use, its "path" in the `f.Tween.Easing` object. <br>
    * The name is composed of the familly followed by the variant. The `"None"` variant is optional. <br>
    * Ie: `"QuadraticIn"` `"CircularInOut"` `"Linear"` `"LinearNone"`
    */
    easingName?: string;
    /**
    * The interpolation function to use.
    */
    interpolation?: InterpolationFunction;
    /**
    * The name of interpolation function to use, its key in the `f.Tween.Interpolation` object.
    */
    interpolationName?: string;
    /**
    * Tell whether to destroy the tween once it has completed (true), or not (false).
    */
    destroyOnComplete?: boolean;
    /**
    * The callback for the `onStart` event.
    */
    onStart?: Callback;
    /**
    * The callback for the `onPause` event.
    */
    onPause?: Callback;
    /**
    * The callback for the `onResume` event.
    */
    onResume?: Callback;
    /**
    * The callback for the `onUpdate` event.
    */
    onUpdate?: UpdateCallback;
    /**
    * The callback for the `onLoopComplete` event.
    */
    onLoopComplete?: LoopCompleteCallback;
    /**
    * The callback for the `onComplete` event.
    */
    onComplete?: Callback;
    /**
    * The callback for the `onStop` event.
    */
    onStop?: Callback;
    /**
    * The time (a timetamp in milliseconds) at which to start the tween. Tweens are automatically started at the time they are created, so you may set the property to a negative value to prevent it to be started at all, or set any other time you like. 
    */
    start?: number;
  }
} // end of f.Tween module
