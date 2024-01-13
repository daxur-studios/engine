import {
  Component,
  HostBinding,
  HostListener,
  Input,
  WritableSignal,
  effect,
  signal,
} from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IGraphOptions } from '../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-graph',
  standalone: true,
  imports: [DragDropModule, CommonModule],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent {
  //#region Signals
  readonly zoom = signal(1);

  readonly originX = signal(0);
  readonly originY = signal(0);
  readonly isDragging = signal(false);
  readonly startDragX = signal(0);
  readonly startDragY = signal(0);
  //#endregion

  @HostBinding('class') cssClass = 'flex-page';
  //#region CSS variables
  @HostBinding('style.--backgroundSize') cssBackgroundSize = '100px';
  @HostBinding('style.--zoom') cssZoom = '1';
  @HostBinding('style.--originX') cssOriginX = '0px';
  @HostBinding('style.--originY') cssOriginY = '0px';
  //#endregion

  //#region Input events
  public keyup(event: KeyboardEvent) {}
  public keydown(event: KeyboardEvent) {}
  public mousedown(event: MouseEvent) {
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
  public mouseup(event: MouseEvent) {
    this.isDragging.set(false);
  }
  public mousemove(event: MouseEvent) {
    if (this.isDragging()) {
      const currentZoom = this.zoom();

      // Adjust the deltas based on the current zoom level
      const dx = (event.clientX - this.startDragX()) / currentZoom;
      const dy = (event.clientY - this.startDragY()) / currentZoom;

      this.originX.set(this.originX() + dx);
      this.originY.set(this.originY() + dy);
      this.startDragX.set(event.clientX);
      this.startDragY.set(event.clientY);
    }
  }
  public mousewheel(e: Event) {
    const limits = { min: 0.1, max: 2 };

    const event = e as WheelEvent;
    event.preventDefault();
    const delta = event.deltaY / 1000;
    const offset = this.zoom() + -delta;
    const newScale = Math.min(Math.max(offset, limits.min), limits.max);

    this.zoom.set(newScale);
  }
  public contextmenu(event: MouseEvent) {
    return;
    event.preventDefault();
  }
  //#endregion

  @Input({ required: true }) options?: WritableSignal<IGraphOptions>;

  constructor() {
    effect(() => {
      this.cssZoom = `${this.zoom()}`;
      this.cssOriginX = `${this.originX()}px`;
      this.cssOriginY = `${this.originY()}px`;
    });
  }
}
