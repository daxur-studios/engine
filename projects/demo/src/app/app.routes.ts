import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'engine-demo/empty',
    loadComponent: () =>
      import('./pages/engine/engine-demo-page/engine-demo-page.component').then(
        (m) => m.EngineDemoPageComponent
      ),
  },
  {
    path: 'engine-demo/virtual-grid',
    loadComponent: () =>
      import(
        './pages/engine/engine-virtual-grid-demo/engine-virtual-grid-demo.component'
      ).then((m) => m.EngineVirtualGridDemoComponent),
  },
  {
    path: 'engine-demo/level-editor-demo',
    loadComponent: () =>
      import(
        './pages/engine/level-editor-demo/level-editor-demo.component'
      ).then((m) => m.LevelEditorDemoComponent),
  },
  {
    path: 'graph-demo/graph',
    loadComponent: () =>
      import('./pages/graph-demo-page/graph-demo-page.component').then(
        (m) => m.GraphDemoPageComponent
      ),
  },
  {
    path: 'graph-demo/basic-html-map-demo',
    loadComponent: () =>
      import(
        './pages/html-map-demo/basic-html-map-demo/basic-html-map-demo.component'
      ).then((m) => m.BasicHtmlMapDemoComponent),
  },
  {
    path: 'graph-demo/svg-ui-demo',
    loadComponent: () =>
      import('./pages/svg-ui-demo-page/svg-ui-demo-page.component').then(
        (m) => m.SvgUiDemoPageComponent
      ),
  },
  {
    path: 'graph-demo/svg-ui-demo-part-2',
    loadComponent: () =>
      import(
        './pages/svg-ui-demo-page/svg-ui-demo-p2/svg-ui-demo-p2.component'
      ).then((m) => m.SvgUiDemoP2Component),
  },
  {
    path: 'graph-demo/svg-ui-demo-part-3',
    loadComponent: () =>
      import(
        './pages/svg-ui-demo-page/svg-ui-demo-p3/svg-ui-demo-p3.component'
      ).then((m) => m.SvgUiDemoP3Component),
  },
];
