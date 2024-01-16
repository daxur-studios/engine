import { computed, signal, Signal } from '@angular/core';
import type { GraphComponent } from '../components/graph/graph.component';
import { Point } from '@angular/cdk/drag-drop';

export class GraphCamera {
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
      const dx = (event.clientX - this.startDragX()) / currentZoom;
      const dy = (event.clientY - this.startDragY()) / currentZoom;

      this.originX.set(this.originX() - dx);
      this.originY.set(this.originY() - dy);

      this.startDragX.set(event.clientX);
      this.startDragY.set(event.clientY);
    }
  }
  //#endregion

  //#region Graph Component
  public component?: GraphComponent;
  public assignComponent(component: GraphComponent) {
    this.component = component;
    // this.component.onDestroy;
  }
  //#endregion
}
