import { Component, Input, WritableSignal } from '@angular/core';
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

  constructor() {}
}
