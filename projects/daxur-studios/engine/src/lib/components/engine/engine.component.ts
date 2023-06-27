import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  effect,
  computed,
} from '@angular/core';
import { CanvasComponent } from '../canvas/canvas.component';
import {
  ACESFilmicToneMapping,
  PCFSoftShadowMap,
  Scene,
  WebGLRenderer,
  WebGLRendererParameters,
} from 'three';
import { EngineConfig } from '../../models';

@Component({
  selector: 'daxur-engine',
  template: `<daxur-canvas [config]="config"></daxur-canvas>`,
  styles: [],
  standalone: true,
  host: {
    class: 'flex-page',
  },
  imports: [CanvasComponent],
})
export class EngineComponent implements OnInit, OnDestroy {
  @Input({ required: true }) config!: EngineConfig;

  @ViewChild(CanvasComponent, { static: true })
  canvasComponent?: CanvasComponent;

  public readonly scene = new Scene();
  public renderer?: WebGLRenderer;

  constructor() {}

  ngOnInit(): void {
    this.initRenderer();
  }

  ngOnDestroy(): void {
    this.disposeRenderer();
  }

  private initRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvasComponent!.gameCanvas!.nativeElement,
      ...this.config.webGLRendererParameters$.value,
    });

    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    this.renderer.setSize(
      this.canvasComponent!.width(),
      this.canvasComponent!.height()
    );
    this.renderer.render(this.scene, this.config.camera$.value);

    this.canvasComponent?.resize.subscribe((size) => {
      this.renderer?.setSize(size.width, size.height);
      this.renderer?.render(this.scene, this.config.camera$.value);
    });
  }
  private disposeRenderer() {
    this.renderer?.dispose();
  }
}
