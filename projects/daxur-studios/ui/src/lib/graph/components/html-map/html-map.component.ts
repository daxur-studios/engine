import {
  CdkDragEnd,
  CdkDragMove,
  DragDropModule,
  DragRef,
  Point,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

import {
  Component,
  HostBinding,
  effect,
  signal,
  computed,
  Signal,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  Input,
  input,
  model,
  viewChild,
  inject,
} from '@angular/core';
import {
  HtmlMapService,
  HtmlMapPanBy,
  HtmlMapCamera,
} from './html-map.service';

export interface HtmlMapOptions {
  showGrid?: boolean;
  panBy?: HtmlMapPanBy[];
}

@Component({
  selector: 'lib-html-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './html-map.component.html',
  styleUrl: './html-map.component.scss',
  providers: [HtmlMapService],
})
export class HtmlMapComponent implements OnInit, OnDestroy {
  readonly htmlMapService: HtmlMapService;
  private readonly _services = {
    _parentHtmlService: inject(HtmlMapService, {
      skipSelf: true,
      optional: true,
    }),
    _selfHtmlService: inject(HtmlMapService, { self: true }),
  };

  readonly backgroundTiles: Signal<
    { position: Point; width: number; height: number }[]
  > = computed(() => {
    const cameraX = this.camera.cameraX();
    const cameraY = this.camera.cameraY();

    const tileSize = 100;

    // A multi dimensional array of tiles, eg 3x3
    const tiles: { position: Point; width: number; height: number }[] = [];
    const tilesX = 15;
    const tilesY = 5;

    const halfX = tilesX * tileSize * 0.5;
    const halfY = tilesY * tileSize * 0.5;

    for (let x = 0; x < tilesX; x++) {
      for (let y = 0; y < tilesY; y++) {
        tiles.push({
          position: { x: x * tileSize - halfX, y: y * tileSize - halfY },
          width: tileSize,
          height: tileSize,
        });
      }
    }

    // The start and end positions of the tiles to the closest tileSize px
    const startX = Math.floor(cameraX / tileSize) * tileSize;
    const endX = Math.ceil(cameraX / tileSize) * tileSize;
    const startY = Math.floor(cameraY / tileSize) * tileSize;
    const endY = Math.ceil(cameraY / tileSize) * tileSize;

    // Apply the start and end positions to the tiles
    tiles.forEach((tile) => {
      tile.position.x += startX + tileSize / 2;
      tile.position.y += startY + tileSize / 2;
    });

    return tiles;
  });

  readonly options = model.required<HtmlMapOptions>();
  private readonly defaultOptions: HtmlMapOptions = {
    panBy: ['middleMouse', 'rightMouse'],
    showGrid: true,
  };

  //#region CSS variables

  @HostBinding('style.--transform3DX') get _cssTransform3DX() {
    return `${this.transform3DX()}`;
  }
  @HostBinding('style.--transform3DY') get _cssTransform3DY() {
    return `${this.transform3DY()}`;
  }
  @HostBinding('style.--camera-spring-arm-length')
  get _cssCameraSpringArmLength() {
    return `${-1 * this.cameraSpringArmLength()}px`;
  }
  @HostBinding('style.--backgroundSize') _cssBackgroundSize = '100px';
  @HostBinding('style.--originX') _cssOriginX = '0px';
  @HostBinding('style.--originY') _cssOriginY = '0px';

  @HostBinding('style.--width') cssWidth = '100%';
  @HostBinding('style.--height') cssHeight = '100%';
  @HostBinding('style.--scaledWidth') cssScaledWidth = '0';
  @HostBinding('style.--scaledHeight') cssScaledHeight = '0';

  //#endregion

  @HostBinding('style.--perspective') get _cssPerspective() {
    return `${this.perspective}px`;
  }

  readonly springArmLimits = { min: -1000, max: 10000 } as const;

  get scale() {
    return this.htmlMapService.scale;
  }
  get cameraSpringArmLength() {
    return this.htmlMapService.cameraSpringArmLength;
  }
  get perspective() {
    return this.htmlMapService.perspective;
  }
  get scaleFactor() {
    return this.htmlMapService.scaleFactor;
  }

  get camera() {
    return this.htmlMapService.camera;
  }

  readonly transform3DX = computed(() => {
    const originX = this.camera.originX();
    return `${-1 * originX}px`;
  });
  readonly transform3DY = computed(() => {
    const originY = this.camera.originY();
    return `${-1 * originY}px`;
  });

  //#region Resize
  readonly scene = viewChild.required<ElementRef<HTMLElement>>('scene');

  @ViewChild('wrapper', { static: true }) wrapper?: ElementRef<HTMLElement>;
  readonly wrapperElement =
    viewChild.required<ElementRef<HTMLElement>>('wrapper');

  private resizeObserver: ResizeObserver = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect;
    this.onResize(width, height);
  });
  private onResize(width: number, height: number): void {
    this.camera.onWrapperElementResize(width, height);
    this.centerTiles();
  }
  centerTiles() {}
  //#endregion

  constructor() {
    if (this._services._parentHtmlService) {
      this.htmlMapService = this._services._parentHtmlService;
      this._services._selfHtmlService = this.htmlMapService;
    } else {
      this.htmlMapService = this._services._selfHtmlService;
      this._services._parentHtmlService = this.htmlMapService;
    }
    this.htmlMapService.component.set(this);

    effect(() => {
      this._cssOriginX = `${this.camera.originX()}px`;
    });
    effect(() => {
      this._cssOriginY = `${this.camera.originY()}px`;
    });
  }
  ngOnInit(): void {
    this.resizeObserver.observe(this.wrapper?.nativeElement!);

    const options = this.options();
    this.options.set({ ...this.defaultOptions, ...options });
  }
  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  public mousewheel(e: Event) {
    const event = e as WheelEvent;
    event.preventDefault();

    const delta = event.deltaY / 1000;

    const previousSpringArmLength = this.cameraSpringArmLength();

    this.cameraSpringArmLength.set(
      Math.min(
        Math.max(
          previousSpringArmLength +
            delta *
              (this.scaleFactor + Math.abs(previousSpringArmLength) / 1.5),

          this.springArmLimits.min
        ),
        this.springArmLimits.max
      )
    );
  }

  public keyup(event: KeyboardEvent) {}
  public keydown(event: KeyboardEvent) {}

  public contextmenu(event: MouseEvent) {}

  //#region Panning
  public mousedown(event: MouseEvent) {
    this.camera.mouseDown(event);
  }
  public mouseup(event: MouseEvent) {
    this.camera.mouseUp(event);
  }
  public mousemove(event: MouseEvent) {
    this.camera.mouseMove(event);
  }
  public mouseleave(event: MouseEvent) {
    this.camera.mouseLeave(event);
  }
  //#endregion

  public toggleGrid() {
    this.options.set({
      ...this.options(),
      showGrid: !this.options().showGrid,
    });
  }
}
