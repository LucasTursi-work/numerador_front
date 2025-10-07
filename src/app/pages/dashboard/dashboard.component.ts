import { Component } from '@angular/core';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { CommonModule } from '@angular/common';
import { NumeradorComponent } from '../../components/dashboard/numerador/numerador.component';
import { GraficosComponent } from '../../components/dashboard/graficos/graficos.component';
import { LogsComponent } from '../../components/dashboard/logs/logs.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MenuLateralComponent,
    NumeradorComponent,
    GraficosComponent,
    LogsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
