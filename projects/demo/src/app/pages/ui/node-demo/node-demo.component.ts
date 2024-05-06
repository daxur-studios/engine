import { Component } from '@angular/core';
import { BluePrintPageComponent, HtmlMapComponent } from '@daxur-studios/ui';

@Component({
  selector: 'app-node-demo',
  standalone: true,
  imports: [HtmlMapComponent, BluePrintPageComponent],
  templateUrl: './node-demo.component.html',
  styleUrl: './node-demo.component.scss',
})
export class NodeDemoComponent {}
