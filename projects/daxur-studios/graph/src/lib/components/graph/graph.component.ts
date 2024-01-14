import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  WritableSignal,
  effect,
  signal,
} from '@angular/core';
import { IGraphOptions } from '../../models';
import { GraphService } from '../../services';
import { GraphNodeComponent } from '../graph-node/graph-node.component';
import { GraphSidebarComponent } from '../graph-sidebar/graph-sidebar.component';

@Component({
  selector: 'lib-graph',
  standalone: true,
  imports: [
    DragDropModule,
    CommonModule,
    GraphSidebarComponent,
    GraphNodeComponent,
  ],
  providers: [GraphService],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit, OnDestroy {
  //#region Inputs
  @Input({ required: true }) options!: WritableSignal<IGraphOptions>;
  //#endregion

  //#region Signals

  //#region GraphService properties
  public get originX() {
    return this.graphService?.originX;
  }
  public get originY() {
    return this.graphService?.originY;
  }
  public get scale() {
    return this.graphService?.scale;
  }
  //#endregion

  readonly isDragging = signal(false);
  readonly startDragX = signal(0);
  readonly startDragY = signal(0);
  //#endregion

  //#region ViewChild
  @ViewChild('resizeWrapper', { static: true })
  resizeWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('graphDragBox', { static: true })
  graphDragBox!: ElementRef<HTMLDivElement>;
  //#endregion

  @HostBinding('class')
  cssClass = 'flex-page';
  //#region CSS variables
  @HostBinding('style.--backgroundSize') cssBackgroundSize = '100px';
  @HostBinding('style.--scale') cssZoom = '1';
  @HostBinding('style.--originX') cssOriginX = '0px';
  @HostBinding('style.--originY') cssOriginY = '0px';

  @HostBinding('style.--width') cssWidth = '100%';
  @HostBinding('style.--height') cssHeight = '100%';
  //#endregion

  //#region Resize
  @ViewChild('wrapper', { static: true }) wrapper?: ElementRef<HTMLElement>;

  private resizeObserver: ResizeObserver = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect;
    this.onResize(width, height);
  });
  private onResize(width: number, height: number): void {
    this.graphService.width.set(width);
    this.graphService.height.set(height);
  }
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
      const currentZoom = this.scale();

      // Adjust the deltas based on the current scale level
      const dx = (event.clientX - this.startDragX()) / currentZoom;
      const dy = (event.clientY - this.startDragY()) / currentZoom;

      this.graphService.setPosition({
        x: this.originX() + dx,
        y: this.originY() + dy,
      });

      this.startDragX.set(event.clientX);
      this.startDragY.set(event.clientY);
    }
  }
  public mousewheel(e: Event) {
    const limits = { min: 0.1, max: 2 };

    const event = e as WheelEvent;
    event.preventDefault();
    const delta = event.deltaY / 1000;
    const offset = this.scale() + -delta;
    const newScale = Math.min(Math.max(offset, limits.min), limits.max);

    this.scale.set(newScale);
  }
  public contextmenu(event: MouseEvent) {
    return;
    event.preventDefault();
  }
  //#endregion

  constructor(public graphService: GraphService) {
    effect(() => {
      const scale = this.scale();
      this.cssZoom = `${scale}`;

      this.cssWidth = `${100 / scale}%`;
      this.cssHeight = `${100 / scale}%`;
    });
    effect(() => {
      this.cssOriginX = `${this.originX()}px`;
    });
    effect(() => {
      this.cssOriginY = `${this.originY()}px`;
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }
  ngOnInit(): void {
    this.resizeObserver.observe(this.resizeWrapper.nativeElement);

    //#region Move the graph to the center of the
    setTimeout(() => {}, 10);

    //#endregion
  }
  ngAfterViewInit() {
    const graphRect = this.graphDragBox.nativeElement.getBoundingClientRect();
    const viewportCenterX = graphRect.width / 2;
    const viewportCenterY = graphRect.height / 2;

    this.graphService.setPosition({
      x: viewportCenterX,
      y: viewportCenterY,
    });
  }
}
