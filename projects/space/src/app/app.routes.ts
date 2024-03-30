import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    title: 'Home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'settings',
    title: 'Settings',
    loadComponent: () =>
      import('./pages/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
  },
];
