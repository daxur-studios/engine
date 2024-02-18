import { Component } from '@angular/core';
import { SvgUiEditorComponent } from '@daxur-studios/svg-ui';

@Component({
  selector: 'app-svg-ui-demo-page',
  standalone: true,
  imports: [SvgUiEditorComponent],
  templateUrl: './svg-ui-demo-page.component.html',
  styleUrl: './svg-ui-demo-page.component.scss',
})
export class SvgUiDemoPageComponent {}
