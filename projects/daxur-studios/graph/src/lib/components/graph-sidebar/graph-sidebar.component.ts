import {
  Component,
  HostBinding,
  Input,
  WritableSignal,
  signal,
} from '@angular/core';
import { IGraphOptions, INode } from '../../models';
import { GraphService } from '../../services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-graph-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graph-sidebar.component.html',
  styleUrl: './graph-sidebar.component.scss',
})
export class GraphSidebarComponent {
  //#region Inputs
  @Input({ required: true }) options!: WritableSignal<IGraphOptions>;
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
    this.options().nodes.push({
      data: {},
      edges: [],
      id: this.options().nodes.length + '',
      position: {
        x: 0,
        y: 0,
      },
    });
  }
}
