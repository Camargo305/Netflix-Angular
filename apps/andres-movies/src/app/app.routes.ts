import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: 'movies',
        loadChildren: () => import('./features/movies/movies/movies.route').then((m) => m.MoviesRoutes),
    },
    {
        path: 'my-list', // Nueva ruta para 'my-list'
        loadComponent: () => import('./features/movies/my-list/my-list.component').then((m) => m.MyListComponent),  // Ajusta esto con la ruta correcta de tu componente MyListComponent
    },
    {
        path: '**', //cuando nos venga cualquier ruta
        redirectTo: 'movies', //redirigir a movies
        pathMatch: 'full',
    }
];
