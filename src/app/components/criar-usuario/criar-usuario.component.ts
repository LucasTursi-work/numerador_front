import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { UsuarioService } from '../../modules/user/services/user.service';
import { CreateUsuarioRequestDTO } from '../../shared/dtos/request/create-user.dto';
import { PerfilUsuario } from '../../shared/enums/user-enums';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-criar-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // 👈 ReactiveFormsModule aqui
  templateUrl: './criar-usuario.component.html',
  styleUrl: './criar-usuario.component.scss',
})
export class CriarUsuarioComponent {
  perfis = Object.values(PerfilUsuario);
  form: FormGroup;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) {
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
      const dto: CreateUsuarioRequestDTO = this.form.value;
      this.usuarioService.criarUsuario(dto).subscribe({
        next: (res) => alert('Usuário criado!'),
        error: (err) => console.error('Erro:', err),
      });
    }
  }
}
