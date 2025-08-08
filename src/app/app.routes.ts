import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ListaUsuariosComponent } from './pages/lista-usuarios/lista-usuarios.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'listaUsuarios',
    //component: ListaUsuariosComponent,
    loadComponent: () =>
      import('./pages/lista-usuarios/lista-usuarios.component').then(
        (c) => c.ListaUsuariosComponent
      ),
  },
];
