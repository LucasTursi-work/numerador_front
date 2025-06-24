import { Component } from '@angular/core';
import { UsuarioService } from '../../modules/user/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-excluir-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <h2>Excluir Usuário</h2>
      <label for="id">ID do usuário:</label>
      <input id="id" type="number" [(ngModel)]="id" />
      <button (click)="excluir()">Excluir</button>
    </div>
  `,
})
export class ExcluirUsuarioComponent {
  id: number = 0;

  constructor(private usuarioService: UsuarioService) {}

  excluir() {
    if (!this.id || this.id <= 0) {
      alert('ID inválido.');
      return;
    }

    this.usuarioService.deletarUsuario(this.id).subscribe({
      next: () => {
        console.log(`Usuário ${this.id} excluído com sucesso.`);
        alert(`Usuário ${this.id} excluído.`);
      },
      error: (err) => {
        console.error('Erro ao excluir usuário:', err);
        alert('Erro ao excluir usuário. Verifique o ID.');
      },
    });
  }
}
