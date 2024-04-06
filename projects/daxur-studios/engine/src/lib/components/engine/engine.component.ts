import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  effect,
  computed,
  signal,
  Output,
  EventEmitter,
  input,
  AfterContentInit,
  ContentChildren,
  contentChildren,
  QueryList,
  ElementRef,
  Injector,
  EffectRef,
  forwardRef,
  Signal,
  WritableSignal,
} from '@angular/core';
import { CanvasComponent } from '../canvas/canvas.component';
import {
  ACESFilmicToneMapping,
  Camera,
  Clock,
  Object3D,
  Object3DEventMap,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  WebGLRendererParameters,
} from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

import { BehaviorSubject, Subject, takeUntil, ReplaySubject, skip } from 'rxjs';
import { FPSController, IInputEvents } from '../../models';
import { GameScene } from '../../core/game/game-scene';
import { EngineController } from '../../services';
import { IEngineOptions } from '../../models/engine.model';
import { EngineService } from './engine.service';
import { SceneComponent } from '../scene/scene.component';

// Marker class, used as an interface
export abstract class Object3DParent {
  abstract name: string;
  abstract object3D: WritableSignal<Object3D>;
}

// Helper method to provide the current component instance in the name of a `parentType`.
// The `parentType` defaults to `Parent` when omitting the second parameter.
export function provideObject3DParent(component: any, parentType?: any) {
  return {
    provide: parentType || Object3DParent,
    useExisting: forwardRef(() => component),
  };
}

@Component({
  selector: 'daxur-engine',
  templateUrl: './engine.html',
  styleUrls: ['./engine.scss'],
  standalone: true,
  providers: [EngineService, provideObject3DParent(EngineComponent)],
  imports: [CanvasComponent, SceneComponent],
})
export class EngineComponent implements Object3DParent, OnInit, OnDestroy {
  static instance = 0;
  name = '';

  readonly controller = input.required<EngineController>();

  /** This isn't used */
  readonly parent = input<any>(undefined);

  @Output() ready: EventEmitter<EngineComponent> = new EventEmitter();

  readonly object3D = signal<Object3D>(this.engineService.scene);

  get canvas() {
    return this.controller().canvas;
  }
  get renderer() {
    return this.controller().renderer;
  }
  get scene() {
    return this.controller().scene;
  }
  get camera() {
    return this.controller().camera;
  }

  constructor(
    public readonly engineService: EngineService,
    readonly injector: Injector
  ) {
    EngineComponent.instance++;
    this.name = `Engine ${EngineComponent.instance}`;
  }

  ngOnInit(): void {
    const controller = this.controller();

    controller.scene.add(this.engineService.scene);

    controller.onComponentInit();

    this.ready.emit(this);
  }

  ngOnDestroy(): void {
    this.controller().onComponentDestroy();
  }

  getComponentObject3D(): Object3D<Object3DEventMap> {
    return this.controller().scene;
  }

  //#region Object3DComponent
  add(object: Object3D): void {
    this.engineService.scene.add(object);
  }
  remove(object: Object3D): void {
    this.engineService.scene.remove(object);
  }
  //#endregion
}
