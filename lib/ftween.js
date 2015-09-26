/**
 * ftween.js - Licensed under the MIT license
 * https://github.com/florentpoujol/ftween.js
 * ----------------------------------------------
 *
 * A fork of Soledad Penadés' tween.js library : https://github.com/tweenjs/tween.js
 * Thank you all, you're awesome!
 */

// Date.now shim for (ahem) Internet Explo(d|r)er
if ( Date.now === undefined ) {

  Date.now = function () {

    return new Date().valueOf();

  };

}

var FTWEEN = FTWEEN || ( function () {

  var _tweens = [];

  return {

    getAll: function () {

      return _tweens;

    },

    removeAll: function () {

      _tweens = [];

    },

    add: function ( tween ) {

      _tweens.push( tween );

    },

    remove: function ( tween ) {

      var i = _tweens.indexOf( tween );

      if ( i !== -1 ) {

        _tweens.splice( i, 1 );

      }

    },

    update: function ( time ) {

      if ( _tweens.length === 0 ) return false;

      var i = 0;

      time = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );

      while ( i < _tweens.length ) {

        if ( _tweens[ i ].update( time ) ) {

          i++;

        } else {

          _tweens.splice( i, 1 );

        }

      }

      return true;

    }
  };

} )();

FTWEEN.Tween = function ( object ) {

  var _object = object || {};
  var _valuesStart = {};
  var _valuesEnd = {};
  var _duration = 1000;
  var _isRelative = false;
  var _repeat = 0;
  var _yoyo = false;
  var _isPlaying = false;
  var _delayTime = 0;
  var _startTime = null;
  var _isPaused = false;
  var _pauseDuration = 0;
  var _pauseStartTime = 0;
  var _easingFunction = FTWEEN.Easing.Linear.None;
  var _interpolationFunction = FTWEEN.Interpolation.Linear;
  var _chainedTweens = [];
  var _onStartCallback = null;
  var _onStartCallbackFired = false;
  var _onPauseCallback = null;
  var _onResumeCallback = null;
  var _onUpdateCallback = null;
  var _onLoopCompleteCallback = null;
  var _onCompleteCallback = null;
  var _onStopCallback = null;

  this.test = false;

  // Keys are property name, values are object with getter and setter properties.
  // Filled in _setupDynamicProperty().
  // Reset in start().
  var _accessorsByProperties = {};

  /**
  * Check if the provided property is "dynamic" on _object, that is if _object[property] === undefined but the property name match the name of a couple of getter/setter : get[Property]()/set[Property]().
  * Called from start().
  * @param {string} property - The property name.
  */
  var _setupDynamicProperty = function( property ) {

    if ( _object[ property ] === undefined ) {
      
      var ucProperty = property.charAt(0).toUpperCase() + property.slice(1);
      var getter = _object[ "get"+ucProperty ];
      var setter = _object[ "set"+ucProperty ];

      if ( typeof getter === "function" && typeof setter === "function" ) {
        _accessorsByProperties[ property ] = { getter: getter, setter: setter };
      }

    }

  };

  /**
  * Get the provided property's value on the _object.
  * Called from start() and update().
  * @param {string} property - The property name.
  * @return {any} 
  */
  var _getObjectValue = function( property ) {
    if (this.test) console.log("getobjectvalue", property, _accessorsByProperties[ property ]);

    if ( _accessorsByProperties[ property ] !== undefined ) {
      return _accessorsByProperties[ property ].getter.call( _object );
    }
    return _object[ property ];

  };
  
  /**
  * Get the provided property's value on the _object.
  * Called from start() and update().
  * @param {string} property - The property name.
  * @param value {any}
  */
  var _setObjectValue = function( property, value ) {
    if (this.test) console.log("setobjectvalue", property, value, _accessorsByProperties[ property ]);

    if ( _accessorsByProperties[ property ] !== undefined ) {
      if (this.test) console.log("set", property, value);
      _accessorsByProperties[ property ].setter.call( _object, value );
    }
    else
      _object[ property ] = value;

  };

  this.from = function ( object ) {

    _object = object;
    return this;

  };

  this.to = function ( object, duration ) {

    if ( duration !== undefined ) {

      _duration = duration;

    }

    _valuesEnd = object;

    return this;

  };

  this.duration = function ( duration ) {

    _duration = duration;
    return this;

  };

  this.isRelative = function ( isRelative ) {

    _isRelative = isRelative;
    return this;

  };

  this.start = function ( time ) {
    if ( ! ( this in FTWEEN.getAll() ) ) {
      FTWEEN.add( this );
    }

    _isPlaying = true;
    _onStartCallbackFired = false;

    _startTime = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );
    _startTime += _delayTime;
    _pauseDuration = 0;

    if (this.test) console.log("start tweener",_valuesStart, _object, _valuesEnd);
    var endValue, objectValue, property, endValueType, nEndValue, nObjectValue, nProperty; // n for "nested"
    var allowedTypes = [ "number", "string", "object" ]; // type object is for objects, arrays and null
    _accessorsByProperties = {};

    // loop on _valuesEnd to fill _valuesStart
    // except for object values in _valuesEnd that are undefined in _object, _object doesn't need to be filled or fixed because it will be updated from update().
    for ( property in _valuesEnd ) {

      endValue = _valuesEnd[ property ];
      endValueType = typeof endValue;

      // discard null and not allowed types
      if ( endValue === null || allowedTypes.indexOf( endValueType ) === -1 ) {
        continue;
      }

      _setupDynamicProperty( property );

      // check if an Array was provided as property value
      if ( Array.isArray( endValueType ) ) {
        if ( endValue.length === 0 ) {
          continue;
        }

        // create a local copy of the Array with the start value at the front
        _valuesEnd[ property ] = [ _getObjectValue( property ) || 0 ].concat( endValue );
        _valuesStart[ property ] = _getObjectValue( property ) || 0;

      }
      else if ( endValueType === "object" ) { // never null or array at this point

        // create object in _valuesStart and _object if one don't exist yet
        if ( _valuesStart[ property ] === undefined ) {
          _valuesStart[ property ] = {};
        }

        objectValue = _getObjectValue( property );
        if ( objectValue === undefined ) {
          objectValue = {};
          _setObjectValue( property, objectValue ); 
          // could directly do _object[property] = {} as this case is unlikely to ever happens with dynamic properties ?
        }

        for ( nProperty in endValue ) { // endValue is the object, nested in _valuesEnd, that contains the values to tween
          
          nEndValue = endValue[ nProperty ];
          nObjectValue = objectValue[ nProperty ] || 0;

          if ( Array.isArray( nEndValue ) ) {

            _valuesEnd[ property ][ nProperty ] = [ nObjectValue ].concat( nEndValue );
            _valuesStart[ property ][ nProperty ] = nObjectValue;

          }
          else { // string or number
            _valuesStart[ property ][ nProperty ] = parseFloat( nObjectValue ) || 0;
          }
        }

      }
      else { 
        _valuesStart[ property ] = parseFloat( _getObjectValue( property ) ) || 0;
      }

    }
    
    if (this.test) console.log("start tweener end",_valuesStart, _object, _valuesEnd);

    return this;

  };

  this.pause = function () {

    if ( _isPaused ) {
      return;
    }

    _isPaused = true;

    if ( _onPauseCallback !== null ) {
      _onPauseCallback.call( _object );
    }

    return this;

  };

  this.isPaused = function () {
    return _isPaused;
  };

  this.resume = function () {

    if ( !_isPaused ) {
      return;
    }

    _isPaused = false;

    if ( _onResumeCallback !== null ) {
      _onResumeCallback.call( _object );
    }

    return this;

  };

  this.stop = function () {

    if ( !_isPlaying ) {
      return this;
    }

    FTWEEN.remove( this );
    _isPlaying = false;

    if ( _onStopCallback !== null ) {

      _onStopCallback.call( _object );

    }

    this.stopChainedTweens();
    return this;

  };

  /**
  * Free as much stuff as possible for garbage collection.
  * @param {boolean=false} recurse If the tween has one or more chained tweens, tell whether to recursively destro them all (true) or just leave them be (false).
  */
  this.destroy = function ( recurse ) {
    
    if ( _isPlaying === true ) {
      FTWEEN.remove( this );
      _isPlaying = false;
    }

    this.stopChainedTweens();

    if ( recurse === true ) {
      for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {
        _chainedTweens[ i ].destroy( true );
      }
    }

    _object = null;
    _valuesStart = null;
    _valuesEnd = null;
    _chainedTweens = []; // prevent an error when destroy() is called from onComplete callback, _chainedTweens is used after the callback has been called in update().
    _onStartCallback = null;
    _onPauseCallback = null;
    _onResumeCallback = null;
    _onUpdateCallback = null;
    _onLoopCompleteCallback = null;
    _onCompleteCallback = null;
    _onStopCallback = null;

  };

  this.stopChainedTweens = function () {

    for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {

      _chainedTweens[ i ].stop();

    }

  };


  /**
  * Return all chained tweens
  * @returns {Array}
  */
  this.getChainedTweens = function () {

    return _chainedTweens;

  };

  /**
  * Remove one or several chained tweens.
  * @param {FTWEEN.Tween} [tween] The tween to remove. If null or undefined, all chained tweens will be removed.
  * @returns {boolean} True if at least one tween has been removed, false otherwise.
  */
  this.removeChainedTweens = function ( tween ) {

    if ( tween !== null || tween !== undefined ) {
      
      var index = _chainedTweens.indexOf( tween );
      if ( index !== -1 ) {

        _chainedTweens.splice( index, 1 );
        return true;

      }

      return false;

    }

    var count = _chainedTweens.length;
    _chainedTweens = [];
    return ( count > 0 );

  };

  this.delay = function ( amount ) {

    _delayTime = amount;
    return this;

  };

  this.repeat = function ( times ) {

    _repeat = times;
    return this;

  };

  this.yoyo = function( yoyo ) {

    _yoyo = yoyo;
    return this;

  };

  this.easing = function ( easing ) {

    _easingFunction = easing;
    return this;

  };

  this.interpolation = function ( interpolation ) {

    _interpolationFunction = interpolation;
    return this;

  };

  this.chain = function () {

    _chainedTweens = arguments;
    return this;

  };

  this.onStart = function ( callback ) {
    _onStartCallback = callback;
    return this;

  };

  this.onUpdate = function ( callback ) {

    _onUpdateCallback = callback;
    return this;

  };

  this.onPause = function ( callback ) {

    _onPauseCallback = callback;
    return this;

  };

  this.onResume = function ( callback ) {

    _onResumeCallback = callback;
    return this;

  };

  this.onLoopComplete = function ( callback ) {

    _onLoopCompleteCallback = callback;
    return this;

  };

  this.onComplete = function ( callback ) {

    _onCompleteCallback = callback;
    return this;

  };

  this.onStop = function ( callback ) {

    _onStopCallback = callback;
    return this;

  };

  // returns true when the tween must be kept in the list of tweens to update
  this.update = function ( time ) {
    if (this.test) console.log("update tweener", time);
    if ( _isPaused === true ) {
      if ( _pauseStartTime === 0 ) {
        // first update after tween is paused
        _pauseStartTime = time;
      }
      return true;
    } 
    else if ( _pauseStartTime > 0 ) {
      // first update after tween is resumed
      _pauseDuration += ( time - _pauseStartTime );
      _pauseStartTime = 0;
      return true;
    }
    
    if ( time < _startTime ) {

      return true;

    }

    if ( _onStartCallbackFired === false ) {

      if ( _onStartCallback !== null ) {

        _onStartCallback.call( _object );

      }

      _onStartCallbackFired = true;

    }

    var elapsed = ( time - ( _startTime + _pauseDuration ) ) / _duration;
    elapsed = elapsed > 1 ? 1 : elapsed;

    var progression = _easingFunction( elapsed ); // % between 0 and 1

    /**
    * @param {number} start - The value from _valuesStart.
    * @param {number|string} end - The value from _valuesEnd.
    * @param {string} endValueType - The type of 'end' param.
    */
    var getCurrentValue = function( start, end, endValueType ) {

      if ( _isRelative === true || endValueType === "string" ) {
        // Parses relative end values with start as base (e.g.: +10, -3)
        end = start + parseFloat( end, 10 );
      }
      
      return start + ( end - start ) * progression;

    };

    var property, start, end, valueType, nProperty, nStart, nEnd, nObject;
    if (this.test) console.log("update tweener", _valuesStart, _object, _valuesEnd, progression, elapsed);

    for ( property in _valuesEnd ) {

      start = _valuesStart[ property ];
      end = _valuesEnd[ property ];
      valueType = typeof end;

      if (this.test) console.log("update property", property, end, _object);
      if ( Array.isArray( end ) ) {
        _object[ property ] = _interpolationFunction( end, progression );
      }

      else if ( end !== null && valueType === "object") {

        nObject = _getObjectValue( property );
        // Keeping a reference to the nObject may be useful when getting/setting the property actually calls a getter/setter.
        
        // if the reference is meaningfull, updating it will actually update the data but,
        // typically, the getter returns a new object instance every time (like a Vector3 for get/setPosition())
        // so updating the reference (nObject) doesn't actually update the data in the object
        // unless the setter is called with the new value (as it is done below)

        for ( nProperty in end ) {

          nStart = start[ nProperty ]; 
          // console.log("end", end, nProperty, end[ nProperty ]);
          nEnd = end[ nProperty ];

          if ( Array.isArray( nEnd ) ) {
            nObject[ nProperty ] = _interpolationFunction( nEnd, progression );
          }
          else {
            nObject[ nProperty ] = getCurrentValue( nStart, nEnd, typeof nEnd );
          }
          if (this.test) console.log( "object value", property, nProperty, nStart, _valuesStart, nEnd, _valuesEnd);

        }
        
        if (this.test) console.log("set object value1", property, nObject, _object);
        _setObjectValue( property, nObject );       

      }

      else if ( valueType === "number" || valueType === "string" ) {
        _setObjectValue( property, getCurrentValue( start, end, valueType ) );
        if (this.test) console.log( "num value", property, start, end, progression, getCurrentValue( start, end ));
      }

    }
    if (this.test) console.log("update tweener 2", _object);

    if ( _onUpdateCallback !== null ) {

      _onUpdateCallback.call( _object, progression );

    }

    if ( elapsed == 1 ) {

      if ( _repeat > 0 ) {

        if( isFinite( _repeat ) ) {
          _repeat--;
        }

        if ( _onLoopCompleteCallback !== null ) {

          _onLoopCompleteCallback.call( _object, _repeat + 1 );

        }

        if (this.test) console.log("before repeat", _valuesStart, _object, _valuesEnd, _isRelative);
        // reassign starting values, restart by making startTime = now
        // console.log( "repeat", _valuesStart, _object, _valuesEnd );
        for( property in _valuesStart ) {

          // set startValue = currentValue if endValue (or whole tween) is relative
          endValue = _valuesEnd[ property ];
          endValueType = typeof endValue;
          currentValue = _getObjectValue( property );
          
          if ( _yoyo ) {
            
            _valuesEnd[ property ] = _valuesStart[ property ];
            _valuesStart[ property ] = currentValue;

            // if endValue/currentValue is an object, copy it so that _valuesStart doesn't keep a reference to currentValue which would be updated in update()
            if ( endValue !== null && Array.isArray( endValue ) === false && endValueType === "object" ) { 

              _valuesStart[ property ] = {};
              for ( nProperty in endValue ) {
                _valuesStart[ property ][ nProperty ] = currentValue[ nProperty ];
              }

            }
            if (this.test) console.log("property after yoyo", property, _valuesStart[ property ], _object[ property ], _valuesEnd[ property ]);

          }
          else { // not yoyo
            // do nothing unless the tween or some of its values are relative
            // in this case, assign currentValue as the new start value

            if ( ( _isRelative === true && endValueType === "number" ) || endValueType === "string" ) {
              _valuesStart[ property ] = currentValue;
              // if (this.test) console.log("update start value with current value", property, currentValue);
            }

            else if ( endValue !== null && Array.isArray( endValue ) === false && endValueType === "object" ) { 

              for ( nProperty in endValue ) {

                var nEndValueType = typeof endValue[ nProperty ]; 
                if ( ( _isRelative === true && nEndValueType === "number" ) || nEndValueType === "string" ) {
                  _valuesStart[ property ][ nProperty ] = currentValue[ nProperty ];
                }

              }

            }

          }
          // what about arrays ?
          if (this.test) console.log("property", property, _valuesStart[ property ], _object[ property ], _valuesEnd[ property ]);

        }
        if (this.test) console.log("after repeat", _valuesStart, _object, _valuesEnd);
        
        if ( _yoyo ) {
          _isRelative = false;
        }

        _startTime = time + _delayTime;
        _pauseDuration = 0;

        return true;

      } else {

        if ( _onCompleteCallback !== null ) {

          _onCompleteCallback.call( _object );

        }

        for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {

          _chainedTweens[ i ].start( time );

        }

        return false;

      }

    }

    return true;

  };

};


FTWEEN.Easing = {

  Linear: {

    None: function ( k ) {

      return k;

    }

  },

  Quadratic: {

    In: function ( k ) {

      return k * k;

    },

    Out: function ( k ) {

      return k * ( 2 - k );

    },

    InOut: function ( k ) {

      if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
      return - 0.5 * ( --k * ( k - 2 ) - 1 );

    }

  },

  Cubic: {

    In: function ( k ) {

      return k * k * k;

    },

    Out: function ( k ) {

      return --k * k * k + 1;

    },

    InOut: function ( k ) {

      if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
      return 0.5 * ( ( k -= 2 ) * k * k + 2 );

    }

  },

  Quartic: {

    In: function ( k ) {

      return k * k * k * k;

    },

    Out: function ( k ) {

      return 1 - ( --k * k * k * k );

    },

    InOut: function ( k ) {

      if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
      return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

    }

  },

  Quintic: {

    In: function ( k ) {

      return k * k * k * k * k;

    },

    Out: function ( k ) {

      return --k * k * k * k * k + 1;

    },

    InOut: function ( k ) {

      if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
      return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

    }

  },

  Sinusoidal: {

    In: function ( k ) {

      return 1 - Math.cos( k * Math.PI / 2 );

    },

    Out: function ( k ) {

      return Math.sin( k * Math.PI / 2 );

    },

    InOut: function ( k ) {

      return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

    }

  },

  Exponential: {

    In: function ( k ) {

      return k === 0 ? 0 : Math.pow( 1024, k - 1 );

    },

    Out: function ( k ) {

      return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

    },

    InOut: function ( k ) {

      if ( k === 0 ) return 0;
      if ( k === 1 ) return 1;
      if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
      return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

    }

  },

  Circular: {

    In: function ( k ) {

      return 1 - Math.sqrt( 1 - k * k );

    },

    Out: function ( k ) {

      return Math.sqrt( 1 - ( --k * k ) );

    },

    InOut: function ( k ) {

      if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
      return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

    }

  },

  Elastic: {

    In: function ( k ) {

      var s, a = 0.1, p = 0.4;
      if ( k === 0 ) return 0;
      if ( k === 1 ) return 1;
      if ( !a || a < 1 ) { a = 1; s = p / 4; }
      else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
      return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

    },

    Out: function ( k ) {

      var s, a = 0.1, p = 0.4;
      if ( k === 0 ) return 0;
      if ( k === 1 ) return 1;
      if ( !a || a < 1 ) { a = 1; s = p / 4; }
      else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
      return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

    },

    InOut: function ( k ) {

      var s, a = 0.1, p = 0.4;
      if ( k === 0 ) return 0;
      if ( k === 1 ) return 1;
      if ( !a || a < 1 ) { a = 1; s = p / 4; }
      else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
      if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
      return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

    }

  },

  Back: {

    In: function ( k ) {

      var s = 1.70158;
      return k * k * ( ( s + 1 ) * k - s );

    },

    Out: function ( k ) {

      var s = 1.70158;
      return --k * k * ( ( s + 1 ) * k + s ) + 1;

    },

    InOut: function ( k ) {

      var s = 1.70158 * 1.525;
      if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
      return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

    }

  },

  Bounce: {

    In: function ( k ) {

      return 1 - FTWEEN.Easing.Bounce.Out( 1 - k );

    },

    Out: function ( k ) {

      if ( k < ( 1 / 2.75 ) ) {

        return 7.5625 * k * k;

      } else if ( k < ( 2 / 2.75 ) ) {

        return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

      } else if ( k < ( 2.5 / 2.75 ) ) {

        return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

      } else {

        return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

      }

    },

    InOut: function ( k ) {

      if ( k < 0.5 ) return FTWEEN.Easing.Bounce.In( k * 2 ) * 0.5;
      return FTWEEN.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

    }

  }

};

FTWEEN.Interpolation = {

  Linear: function ( v, k ) {

    var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = FTWEEN.Interpolation.Utils.Linear;

    if ( k < 0 ) return fn( v[ 0 ], v[ 1 ], f );
    if ( k > 1 ) return fn( v[ m ], v[ m - 1 ], m - f );

    return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );

  },

  Bezier: function ( v, k ) {

    var b = 0, n = v.length - 1, pw = Math.pow, bn = FTWEEN.Interpolation.Utils.Bernstein, i;

    for ( i = 0; i <= n; i++ ) {
      b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
    }

    return b;

  },

  CatmullRom: function ( v, k ) {

    var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = FTWEEN.Interpolation.Utils.CatmullRom;

    if ( v[ 0 ] === v[ m ] ) {

      if ( k < 0 ) i = Math.floor( f = m * ( 1 + k ) );

      return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );

    } else {

      if ( k < 0 ) return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
      if ( k > 1 ) return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );

      return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );

    }

  },

  Utils: {

    Linear: function ( p0, p1, t ) {

      return ( p1 - p0 ) * t + p0;

    },

    Bernstein: function ( n , i ) {

      var fc = FTWEEN.Interpolation.Utils.Factorial;
      return fc( n ) / fc( i ) / fc( n - i );

    },

    Factorial: ( function () {

      var a = [ 1 ];

      return function ( n ) {

        var s = 1, i;
        if ( a[ n ] ) return a[ n ];
        for ( i = n; i > 1; i-- ) s *= i;
        a[ n ] = s;
        return s;
        // return a[ n ] = s;

      };

    } )(),

    CatmullRom: function ( p0, p1, p2, p3, t ) {

      var v0 = ( p2 - p0 ) * 0.5, v1 = ( p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
      return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

    }

  }

};

if(typeof module !== 'undefined' && module.exports) {
  module.exports = FTWEEN;
}
