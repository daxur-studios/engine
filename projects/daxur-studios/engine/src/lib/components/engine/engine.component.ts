import {
  Component,
  EventEmitter,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  SkipSelf,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Object3D, Object3DEventMap } from 'three';
import { CanvasComponent } from '../canvas/canvas.component';

import { IEngineOptions } from '../../models/engine.model';

import { EngineService } from './engine.service';
import { Object3DParent, Object3DService } from './object-3d.service';

@Component({
  selector: 'daxur-engine',
  templateUrl: './engine.html',
  styleUrls: ['./engine.scss'],
  standalone: true,
  providers: [Object3DService],
  imports: [CanvasComponent],
})
export class EngineComponent implements Object3DParent, OnInit, OnDestroy {
  readonly engineService: EngineService = inject(EngineService, {
    skipSelf: true,
  });

  static instance = 0;
  name = '';

  // readonly options = input.required<IEngineOptions>();

  /** This isn't used */
  readonly parent = input<any>(undefined);

  @Output() ready: EventEmitter<EngineComponent> = new EventEmitter();

  readonly object3D = signal<Object3D>(this.engineService.scene);

  get canvas() {
    return this.engineService.canvas;
  }
  get renderer() {
    return this.engineService.renderer;
  }
  get scene() {
    return this.engineService.scene;
  }
  get camera() {
    return this.engineService.camera;
  }

  constructor(
    // public readonly engineService: EngineService,
    public readonly object3DService: Object3DService,
    readonly injector: Injector
  ) {
    EngineComponent.instance++;
    this.name = `Engine ${EngineComponent.instance}`;

    this.object3DService.setComponent(this);
  }

  ngOnInit(): void {
    this.engineService.onComponentInit();

    this.ready.emit(this);
  }

  ngOnDestroy(): void {
    this.engineService.onComponentDestroy();
  }

  getComponentObject3D(): Object3D<Object3DEventMap> {
    return this.engineService.scene;
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
