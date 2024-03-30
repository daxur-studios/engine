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
} from '@angular/core';
import { CanvasComponent } from '../canvas/canvas.component';
import {
  ACESFilmicToneMapping,
  Camera,
  Clock,
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

@Component({
  selector: 'daxur-engine',
  templateUrl: './engine.html',
  styleUrls: ['./engine.scss'],
  standalone: true,

  imports: [CanvasComponent],
})
export class EngineComponent implements OnInit, OnDestroy {
  readonly controller = input.required<EngineController>();

  @Output() ready: EventEmitter<EngineComponent> = new EventEmitter();

  // private _mode: 'VR' | 'Desktop' = 'Desktop';
  // @Input() set mode(value: 'VR' | 'Desktop') {
  //   this._mode = value;
  //   this.onModeChange(value);
  // }
  // get mode() {
  //   return this._mode;
  // }
  // private onModeChange(value: 'VR' | 'Desktop') {
  //   if (value === 'VR') {
  //     this.composer?.dispose();
  //   }
  // }
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

  constructor() {}

  ngOnInit(): void {
    this.controller().onComponentInit();

    this.ready.emit(this);
  }

  ngOnDestroy(): void {
    this.controller().onComponentDestroy();
  }
}
