import {
  Component,
  HostBinding,
  Input,
  WritableSignal,
  signal,
} from '@angular/core';
import { IGraphOptions } from '../../models';

@Component({
  selector: 'lib-graph-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './graph-sidebar.component.html',
  styleUrl: './graph-sidebar.component.scss',
})
export class GraphSidebarComponent {
  //#region Inputs
  @Input({ required: true }) options!: WritableSignal<IGraphOptions>;
  //#endregion

  @HostBinding('style.--width') cssWidth = '15rem';
  readonly isSidebarOpen = signal(true);

  constructor() {}

  public toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
    this.cssWidth = this.isSidebarOpen() ? '15rem' : '0rem';
  }
}
