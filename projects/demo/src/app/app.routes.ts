import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'engine-demo',
    loadComponent: () =>
      import('./pages/engine-demo-page/engine-demo-page.component').then(
        (m) => m.EngineDemoPageComponent
      ),
  },
  {
    path: 'graph-demo',
    loadComponent: () =>
      import('./pages/graph-demo-page/graph-demo-page.component').then(
        (m) => m.GraphDemoPageComponent
      ),
  },
];
