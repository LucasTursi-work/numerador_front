import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BotaoComponent } from '../../botao/botao.component';
import { CommonModule } from '@angular/common';
import { Documento } from '../../../shared/models/document.model';

@Component({
  selector: 'app-dash-numerador',
  standalone: true,
  imports: [CommonModule, BotaoComponent, EventEmitter],
  templateUrl: './dash-numerador.component.html',
  styleUrl: './dash-numerador.component.scss',
})
export class DashNumeradorComponent {
  @Input() documento: Documento = {
    nome: '',
    contador: 0,
  };
  @Input() index: number = 0;
  @Output() gerarDocumento = new EventEmitter<number>();

  onGerarDocumento() {
    this.documento.contador++;
    this.gerarDocumento.emit(this.index);
  }
}
