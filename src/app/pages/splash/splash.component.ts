import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [NgbModule],
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.scss',
})
export class SplashComponent {
  constructor(private router: Router) {}
  navDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
