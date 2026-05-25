import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/auth-page/auth-page')
        .then(m => m.AuthPage)
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout')
        .then(m => m.Layout),
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      },
      {
        path: 'main',
        loadComponent: () =>
          import('./main-page/main-page')
            .then(m => m.MainPage)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];