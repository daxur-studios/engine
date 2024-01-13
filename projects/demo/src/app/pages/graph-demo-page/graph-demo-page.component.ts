import { Component, WritableSignal, signal } from '@angular/core';
import { IGraphOptions } from 'projects/daxur-studios/graph/src/lib/models';
import { GraphComponent } from 'projects/daxur-studios/graph/src/public-api';

@Component({
  selector: 'app-graph-demo-page',
  standalone: true,
  imports: [GraphComponent],
  templateUrl: './graph-demo-page.component.html',
  styleUrl: './graph-demo-page.component.scss',
})
export class GraphDemoPageComponent {
  public readonly options: WritableSignal<IGraphOptions<any>> = signal({
    nodes: [
      {
        data: {},
        edges: [{ from: '1', to: '2', id: '1-2' }],
        id: '1',
        position: { x: 45, y: 45 },
      },
      {
        data: {},
        edges: [],
        id: '2',
        position: { x: 200, y: 200 },
      },
    ],
  });
}
