import { BehaviorSubject } from 'rxjs';
import { Camera, PerspectiveCamera, WebGLRendererParameters } from 'three';

export interface IEngineConfig {
  webGLRendererParameters: WebGLRendererParameters;
  camera: Camera;
  canvas: HTMLCanvasElement | undefined;
}

// Add $ to each key
type UpdateKey<T> = {
  [K in keyof T as `$${string & K}`]: T[K];
};

// Wrap Each key + $ in a BehaviorSubject
type RequiredBehaviorSubject<T> = {
  [K in keyof T as `${string & K}$`]-?: BehaviorSubject<T[K]>;
};

const testA: RequiredBehaviorSubject<IEngineConfig> = {
  camera$: new BehaviorSubject<Camera>(new PerspectiveCamera()),
  canvas$: new BehaviorSubject<HTMLCanvasElement | undefined>(undefined),
  webGLRendererParameters$: new BehaviorSubject<WebGLRendererParameters>({}),
};

export class EngineConfig implements RequiredBehaviorSubject<IEngineConfig> {
  readonly camera$: BehaviorSubject<Camera>;
  readonly canvas$: BehaviorSubject<HTMLCanvasElement | undefined>;
  readonly webGLRendererParameters$: BehaviorSubject<WebGLRendererParameters>;

  constructor(options?: Partial<IEngineConfig>) {
    options ||= {};

    this.webGLRendererParameters$ =
      new BehaviorSubject<WebGLRendererParameters>(
        options.webGLRendererParameters ?? {}
      );
    this.camera$ = new BehaviorSubject<Camera>(
      options.camera ?? new PerspectiveCamera()
    );
    this.canvas$ = new BehaviorSubject<HTMLCanvasElement | undefined>(
      options.canvas ?? undefined
    );
  }
}

const test: EngineConfig = {
  camera$: new BehaviorSubject<Camera>(new PerspectiveCamera()),
  canvas$: new BehaviorSubject<HTMLCanvasElement | undefined>(undefined),
  webGLRendererParameters$: new BehaviorSubject<WebGLRendererParameters>({}),
};
