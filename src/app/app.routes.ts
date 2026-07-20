import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/auth-page/auth-page').then(
        (module) => module.AuthPage,
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout').then(
        (module) => module.Layout,
      ),
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full',
      },
      {
        path: 'main',
        loadComponent: () =>
          import('./main-page/main-page').then(
            (module) => module.MainPage,
          ),
      },
      {
        path: 'catalog',
        loadComponent: () =>
          import('@pages/catalog-page/catalog-page').then(
            (module) => module.CatalogPage,
          ),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/about-page/about-page').then(
            (module) => module.AboutPage,
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found').then(
        (module) => module.NotFound,
      ),
  },
];
