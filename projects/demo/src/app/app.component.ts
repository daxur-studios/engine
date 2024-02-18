import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

import { AxesHelper } from 'three';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { ThemeController } from './theme/theme.controller';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatListModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'demo';

  readonly themeController = new ThemeController();

  // [['engine-demo','Engine'],['graph-demo','Graph']]
  readonly links: {
    name: string;
    menu?: {
      name: string;
      path: string;
    }[];
  }[] = [
    {
      name: 'Engine Demos',

      menu: [
        {
          name: 'Empty Scene',
          path: 'engine-demo/empty',
        },
        {
          name: 'Virtual Grid',
          path: 'engine-demo/virtual-grid',
        },
        {
          name: 'Level Editor',
          path: 'engine-demo/level-editor-demo',
        },
      ],
    },
    {
      name: 'Graph Demos',

      menu: [
        {
          name: 'Basic Graph',
          path: 'graph-demo/graph',
        },
        {
          name: 'Basic HTML Map',
          path: 'graph-demo/basic-html-map-demo',
        },
        {
          name: 'SVG UI',
          path: 'graph-demo/svg-ui-demo',
        },
      ],
    },
  ];
}
