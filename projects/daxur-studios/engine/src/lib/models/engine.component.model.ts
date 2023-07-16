import { BehaviorSubject } from 'rxjs';
import { Camera, PerspectiveCamera, WebGLRendererParameters } from 'three';

export interface IEngineConfig {
  webGLRendererParameters: WebGLRendererParameters;
}

// Wrap Each key + $ in a BehaviorSubject
type RequiredBehaviorSubject<T> = {
  [K in keyof T as `${string & K}$`]-?: BehaviorSubject<T[K]>;
};

export class EngineConfig implements RequiredBehaviorSubject<IEngineConfig> {
  readonly webGLRendererParameters$: BehaviorSubject<WebGLRendererParameters>;

  constructor(options?: Partial<IEngineConfig>) {
    options ||= {};

    this.webGLRendererParameters$ =
      new BehaviorSubject<WebGLRendererParameters>(
        options.webGLRendererParameters ?? {}
      );
  }
}
