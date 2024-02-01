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
];
