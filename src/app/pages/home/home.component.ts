import { Component } from '@angular/core';
import { GradeComponent } from '../../components/grade/grade.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GradeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
