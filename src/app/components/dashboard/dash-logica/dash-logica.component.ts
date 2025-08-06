import { Component } from '@angular/core';
import { DashLogsComponent } from '../dash-logs/dash-logs.component';
import { DashGraficosComponent } from '../dash-graficos/dash-graficos.component';
import { DashNumeradorComponent } from '../dash-numerador/dash-numerador.component';

@Component({
  selector: 'app-dash-logica',
  standalone: true,
  imports: [DashLogsComponent, DashGraficosComponent, DashNumeradorComponent],
  templateUrl: './dash-logica.component.html',
  styleUrl: './dash-logica.component.scss',
})
export class DashLogicaComponent {}
