import {
  Component,
  HostBinding,
  Input,
  WritableSignal,
  signal,
} from '@angular/core';
import { GraphController, INode } from '../../models';
import { GraphService } from '../../services';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  DragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'lib-graph-sidebar',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './graph-sidebar.component.html',
  styleUrl: './graph-sidebar.component.scss',
})
export class GraphSidebarComponent {
  //#region Inputs
  @Input({ required: true }) controller!: WritableSignal<GraphController>;
  //#endregion

  @HostBinding('style.--width') cssWidth = '15rem';
  readonly isSidebarOpen = signal(true);

  constructor(public graphService: GraphService) {}

  public toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
    this.cssWidth = this.isSidebarOpen() ? '15rem' : '0rem';
  }

  public goToNode(node: INode) {
    this.graphService.goToNode(node);
  }

  public addNode() {
    this.controller().nodes.push({
      data: {},
      id: this.controller().nodes.length + 1 + '',
      position: {
        x: 0,
        y: 0,
      },
    });
  }

  public drop(event: CdkDragDrop<INode<any>[], any, any>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
