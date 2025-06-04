import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-botao',
  standalone: true,
  imports: [],
  templateUrl: './botao.component.html',
  styleUrl: './botao.component.scss',
})
export class BotaoComponent {
  @Input() texto: string = '';
  @Output() aoClicar = new EventEmitter<void>();

  onClick() {
    this.aoClicar.emit();
  }
}
