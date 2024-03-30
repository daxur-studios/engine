import { BehaviorSubject, ReplaySubject, takeUntil } from 'rxjs';
import { Camera, Clock, WebGLRenderer, WebGLRendererParameters } from 'three';
import { GameActor, GameScene } from '../core';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { EventEmitter, WritableSignal, signal } from '@angular/core';
import { Cursor } from './cursor.model';
import { FPSController } from './fps.controller';

export interface IEngineOptions {
  showFPS?: boolean;
  transparent?: boolean;
  webGLRendererParameters?: WebGLRendererParameters;
}

export interface IEngineLifecycle {
  readonly onDestroy$: ReplaySubject<void>;

  readonly fpsController: FPSController;
  readonly tick$: BehaviorSubject<number>;

  timeSpeed: number;

  onComponentInit(): void;
  onComponentDestroy(): void;

  beginPlay(): void;
  endPlay(): void;

  readonly isPlaying: WritableSignal<boolean>;
  readonly onBeginPlay$: ReplaySubject<void>;
  readonly onBeginPlaySignal: WritableSignal<boolean>;
  readonly onEndPlay$: ReplaySubject<void>;
  readonly onEndPlaySignal: WritableSignal<boolean>;

  tick(delta: number): void;
  startLoop(): void;
  stopLoop(): void;
  render(time: number, force?: boolean): void;
  setFPSLimit(fps: number): void;
}

export interface IEngineCamera {
  readonly camera$: BehaviorSubject<Camera>;
  readonly camera: Camera;
  switchCamera(camera: Camera): void;
}

export interface IEngineCore extends IEngineCamera {
  readonly canvas: HTMLCanvasElement;

  options: IEngineOptions | undefined;
  renderer: WebGLRenderer | undefined;
  composer: EffectComposer | undefined;
  renderPass: RenderPass | undefined;

  readonly scene: GameScene;
  readonly clock: Clock;

  cursor: Cursor;

  readonly width$: BehaviorSubject<number>;
  readonly height$: BehaviorSubject<number>;
  readonly width: number;
  readonly height: number;
  readonly resize: EventEmitter<{ width: number; height: number }>;

  spawnActor<T extends GameActor>(actor: T): T;
}

export interface IEngineInput {
  readonly keyup$: BehaviorSubject<KeyboardEvent | null>;
  readonly keydown$: BehaviorSubject<KeyboardEvent | null>;
  readonly mouseup$: BehaviorSubject<MouseEvent | null>;
  readonly mousedown$: BehaviorSubject<MouseEvent | null>;
  readonly mousemove$: BehaviorSubject<MouseEvent | null>;
  readonly mousewheel$: BehaviorSubject<Event | WheelEvent | MouseEvent | null>;
  readonly contextmenu$: BehaviorSubject<MouseEvent | null>;
}

export interface IEngine extends IEngineCore, IEngineLifecycle, IEngineInput {}
