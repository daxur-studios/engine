import { Point } from '@angular/cdk/drag-drop';
import { Injectable, Signal, computed, signal } from '@angular/core';
import type { HtmlMapComponent, HtmlMapOptions } from './html-map.component';

@Injectable()
export class HtmlMapService {
  // readonly cameraOffset = signal({ x: 0, y: 0 });
  //readonly options = signal<HtmlMapOptions>({});
  readonly component = signal<HtmlMapComponent | undefined>(undefined);

  readonly scale = computed(() => {
    return this.calculateScale(this.cameraSpringArmLength(), this.perspective);
  });
  readonly perspective = 1000;

  readonly scaleFactor = 100;

  readonly cameraSpringArmLength = signal(0);

  readonly camera: HtmlMapCamera = new HtmlMapCamera(this);

  constructor() {}

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

  public getElementWorldPosition(element: HTMLElement): Point {
    // Select the elements
    var nestedElement = element;
    var containerElement = this.component()?.scene().nativeElement;
    if (!containerElement) {
      console.error('No scene element found');

      return { x: 0, y: 0 };
    }

    // Get the bounding rectangle of both elements
    var nestedRect = nestedElement.getBoundingClientRect();
    var containerRect = containerElement.getBoundingClientRect();

    console.warn({ nestedRect, containerRect });

    // Calculate offsets
    var offsetX = nestedRect.left - containerRect.left;
    var offsetY = nestedRect.top - containerRect.top;

    console.log('Offset X:', offsetX, 'Offset Y:', offsetY);
    const a = { x: offsetX, y: offsetY };

    // center offset
    a.x -= nestedRect.width / 2;
    a.y += nestedRect.height / 2;

    // apply scale
    a.x = a.x / this.scale();
    a.y = a.y / this.scale();

    return a;
  }
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
  readonly scale: Signal<number>;
  constructor(readonly service: HtmlMapService) {
    this.scale = service.scale;
  }

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

    // Check if the mouse button pressed is one of the specified in panBy
    const mouseButtonMap = {
      0: 'leftMouse',
      1: 'middleMouse',
      2: 'rightMouse',
    } as const;
    const mouseButtonPressed = mouseButtonMap[
      event.button as keyof typeof mouseButtonMap
    ] as HtmlMapPanBy;
    if (
      this.service.component()?.options()?.panBy?.includes(mouseButtonPressed)
    ) {
      this.isDragging.set(true);
      this.startDragX.set(event.clientX);
      this.startDragY.set(event.clientY);
    }
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

export type HtmlMapPanBy = 'leftMouse' | 'rightMouse' | 'middleMouse';
