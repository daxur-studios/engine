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
      children?: { name: string; path: string }[];
    }[];
  }[] = [
    {
      name: 'Engine Demos',

      menu: [
        {
          name: 'Landscape Demo',
          path: 'engine-demo/landscape-demo',
        },
        {
          name: 'Empty Scene',
          path: 'engine-demo/empty',
        },
        {
          name: 'Level Editor',
          path: 'engine-demo/level-editor-demo',
        },
      ],
    },
    {
      name: 'UI Demos',

      menu: [
        {
          name: 'Nodes Demo',
          path: 'ui/node-demo',
        },
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
        {
          name: 'SVG UI Part 2',
          path: 'graph-demo/svg-ui-demo-part-2',
        },
        {
          name: 'SVG UI Part 3',
          path: 'graph-demo/svg-ui-demo-part-3',
        },
      ],
    },
  ];
}
