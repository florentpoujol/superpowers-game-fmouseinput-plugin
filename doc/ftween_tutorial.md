# Animations with the fTween module

The `fTween` plugin for Superpowers allows to easily create tweens that animate properties on objects.  
This enables you to create fade or slide effects, or simple timer for instance, in no time and no hassle.

- Read below for a tutorial and detailed explanations.
- Or dive into the reference with the links on the right.
- [Or go back to the repository.](https://github.com/florentpoujol/superpowers-ftween-plugin)

## Tweens and the fTween.Tween class

The `fTween` module mostly brings the `fTween.Tween` class, plus some interfaces.  
The `fTween.Tween` class is the go-to way to create any animations, aka __tweens__ (which are instances of `fTween.Tween`).

Simply speaking, a tween is an object that updates the properties of an object __from__ a start value (the values in the `from` object) __to__ an end value (the values in the `to` object) during a __duration__, optionally using an __easing__ (or interpolation) function and some other optional parameters.

Here is three of `fTween.Tween` constructors:

    ( from: Object, to: Object, duration: number, params?: fTween.Params ): fTween.Tween
    ( to: Object, duration: number, params?: fTween.Params ): fTween.Tween
    ( params?: fTween.Params ): fTween.Tween

## Examples

Let's start right away with examples :

### 1/
    
    // the values in the from object may be numbers or objects that contains numbers (like Vector3)
    var from = {
        opacity: 1,
        position: { x: 0, y: 0, z: 0 }
    };
    var to = {
        opacity: 0,
        position: { x: 10, y: -5, z: 0 }
    };
    var tween = new fTween.Tween( from, to, 3 );

This tween will animate the opacity from 1 to 0 and the postion from `{0,0,0}` to `{10,-5,0}` over 3 seconds.
    
### 2/
    
    var to = {
        opacity: 0,
        position: { x: 10, y: -5, z: 0 }
    };
    var tween = new fTween.Tween( to, 3 );

As you can see, the `from` object has not been supplied because it is completely optional.  
Even if you supply an incomplete `from` object, the missing properties (in comparison with the ones in the `to` object) will be created on it with `0` (or an object that contains zeros) as value.

### 3/ Tween instances directly, with dynamic properties

The `from` object can also be instances like an actor:

    class TweenBehavior extends Sup.Behavior {
        awake() {
            var tween = new fTween.Tween( 
                this.actor,                           // from
                { position: { x: 10, y: -5, z: 0 } }, // to
                3                                     // duration
            );
        }
    }

In this case, there is a catch, because actors don't have a `position` property.  
But they have two functions named `getPosition()` and `setPosition()` that are used to get and set its position.

So when the name of a property in the `to` object match the name of a couple of getter/setter functions (the functions that begin by `get` or `set`) in the `from` object, the property is not created on it as in the second example: the value of the property is get/set via the functions instead.

It means that this example would effectively move the actor from its current position to `{10,-5,0}` because its position is automatically set on each update of the tween.  
Pretty handy!

--
For comparison, here is the code you would need to achieve that if you used the `TWEEN`/`SUPTWEEN` module or the `Tween` actor component.
    

    class TweenBehavior extends Sup.Behavior {
        awake() {
            // setup
            var currentPos = this.actor.getPosition();

            var self = this;
            var onUpdate = function() {
                self.actor.setPosition( this );
            }

            // with TWEEN:
            new TWEEN.Tween( currentPos )
            .to( { x: 10, y: -5, z: 0 }, 3000 )
            .onUpdate( onUpdate )
            .start();

            // this also require to call TWEEN.update() or tween.update() as often as possible in order for the tween to update.

            // with the Tween actor component:
            new Tween( this.actor, currentPos )
            .to( { x: 10, y: -5, z: 0 }, 3000 )
            .onUpdate( onUpdate )
            .start();
            // using the Tween actor component makes the tween update automatically
        }
    }

The advantage of using fTween is event greater when you want to tween several properties at the same time :
    
    // with fTween:
    var to = { 
        position: { x: 10, y: -5, z: 0 },
        localEulerAngles: { x: 10, y: -5, z: 0 },
    };

    var tween = new fTween.Tween( this.actor, to, 3);

    // with TWEEN:
    var currentPos = this.actor.getPosition();
    var currentAngles = this.actor.getLocalEulerAngles();
    var from = {
        posX: currentPos.x, posY: currentPos.y, posZ: currentPos.z,
        angleX: currentAngles.x, angleY: currentAngles.y, angleZ: currentAngles.z
    }
    var to = {
        posX: 10, posY: -5, posZ: 0,
        angleX: 10, angleY: -5, angleZ: 0,
    }

    var self = this;
    var onUpdate = function() {
        self.actor.setPosition( new Sup.Math.Vector3( this.posX, this.posY, this.posZ ) );
        self.actor.setLocalEulerAngles( { x: this.angleX, y: this.angleY, z: this.angleZ } ) ); // this also works with a simple object instead of a Vector3
    }

    new TWEEN.Tween( from )
    .to( to, 3000 )
    .onUpdate( onUpdate )
    .start();

### 4/ Set properties in mass with the params argument

Let's use one more constructor :  
`( params: fTween.Params ): fTween.Tween`  

    var tween = new fTween.Tween( {
        to: { opacity: 1 },
        duration: 0.5,
        delay: 1,                           // the tween will start running with a delay of 1 second
        isRelative: true,                   // the values in the to object are realtive from the one in the from object
        easing: fTween.Easing.Quadratic.Out // use a quadratic out easing instead of a linear one
    } );

    // this is equivalent to:
    var tween = new fTween.Tween( { opacity: 1 }, 0.5, {
        delay: 1,
        isRelative: true,
        easing: fTween.Easing.Quadratic.Out
    } );

All the constructors, as well as the `set()` function share a `params` argument which is an object in which you can set the tween's properties (and more) in mass.  
[Check out the `fTween.Params` interface](interfaces/ftween.params.html) for more information about all the properties you can set in the `params` argument.


## Tween properties

As you have seen in the examples above the tween may have quite many properties beside the `from` and `to` object and the duration to control how the values gets animated.

[Find all these properties](classes/ftween.tween.html#_inner) in the __Accessors__ section of the class' page.
   
    // same example as above:
    var tween = new fTween.Tween( { opacity: 1 }, 0.5, {
        isRelative: true,
    } );
    tween.delay = 1;
    tween.easing = fTween.Easing.Quadratic.Out;

## Creating aliases of fTween.Tween

If you are not happy about the name `fTween.Tween`, feel free to create an alias like this:

    var Tween = fTween.Tween;
    // or
    var Anim = fTween.Tween;

Now you can write:

    var tween = new Anim( [...] );

## Timer

Just want to do something after some time ?  
Then just create a tween with this fourth constructor:  
`( time: number, onComplete: fTween.Callback, params?: fTween.Params ): fTween.Tween`

    new fTween.Tween( 2, function() {
      Sup.log( "Time's up! Remaining time:"+this.remainingTime ); // 0
      doSomething();
    } );
    // this prints the message and calls doSomething() after 2 seconds

In the case of such timer, the `from` object you may get via the `this` variable of the callbacks contains the `elapsedTime` and `remainingTime` properties.


## Playback control

When you create a new tween instance and pass (at least) the `to` object and a positive duration, __the tween will automatically start__.  
You can prevent this behavior by setting the start property with a negative number in the `params` argument.

    new fTween.Tween( { value: 10 }, 2 ); // starts right away

    var tween = new fTween.Tween( { value: 10 }, 2, { start: -1 } ); 
    // don't automatically starts, wait for the start() function to be called:
    tween.start();

You can start, pause, resume and stop the tween whenever you call the function of the same name.
  
    var tween = new fTween.Tween( { value: 10 }, 2, { start: -1 } ); 
    tween.start();
    tween.pause();
    // tweener.isPaused is now true;
    tween.resume();
    tween.stop();
    tween.destroy();

Note that there is a difference between:
  
    var tween = new fTween.Tween( { value: 10 }, 2, { start: -1 } ); 
    // and
    var tween = new fTween.Tween( { value: 10 }, 2 ); 
    tween.pause(); // or tween.stop();

In this last case, tween has been started _before_ being paused or stopped. Some operations have been done on the `from` object and setting a new `from` object will result in unexpected behaviors and maybe errors.

__As a rule of thumbs, your shouldn't modify any of your tween's property while it is started.__


## Callbacks

You may set callbacks for the following events: `onStart`, `onPause`, `onResume`, `onUpdate`, `onLoopComplete`, `onComplete` and `onStop` via the `on()` function

The callbacks must respect the `fTween.Callback` signature (or `fTween.UpdateCallback`/`fTween.LoopCompleteCallback` for the `onUpdate`/`onLoopComplete` events).  
They are called in the context of the `from`, so their `this` variable is the `from` object.
The `onUpdate` and `onLoopComplete` callbacks also receive an argument: the progression of the tween as a percentage between 0 and 1 and the number of remaining loops, respectively.

    var tween = new fTween.Tween( ... );
    tween.on( "onUpdate", function( progression: number ) { ... } );

    // as shotcut, you may provide the "short" event name
    tween.on( "complete", function() { ... } ) // same as tween.on( "onComplete", ... )

    // you can also set a callback via the `params` object passed to the constructors or the `set()` function:
    tween.set( {
      onStop: function() { ... }
    } );

Remove a callback the same way: 
  
    tween.on( "update", function( ... ) { ... } );
    ...
    tween.on( "update", null );


## Easing functions

Easing functions impact how the values in the `from` object change over time.
They can be divided into several big families:

- `Linear` is the default easing. It’s the simplest easing function.
- `Quadratic`, `Cubic`, `Quartic`, `Quintic`, `Sinusoidal`, `Exponential`, and `Circular` are all "smooth" curves that will make transitions look natural.
- The `Elastic` family simulates inertia in the easing, like an elastic gum.
- The `Back` family starts by moving the easing slightly "backwards" before moving it forward.
- The `Bounce` family simulates the motion of an object bouncing.

Each family (except `Linear`) has 4 variants:

- `In` starts slow, and accelerates at the end
- `Out` starts fast, and decelerates at the end
- `InOut` starts and ends slow, but it’s fast in the middle
- `OutIn` starts and ends fast, but it’s slow in the middle

The `Linear` family as a single variant named `None`. `fTween.Easing.Linear.None` is the default easing function.

[See the easing examples](http://tweenjs.github.io/tween.js/examples/03_graphs.html) of the Tween.js library to get a visual clue at how the values change over time.


## Interpolation

Interpolations functions are used instead of the easing function for the values in the `to` object that are set to an array of at least two values.

The value will be animated to all the values set in the array successively, optionally using an interpolation equation which allow for the movement to be smoothed or curved.

[See the interpolation examples](http://tweenjs.github.io/tween.js/examples/06_array_interpolation.html) on the Tween.js library.




