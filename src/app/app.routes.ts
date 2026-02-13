import { Routes } from '@angular/router';
import { SplashComponent } from './pages/splash/splash.component';
import { ListaUsuariosComponent } from './pages/lista-usuarios/lista-usuarios.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TiposDeDocumentoComponent } from './pages/tipos-de-documento/tipos-de-documento.component';

export const routes: Routes = [
  {
    path: '',
    component: SplashComponent,
  },
  {
    path: 'tiposDocumentos',
    component: TiposDeDocumentoComponent,
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
        (c) => c.ListaUsuariosComponent,
      ),
  },
];
