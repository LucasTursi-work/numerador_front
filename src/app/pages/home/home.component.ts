import { Component } from '@angular/core';
import { GradeComponent } from '../../components/grade/grade.component';
import { GraficosComponent } from '../../components/graficos/graficos.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GradeComponent, GraficosComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
