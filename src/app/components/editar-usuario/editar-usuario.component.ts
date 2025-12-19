import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsuarioService } from '../../modules/user/services/user.service';
import { CreateUsuarioRequestDTO } from '../../shared/dtos/request/create-user.dto';
import { UsuarioResponseDTO } from '../../shared/dtos/response/usuario-response.dto';
import { PerfilUsuario, StatusUsuario } from '../../shared/enums/user-enums';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.scss',
})
export class EditarUsuarioComponent implements OnInit {
  @Input() usuario!: UsuarioResponseDTO; // Recebe os dados da tabela

  form!: FormGroup;
  // Expondo os Enums para o HTML
  perfis = Object.values(PerfilUsuario);
  statusOpcoes = Object.values(StatusUsuario);

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    // Inicializa o formulário com os valores que vieram do DTO
    this.form = this.fb.group({
      nome: [this.usuario.nome, [Validators.required]],
      email: [this.usuario.email, [Validators.required, Validators.email]],
      perfil: [this.usuario.perfil, [Validators.required]],
      status: [this.usuario.status, [Validators.required]],
    });
  }

  salvar(): void {
    if (this.form.valid) {
      // Mesclamos o ID original com os novos valores do formulário
      const dadosParaAtualizar = {
        ...this.form.value,
        id: this.usuario.id,
      };

      this.usuarioService
        .patchUsuario(this.usuario.id, dadosParaAtualizar)
        .subscribe({
          next: () => this.activeModal.close('salvo'),
          error: (err) => console.error('Erro ao atualizar:', err),
        });
    }
  }
}
