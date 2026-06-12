import { Routes } from '@angular/router';
import { SplashComponent } from './pages/splash/splash.component';
import { ListaUsuariosComponent } from './pages/lista-usuarios/lista-usuarios.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TiposDeDocumentoComponent } from './pages/tipos-de-documento/tipos-de-documento.component';
import { CartoriosCadastradosComponent } from './pages/cartorios-cadastrados/cartorios-cadastrados.component';
import { RelatoriosComponent } from './pages/relatorios/relatorios.component';

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
    path: 'cartoriosCadastrados',
    component: CartoriosCadastradosComponent,
  },
  {
    path: 'relatorios',
    component: RelatoriosComponent,
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
