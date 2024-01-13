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
  readonly scale = signal(1);

  readonly originX = signal(0);
  readonly originY = signal(0);
  readonly isDragging = signal(false);
  readonly startDragX = signal(0);
  readonly startDragY = signal(0);
  //#endregion

  //#region CSS variables
  @HostBinding('class') class = 'flex-page';
  @HostBinding('style.--backgroundSize') backgroundSize = '100px';
  @HostBinding('style.--transform') transform = ``;
  //#endregion

  //#region Mousewheel zoom
  @HostListener('wheel', ['$event']) onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = event.deltaY / 1000;
    const newScale = this.scale() + -delta;
    this.scale.set(Math.min(Math.max(newScale, 0.1), 2));
  }
  //#endregion

  //#region Dragging the graph
  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    this.isDragging.set(true);
    this.startDragX.set(event.clientX);
    this.startDragY.set(event.clientY);
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    if (this.isDragging()) {
      const dx = event.clientX - this.startDragX();
      const dy = event.clientY - this.startDragY();
      this.originX.set(this.originX() + dx);
      this.originY.set(this.originY() + dy);
      this.startDragX.set(event.clientX);
      this.startDragY.set(event.clientY);
    }
  }

  @HostListener('mouseup') onMouseUp() {
    this.isDragging.set(false);
  }
  //#endregion

  @Input({ required: true }) options?: WritableSignal<IGraphOptions>;

  constructor() {
    effect(() => {
      this.transform = `translate(${this.originX()}px, ${this.originY()}px) scale(${this.scale()})`;
      this.backgroundSize = `${100 * this.scale()}px`;
    });
  }
}
