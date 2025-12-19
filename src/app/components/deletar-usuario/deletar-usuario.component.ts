import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from '../../modules/user/services/user.service';
import { UsuarioResponseDTO } from '../../shared/dtos/response/usuario-response.dto';

@Component({
  selector: 'app-excluir-usuario',
  standalone: true,
  imports: [],
  template: `
    <div>
      <h2>Excluir Usuário</h2>
      <label for="id">ID do usuário:</label>
      <input id="id" type="number" [(ngModel)]="id" />
      <button (click)="excluir()">Excluir</button>
    </div>
  `,
})
export class DeletarUsuarioComponent {
  @Input() usuario!: UsuarioResponseDTO;

  constructor(
    public activeModal: NgbActiveModal,
    private usuarioService: UsuarioService
  ) {}

  confirmarExclusao() {
    this.usuarioService.deleteUsuario(this.usuario.id).subscribe({
      next: () => {
        // Fechamos passando 'deletado' para o componente pai saber que deu certo
        this.activeModal.close('deletado');
      },
      error: (err) => {
        console.error('Erro ao deletar usuário', err);
        // Aqui você poderia adicionar um alerta de erro para o usuário
      },
    });
  }
}
