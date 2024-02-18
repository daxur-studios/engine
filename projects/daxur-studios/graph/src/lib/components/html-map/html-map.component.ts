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
} from '@angular/core';

@Component({
  selector: 'lib-html-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './html-map.component.html',
  styleUrl: './html-map.component.scss',
})
export class HtmlMapComponent implements OnInit, OnDestroy {
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

  @Input() set grid(value: boolean) {
    this.showTiles.set(value);
  }
  readonly showTiles = signal(true);

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
  readonly perspective = 1000;

  readonly scaleFactor = 100;

  readonly cameraSpringArmLength = signal(0);
  readonly springArmLimits = { min: -1000, max: 10000 } as const;

  readonly scale = computed(() => {
    return this.calculateScale(this.cameraSpringArmLength(), this.perspective);
  });
  readonly camera: HtmlMapCamera = new HtmlMapCamera(this.scale);

  readonly transform3DX = computed(() => {
    const originX = this.camera.originX();
    return `${-1 * originX}px`;
  });
  readonly transform3DY = computed(() => {
    const originY = this.camera.originY();
    return `${-1 * originY}px`;
  });

  //#region Resize
  @ViewChild('wrapper', { static: true }) wrapper?: ElementRef<HTMLElement>;

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
    effect(() => {
      this._cssOriginX = `${this.camera.originX()}px`;
    });
    effect(() => {
      this._cssOriginY = `${this.camera.originY()}px`;
    });
  }
  ngOnInit(): void {
    this.resizeObserver.observe(this.wrapper?.nativeElement!);
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
  /**
   * Calculates the scale of an item based on its distance from the viewer.
   *
   * @param {number} distance The distance the item has been moved along the Z-axis.
   * @param {number} perspective The perspective depth from the viewer to the item.
   * @returns {number} The calculated scale of the item.
   */
  calculateScale(distance: number, perspective: number): number {
    // Adjust this factor based on your specific needs. This is a simplification.
    // For a more accurate perspective effect, you might need a more complex formula.
    const scale = 1 / (1 + distance / perspective);
    return scale;
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
}

export class HtmlMapCamera {
  //#region Top Left Corner
  /** Top left corner position of the div used as the "Camera" */
  readonly originX = signal(0);
  readonly originY = signal(0);
  //#endregion

  //#region Center of the screen
  /** Center of the screen */
  readonly cameraX = computed(() => {
    const width = this.wrapperElementWidth();
    const originX = this.originX();

    return originX + width / 2;
  });
  readonly cameraY = computed(() => {
    const height = this.wrapperElementHeight();
    const originY = this.originY();

    return originY + height / 2;
  });
  //#endregion

  /** Width of the resize wrapper element */
  readonly wrapperElementWidth = signal(0);
  readonly wrapperElementHeight = signal(0);
  /** Width of the transform scaled graph element */
  readonly scaledWidth = computed(() => this.wrapperElementWidth());
  readonly scaledHeight = computed(() => this.wrapperElementHeight());

  /** Top Left Corner */
  // public filmPosition: Point = { x: 0, y: 0 };
  /** Center of the screen */
  readonly cameraPosition: Signal<Point> = computed(() => {
    return {
      x: this.cameraX(),
      y: this.cameraY(),
    };
  });

  //#region Panning
  readonly isDragging = signal(false);
  readonly startDragX = signal(0);
  readonly startDragY = signal(0);
  //#endregion

  constructor(readonly scale: Signal<number>) {}

  /**
   * Sets the camera position, which is centered on the screen
   * based on offsetting by half the width and height of the base top left corner
   */
  public setCameraPosition(point: Point) {
    // const width = this.wrapperElementWidth();
    // const height = this.wrapperElementHeight();
    // const x = point.x - width / 2;
    // const y = point.y - height / 2;
    // this.originX.set(x);
    // this.originY.set(y);
  }

  public onWrapperElementResize(width: number, height: number) {
    const cameraPositionBeforeResize = this.cameraPosition();

    this.wrapperElementWidth.set(width);
    this.wrapperElementHeight.set(height);

    this.setCameraPosition(cameraPositionBeforeResize);
  }

  public dispose() {}

  //#region Zooming
  //#endregion

  public onKeyDown(event: KeyboardEvent) {
    let movementAmount = 1;
    if (event.shiftKey) {
      movementAmount = 10;
    }

    switch (event.key) {
      case 'ArrowUp':
        this.originY.set(this.originY() - movementAmount);
        break;
      case 'ArrowDown':
        this.originY.set(this.originY() + movementAmount);
        break;
      case 'ArrowLeft':
        this.originX.set(this.originX() - movementAmount);
        break;
      case 'ArrowRight':
        this.originX.set(this.originX() + movementAmount);
        break;
    }
  }

  //#region Panning
  public mouseDown(event: MouseEvent) {
    // Check if we are clicking on a node
    if (event.target instanceof Element) {
      const element = event.target as Element;
      if (element.classList.contains('node') || element.closest('.node')) {
        this.isDragging.set(false);
        return;
      }
    }

    this.isDragging.set(true);
    this.startDragX.set(event.clientX);
    this.startDragY.set(event.clientY);
  }
  public mouseUp(event: MouseEvent) {
    this.isDragging.set(false);
  }
  public mouseMove(event: MouseEvent) {
    if (this.isDragging()) {
      const currentZoom = this.scale();

      // Adjust the deltas based on the current scale level
      const dx = (event.clientX - this.startDragX()) / currentZoom;
      const dy = (event.clientY - this.startDragY()) / currentZoom;

      this.originX.set(this.originX() - dx);
      this.originY.set(this.originY() - dy);

      this.startDragX.set(event.clientX);
      this.startDragY.set(event.clientY);
    }
  }
  public mouseLeave(event: MouseEvent) {
    this.isDragging.set(false);
  }
  //#endregion
}
