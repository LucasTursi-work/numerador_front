import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { CreateUsuarioRequestDTO } from 'src/app/shared/models/dtos/request/create-user.dto.ts';
import { PerfilUsuario } from 'src/app/shared/enums/perfil-usuario.ts';

@Component({
  selector: 'app-criar-usuario',
  standalone: true,
  imports: [],
  templateUrl: './criar-usuario.component.html',
  styleUrl: './criar-usuario.component.scss',
})
export class CriarUsuarioComponent {
  // Lista de perfis para o <select>
  perfis = Object.values(PerfilUsuario);

  // Formulário reativo com validações
  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    perfil: [PerfilUsuario.USUARIO, Validators.required],
    codigoValidador: [''],
  });

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  onSubmit() {
    if (this.form.valid) {
      // Converte o FormGroup para o DTO
      const dto: CreateUsuarioRequestDTO = this.form
        .value as CreateUsuarioRequestDTO;

      this.usuarioService.criarUsuario(dto).subscribe({
        next: (res) => {
          console.log('Usuário criado:', res);
          alert('Usuário cadastrado com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao criar usuário:', err);
          alert('Erro no cadastro. Verifique os dados.');
        },
      });
    }
  }
}
