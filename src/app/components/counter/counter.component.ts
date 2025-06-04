import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss',
})
export class CounterComponent implements OnInit {
  @Input() documentId: string; // Identificador único do documento
  @Input() storageKey = 'documentCounters'; // Chave para localStorage

  count: number = 0;

  ngOnInit() {
    this.loadCount();
  }

  increment() {
    this.count++;
    this.saveCount();
  }

  private loadCount() {
    const counters = JSON.parse(localStorage.getItem(this.storageKey)) || {};
    this.count = counters[this.documentId] || 0;
  }

  private saveCount() {
    const counters = JSON.parse(localStorage.getItem(this.storageKey)) || {};
    counters[this.documentId] = this.count;
    localStorage.setItem(this.storageKey, JSON.stringify(counters));
  }
}
