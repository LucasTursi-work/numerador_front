import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpf',
  standalone: true, // Importante para componentes standalone
})
export class CpfPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');

    // Aplica a formatação
    return numericValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}
