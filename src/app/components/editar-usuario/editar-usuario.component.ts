import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../modules/user/services/user.service';
import { CreateUsuarioRequestDTO } from '../../shared/dtos/request/create-user.dto';
import { PerfilUsuario } from '../../shared/enums/user-enums';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-criar-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.scss',
})
export class CriarUsuarioComponent {
  // Lista de perfis para o <select>
  perfis = Object.values(PerfilUsuario);
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  // Formulário reativo com validações
ngOnInit(): void {
    // Inicialização segura após o construtor
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      perfil: [PerfilUsuario.USUARIO, Validators.required],
      codigoValidador: [''],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      // Converte o FormGroup para o DTO
      const dto: CreateUsuarioRequestDTO = this.form.value as CreateUsuarioRequestDTO;

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
