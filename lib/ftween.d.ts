// Type definitions for ftween.js
// https://github.com/florentpoujol/ftween.js

// Exposed in Superpowers by the fTween plugin
// https://github.com/florentpoujol/superpowers-ftween-plugin

// Origial definitions for Soledad Penadés's tween.js by: sunetos <https://github.com/sunetos>, jzarnikov <https://github.com/jzarnikov>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module FTWEEN {
  export var Easing: Easings;
  export var Interpolation: Interpolations;

  export function getAll(): Tween[];
  export function removeAll(): void;
  export function add(tween:Tween): void;
  export function remove(tween:Tween): void;
  export function update(time?:number): boolean;

  export class Tween {
    constructor(object?:Object);
    from(object:Object): Tween;
    to(properties:Object, duration?:number): Tween;
    duration(duration:number): Tween;
    isRelative(isRelative:boolean): Tween;
    start(time?:number): Tween;
    stop(): Tween;
    pause(): Tween;
    resume(): Tween;
    destroy(recurse?:boolean): void;
    stopChainedTweens(): void;
    getChainedTweens(): Tween[];
    removeChainedTweens(tween?: Tween): number;
    delay(amount:number): Tween;
    repeat(times:number): Tween;
    yoyo(enable:boolean): Tween;
    easing(easing:EasingFunction): Tween;
    interpolation(interpolation:InterpolationFunction): Tween;
    chain(...tweens:Tween[]): Tween;
    onStart(callback?:Callback): Tween;
    onUpdate(callback?:UpdateCallback): Tween;
    onPause(callback?:Callback): Tween;
    onResume(callback?:Callback): Tween;
    onLoopComplete(callback?:LoopCompleteCallback): Tween;
    onComplete(callback?:Callback): Tween;
    onStop(callback?:Callback): Tween;
    update(time:number): boolean;
  }

  export interface Callback {
    (): void;
  }
  export interface UpdateCallback {
    (progression:number): void;
  }
  export interface LoopCompleteCallback {
    (remainingLoops:number): void;
  }

  export interface EasingFunction {
    (k:number): number;
  }
  export interface InterpolationFunction {
    (v:number[], k:number): number;
  }

  export interface Easings {
    Linear: {
      None: EasingFunction;
    };
    Quadratic: {
      In: EasingFunction;
      Out: EasingFunction;
      InOut: EasingFunction;
    };
    Cubic: {
      In: EasingFunction;
      Out: EasingFunction;
      InOut: EasingFunction;
    };
    Quartic: {
      In: EasingFunction;
      Out: EasingFunction;
      InOut: EasingFunction;
    };
    Quintic: {
      In: EasingFunction;
      Out: EasingFunction;
      InOut: EasingFunction;
    };
    Sinusoidal: {
      In: EasingFunction;
      Out: EasingFunction;
      InOut: EasingFunction;
    };
    Exponential: {
      In: EasingFunction;
      Out: EasingFunction;
      InOut: EasingFunction;
    };
    Circular: {
      In: EasingFunction;
      Out: EasingFunction;
      InOut: EasingFunction;
    };
    Elastic: {
      In: EasingFunction;
      Out: EasingFunction;
      InOut: EasingFunction;
    };
    Back: {
      In: EasingFunction;
      Out: EasingFunction;
      InOut: EasingFunction;
    };
    Bounce: {
      In: EasingFunction;
      Out: EasingFunction;
      InOut: EasingFunction;
    };
  }
  
  export interface Interpolations {
    Linear: InterpolationFunction;
    Bezier: InterpolationFunction;
    CatmullRom: InterpolationFunction;

    Utils: {
      Linear(p0:number, p1:number, t:number): number;
      Bernstein(n:number, i:number): number;
      Factorial(n: number): number;
    };
  }
}
