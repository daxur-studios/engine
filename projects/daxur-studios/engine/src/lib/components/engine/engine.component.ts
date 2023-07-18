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
import { EngineConfig, IInputEvents } from '../../models';
import { GameScene } from '../../core/game/game-scene';
import { InputService, EngineService } from '../../services';

@Component({
  selector: 'daxur-engine',
  template: `<daxur-canvas [canvas]="canvas"></daxur-canvas>
    <ng-content></ng-content>`,
  styles: [
    `
      :host {
        position: relative;
      }
    `,
  ],
  standalone: true,
  host: {
    class: 'flex-page',
  },
  providers: [InputService, EngineService],
  imports: [CanvasComponent],
})
export class EngineComponent implements OnInit, OnDestroy {
  @Input() config?: EngineConfig;
  @Output() ready: EventEmitter<EngineComponent> = new EventEmitter();

  // @ViewChild(CanvasComponent, { static: true })
  // canvasComponent?: CanvasComponent;

  readonly camera$: BehaviorSubject<Camera> = new BehaviorSubject<Camera>(
    new PerspectiveCamera()
  );
  get camera() {
    return this.camera$.value;
  }
  public onCameraChange$ = new Subject<Camera>();

  public readonly scene = new GameScene(this);
  public readonly clock = new Clock();
  public tick$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public renderer: WebGLRenderer;
  /** If set, will render based on this, otherwise uses the base `renderer` */
  public composer: EffectComposer;
  public renderPass!: RenderPass;

  public timeSpeed: number = 1;
  public frames: FPS;
  public cursor: Cursor;

  public onDestroy$ = new ReplaySubject<void>();
  public onBeginPlay$ = new ReplaySubject<void>();
  public isPlaying = signal(false);

  public canvas: HTMLCanvasElement;

  //#region Sizes
  public width$ = this.engineService.width$;
  public height$ = this.engineService.height$;
  public get width() {
    return this.width$.value;
  }
  public get height() {
    return this.height$.value;
  }
  public resolution$ = this.engineService.resolution$;
  public resize = this.engineService.resize;
  //#endregion

  constructor(
    public readonly input: InputService,
    public readonly engineService: EngineService
  ) {
    this.frames = new FPS(this);
    this.cursor = new Cursor(this);

    this.canvas = document.createElement('canvas');
    this.renderer = this.createRenderer();
    this.composer = this.createComposer();
  }

  onBeginPlay() {
    this.onBeginPlay$.next();
    this.onBeginPlay$.complete();
    this.isPlaying.set(true);
  }

  ngOnInit(): void {
    this.initRenderer();
    this.startLoop();

    this.ready.emit(this);
  }

  private initRenderer() {
    const webGLParams$ = this.config?.webGLRendererParameters$;
    if (webGLParams$) {
      webGLParams$.pipe(takeUntil(this.onDestroy$)).subscribe((params) => {
        this.renderer = this.createRenderer(params);
        // this.composer = this.createComposer();
      });
    }
  }
  private createComposer(): EffectComposer {
    if (this.renderPass) {
      this.renderPass.dispose();
    }
    if (this.composer) {
      this.composer.dispose();
    }

    const composer = new EffectComposer(this.renderer);

    const renderPass = new RenderPass(this.scene, this.camera);
    this.renderPass = renderPass;

    composer.addPass(renderPass);

    return composer;
  }
  public createRenderer(
    webGLRendererParameters?: WebGLRendererParameters
  ): WebGLRenderer {
    if (this.renderer) {
      this.renderer.dispose();
    }

    const canvas = this.canvas;

    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      ...webGLRendererParameters,
    });

    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    this.renderer.setSize(this.width, this.height);

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.resize.subscribe(({ width, height }) => this.onResize(width, height));

    if (this.composer) {
      this.composer.renderer = this.renderer;
    }

    return this.renderer;
  }

  ngOnDestroy(): void {
    this.stopLoop();
    this.renderer.dispose();

    this.scene.destroy();

    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public switchCamera(newCamera: Camera) {
    this.camera$.next(newCamera);

    if (newCamera instanceof PerspectiveCamera && this.canvas) {
      newCamera.aspect = this.width / this.height;
      newCamera.updateProjectionMatrix();
    }

    this.onCameraChange$.next(newCamera);

    this.renderPass.camera = newCamera;

    // Render the scene with the composer instead of the renderer
    this.composer.render();
  }

  private onResize(width: number, height: number) {
    this.renderer.setSize(width, height, true);
    this.composer.setSize(width, height);

    if (this.camera instanceof PerspectiveCamera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.render(this.frames.lastRenderTime);
  }

  public render(time: number) {
    if (!this.renderer || !this.camera) return;

    // Only render if enough time has passed since the last frame
    if (time - this.frames.lastRenderTime >= this.frames.fpsLimitInterval) {
      this.composer.render();

      // if (this.composer) {
      //   this.composer.render();
      // } else {
      //   this.renderer.render(this.scene, this.camera);
      // }

      this.frames.lastRenderTime = time;
    }
  }

  /** Start the rendering loop */
  startLoop() {
    this.renderer.setAnimationLoop((time) => this.tick(time));
  }

  /** Stop the rendering loop */
  stopLoop() {
    this.renderer.setAnimationLoop(null);
  }

  /** Ticker function runs every frame */
  private tick(time: number) {
    const delta = this.clock.getDelta() * this.timeSpeed;

    this.tick$.next(delta);

    this.render(time);
  }

  public setFPSLimit(fpsLimit: number) {
    if (fpsLimit === 0) this.frames.fpsLimitInterval = 0;
    else this.frames.fpsLimitInterval = 1000 / fpsLimit;
  }

  public setTimeSpeed(timeSpeed: number) {
    this.timeSpeed = timeSpeed;
  }
}

/** Frames per second */
class FPS {
  lastRenderTime = -1;
  fpsLimitInterval: number = 0;

  previousSecond: number = performance.now();

  /** The number of frames, reset to 0 on every new second */
  frameCount: number = 0;
  displayCount = signal(this.frameCount);

  graph: number[] = [];

  constructor(public readonly engine: EngineComponent) {
    this.tick();
  }

  tick() {
    this.engine.tick$
      .pipe(takeUntil(this.engine.onDestroy$))
      .subscribe((delta) => {
        const now = performance.now();
        /**Do Not Change This */
        const OneSecond = 1000;

        if (now - this.previousSecond >= OneSecond) {
          this.previousSecond = now;

          this.displayCount.set(this.frameCount);

          //#region Graph
          this.graph.push(this.frameCount);
          if (this.graph.length > 60) {
            this.graph.shift();
          }
          //#endregion

          this.frameCount = 0;
        }

        this.frameCount++;
      });
  }
}

/**
 * Cursor x and y position in pixels relative to the canvas
 */
class Cursor {
  private previousX = 0;
  private previousY = 0;

  /**
   * Normalized x and y position in the range of -1 to 1
   */
  x = signal(0);
  y = signal(0);

  axisX = signal(0);
  axisY = signal(0);

  event: MouseEvent | undefined;

  normalizedPosition$ = new BehaviorSubject<Cursor>(this);

  constructor(private readonly engine: EngineComponent) {
    this.engine.input.mousemove$
      .pipe(takeUntil(this.engine.onDestroy$))
      .subscribe((event) => this.updatePosition(event));
  }

  updatePosition = (e: MouseEvent | null) => {
    if (!e) return;
    // x and y are in the range -1 to 1
    const x = (e.offsetX / (this.engine.width || 0)) * 2 - 1;
    const y = -((e.offsetY / (this.engine.height || 0)) * 2 - 1);

    this.x.set(x);
    this.y.set(y);

    this.event = e;

    this.normalizedPosition$.next(this);

    this.axisX.set(this.x() - this.previousX);
    this.axisY.set(this.y() - this.previousY);

    this.previousX = this.x();
    this.previousY = this.y();
  };
}
