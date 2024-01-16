import { DragDropModule, Point } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren,
  WritableSignal,
  effect,
  signal,
} from '@angular/core';
import { IGraphOptions, INode } from '../../models';
import { GraphService } from '../../services';
import { GraphNodeComponent } from '../graph-node/graph-node.component';
import { GraphSidebarComponent } from '../graph-sidebar/graph-sidebar.component';
import { Subject } from 'rxjs';

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

  readonly camera = this.graphService.camera;
  //#region Signals

  //#region GraphService Signals
  readonly originX = this.graphService.originX;
  readonly originY = this.graphService.originY;
  readonly scale = this.graphService.scale;
  readonly width = this.graphService.width;
  readonly height = this.graphService.height;
  //#endregion

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
  @HostBinding('style.--scaledWidth') cssScaledWidth = '0';
  @HostBinding('style.--scaledHeight') cssScaledHeight = '0';
  //#endregion

  //#region ViewChild
  @ViewChild('resizeWrapper', { static: true })
  resizeWrapper?: ElementRef<HTMLDivElement>;
  @ViewChild('graphDragBox', { static: true })
  graphDragBox?: ElementRef<HTMLDivElement>;

  @ViewChildren(GraphNodeComponent) graphNodes?: GraphNodeComponent[];
  //#endregion

  //#region Resize
  @ViewChild('wrapper', { static: true }) wrapper?: ElementRef<HTMLElement>;

  private resizeObserver: ResizeObserver = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect;
    this.onResize(width, height);
  });
  private onResize(width: number, height: number): void {
    this.camera.onWrapperElementResize(width, height);
  }
  //#endregion

  //#region Input events
  public keyup(event: KeyboardEvent) {}
  public keydown(event: KeyboardEvent) {
    this.camera.onKeyDown(event);
  }
  public mousedown(event: MouseEvent) {
    this.camera.mouseDown(event);
  }
  public mouseup(event: MouseEvent) {
    this.camera.mouseUp(event);
  }
  public mousemove(event: MouseEvent) {
    this.camera.mouseMove(event);
  }
  public mousewheel(e: Event) {
    this.camera.mouseWheel(e);
  }
  public contextmenu(event: MouseEvent) {
    return;
    event.preventDefault();
  }
  //#endregion

  constructor(public graphService: GraphService) {
    this.graphService.component = this;

    effect(() => {
      const scale = this.scale();
      this.cssZoom = `${scale}`;

      const w = this.width();
      const h = this.height();

      this.cssWidth = `${100 / scale}%`;
      this.cssHeight = `${100 / scale}%`;
      //this.cssHeight = `${h / scale}px`;
    });
    effect(() => {
      this.cssScaledWidth = `${this.camera.scaledWidth()}px`;
      this.cssScaledHeight = `${this.camera.scaledHeight()}px`;
    });
    effect(() => {
      this.cssOriginX = `${this.originX()}px`;
    });
    effect(() => {
      this.cssOriginY = `${this.originY()}px`;
    });

    this.graphService.camera.assignComponent(this);
  }

  readonly onDestroy = new Subject<void>();
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
    this.resizeObserver.disconnect();
  }
  ngOnInit(): void {
    //#region TEST
    const wrapper = this.resizeWrapper!.nativeElement;
    this.camera.baseWidth.set(wrapper.clientWidth);
    this.camera.baseHeight.set(wrapper.clientHeight);
    //#endregion

    this.resizeObserver.observe(this.resizeWrapper!.nativeElement);
  }
  ngAfterViewInit() {
    // Center the graph
    // const graphRect = this.graphDragBox!.nativeElement.getBoundingClientRect();
    // const viewportCenterX = graphRect.width / 2;
    // const viewportCenterY = graphRect.height / 2;
    // this.graphService.setCameraPosition({
    //   x: viewportCenterX,
    //   y: viewportCenterY,
    // });
    this.camera.setCameraPosition({ x: 0, y: 0 });
  }

  focusNode(node: INode) {
    this.graphNodes
      ?.find((n) => n.node === node)
      ?.nodeElement?.nativeElement?.focus();
  }
}
