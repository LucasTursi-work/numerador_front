import { Component } from '@angular/core';
import { GradeComponent } from '../../components/grade/grade.component';
import { GraficosComponent } from '../../components/graficos/graficos.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GradeComponent, GraficosComponent, MenuLateralComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
