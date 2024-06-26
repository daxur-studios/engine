import { Component, WritableSignal, signal } from '@angular/core';
import { GraphComponent, GraphController } from '@daxur-studios/ui';

@Component({
  selector: 'app-graph-demo-page',
  standalone: true,
  imports: [GraphComponent],
  templateUrl: './graph-demo-page.component.html',
  styleUrl: './graph-demo-page.component.scss',
})
export class GraphDemoPageComponent {
  public readonly controller: WritableSignal<GraphController<any>> = signal(
    new GraphController({
      inputs: [],
      outputs: [],
      nodes: [
        {
          data: {},
          id: '1',
          position: { x: 45, y: 45 },
        },
        {
          data: {},
          id: '2',
          position: { x: 200, y: 200 },
        },
      ],
    })
  );
}
