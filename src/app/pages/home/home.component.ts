import { Component } from '@angular/core';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { DashLogicaComponent } from '../../components/dashboard/dash-logica/dash-logica.component';
import { GradeComponent } from '../../components/grade/grade.component';
import { GraficosComponent } from '../../components/graficos/graficos.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MenuLateralComponent,
    GradeComponent,
    GraficosComponent,
    DashLogicaComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
