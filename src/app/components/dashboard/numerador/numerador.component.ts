import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BotaoComponent } from '../../botao/botao.component';
import { CommonModule } from '@angular/common';
import { Documento } from '../../../shared/models/document.model';

@Component({
  selector: 'app-numerador',
  standalone: true,
  imports: [CommonModule, BotaoComponent, EventEmitter],
  templateUrl: './numerador.component.html',
  styleUrl: './numerador.component.scss',
})
export class NumeradorComponent {
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
