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
} from '@angular/core';

@Component({
  selector: 'lib-html-map',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './html-map.component.html',
  styleUrl: './html-map.component.scss',
})
export class HtmlMapComponent {
  //#region CSS variables

  @HostBinding('style.--scale') get _cssScale() {
    return this.scale();
  }

  @HostBinding('style.--transform3DX') get _cssTransform3DX() {
    return `${this.transform3DX()}`;
  }
  @HostBinding('style.--transform3DY') get _cssTransform3DY() {
    return `${this.transform3DY()}`;
  }
  @HostBinding('style.--transform3DZ') get _cssTransform3DZ() {
    return `${this.transform3DZ()}`;
  }

  @HostBinding('style.--backgroundSize') _cssBackgroundSize = '100px';
  @HostBinding('style.--originX') _cssOriginX = '0px';
  @HostBinding('style.--originY') _cssOriginY = '0px';

  @HostBinding('style.--width') cssWidth = '100%';
  @HostBinding('style.--height') cssHeight = '100%';
  @HostBinding('style.--scaledWidth') cssScaledWidth = '0';
  @HostBinding('style.--scaledHeight') cssScaledHeight = '0';

  //#endregion

  readonly camera: HtmlMapCamera = new HtmlMapCamera();
  readonly scale = this.camera.scale;
  readonly scaleFactor = 1000;

  /**
   * at 1 scale it should be 0px
   * at scale larger than 1 it should be positive
   * at scale less than 1 it should be negative
   */
  readonly transform3DZ = computed(() => {
    const scale = this.scale();
    return `${-1 * (this.scaleFactor * (1 - scale))}px`;
  });
  readonly transform3DX = computed(() => {
    const originX = this.camera.originX();
    return `${-1 * originX}px`;
  });
  readonly transform3DY = computed(() => {
    const originY = this.camera.originY();
    return `${-1 * originY}px`;
  });

  readonly nodes: INode[] = [
    { position: { x: 100, y: 100 } },
    { position: { x: 200, y: 200 } },
    { position: { x: 300, y: 300 } },
  ];

  constructor() {
    effect(() => {
      this._cssOriginX = `${this.camera.originX()}px`;
    });
    effect(() => {
      this._cssOriginY = `${this.camera.originY()}px`;
    });
  }

  public mousewheel(e: Event) {
    const limits = { min: 0.01, max: 2 };

    const event = e as WheelEvent;
    event.preventDefault();

    const delta = event.deltaY / 1000;
    const offset = this.scale() + -delta;
    const newScale = Math.min(Math.max(offset, limits.min), limits.max);

    this.scale.set(newScale);
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

  //#region Dragging
  dragConstrainPoint = (
    userPointerPosition: Point,
    dragRef: DragRef<INode>,
    dimensions: DOMRect,
    pickupPositionInElement: Point
  ) => {
    const scale = this.scale(); // * this.scaleFactor;

    const newPoint = { ...userPointerPosition };

    // Adjusting for the pickup position
    newPoint.x -= pickupPositionInElement.x;
    newPoint.y -= pickupPositionInElement.y;

    // Adjusting for scale
    // The idea is to scale the difference between the original and the new position
    // This ensures that the element moves in sync with the cursor
    // newPoint.x = (newPoint.x - dimensions.left) / scale + dimensions.left;
    // newPoint.y = (newPoint.y - dimensions.top) / scale + dimensions.top;

    return newPoint;
  };

  nodeDragMoved(event: CdkDragMove, node: INode) {
    node.pendingPosition = event.source.getFreeDragPosition();
  }
  nodeDragEnded(event: CdkDragEnd, node: INode) {
    node.position.x = event.source.getFreeDragPosition().x;
    node.position.y = event.source.getFreeDragPosition().y;

    node.pendingPosition = undefined;
  }
  //#endregion
}

interface INode {
  pendingPosition?: Point;
  position: Point;
}

export class HtmlMapCamera {
  readonly scale = signal(1);

  //#region Top Left Corner
  /** Top left corner position of the div used as the "Camera" */
  readonly originX = signal(0);
  readonly originY = signal(0);
  //#endregion

  //#region Center of the screen
  /** Center of the screen */
  readonly cameraX = computed(() => {
    const width = this.baseWidth();
    const scale = this.scale();
    const originX = this.originX();

    return originX + width / 2 / scale;
  });
  readonly cameraY = computed(() => {
    const height = this.baseHeight();
    const scale = this.scale();
    const originY = this.originY();

    return originY + height / 2 / scale;
  });
  //#endregion

  /** Width of the resize wrapper element */
  readonly baseWidth = signal(0);
  readonly baseHeight = signal(0);
  /** Width of the transform scaled graph element */
  readonly scaledWidth = computed(() => this.baseWidth() / this.scale());
  readonly scaledHeight = computed(() => this.baseHeight() / this.scale());

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

  constructor() {}

  /**
   * Sets the camera position, which is centered on the screen
   * based on offsetting by half the width and height of the base top left corner
   */
  public setCameraPosition(point: Point) {
    const width = this.baseWidth();
    const height = this.baseHeight();
    const scale = this.scale();

    const x = point.x - width / 2 / scale;
    const y = point.y - height / 2 / scale;

    this.originX.set(x);
    this.originY.set(y);
  }

  public onWrapperElementResize(width: number, height: number) {
    const cameraPositionBeforeResize = this.cameraPosition();

    this.baseWidth.set(width);
    this.baseHeight.set(height);

    this.setCameraPosition(cameraPositionBeforeResize);
  }

  public dispose() {}

  //#region Zooming
  public mouseWheel(e: Event) {
    const limits = { min: 0.1, max: 2 };

    const event = e as WheelEvent;
    event.preventDefault();

    const delta = event.deltaY / 1000;
    const offset = this.scale() + -delta;
    const newScale = Math.min(Math.max(offset, limits.min), limits.max);

    this.onScale(newScale);
  }
  public onScale(scale: number) {
    const cameraPositionBeforeScale = this.cameraPosition();
    this.scale.set(scale);
    this.setCameraPosition(cameraPositionBeforeScale);
  }
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
      // const dx = (event.clientX - this.startDragX()) / currentZoom;
      // const dy = (event.clientY - this.startDragY()) / currentZoom;
      const dx = event.clientX - this.startDragX();
      const dy = event.clientY - this.startDragY();

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
