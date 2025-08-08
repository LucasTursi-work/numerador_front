import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BotaoComponent } from '../../botao/botao.component';
import { CommonModule, NgFor } from '@angular/common';
import { Documento} from '../../../shared/models/document.model';

@Component({
  selector: 'app-dash-numerador',
  standalone: true,
  imports: [CommonModule, NgFor, BotaoComponent, EventEmitter],
  templateUrl: './dash-numerador.component.html',
  styleUrl: './dash-numerador.component.scss',
})
export class DashNumeradorComponent {
  @Input() documento.nome: string = '';
  @Input() documento.contador: number = 0;
  @Input() index: number = 0;
  @Output() gerarDocumento = new EventEmitter<number>();

    constructor(private documento: Documento) {}

  onGerarDocumento() {
    this.gerarDocumento.emit(this.index);
  }
}
