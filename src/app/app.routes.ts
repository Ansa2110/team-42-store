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
        path: 'main',
        loadComponent: () =>
          import('./main-page/main-page')
            .then(m => m.MainPage)
      },
      /*
      {
        path: 'catalog',
        loadComponent: () =>
          import('./pages/catalog/catalog.component')
            .then(m => m.CatalogComponent)
      },
      {
        path: 'new-arrivals',
        loadComponent: () =>
          import('./pages/new-arrivals/new-arrivals.component')
            .then(m => m.NewArrivalsComponent)
      },
      {
        path: 'deals',
        loadComponent: () =>
          import('./pages/deals/deals.component')
            .then(m => m.DealsComponent)
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./pages/cart/cart.component')
            .then(m => m.CartComponent)
      }*/
    ]
  },

  {
    path: '**',
    redirectTo: ''
  }
];