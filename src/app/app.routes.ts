import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SplashComponent } from './pages/splash/splash.component';
import { ListaUsuariosComponent } from './pages/lista-usuarios/lista-usuarios.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: SplashComponent,
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
