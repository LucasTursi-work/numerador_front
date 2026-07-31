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
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-criar-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './criar-usuario.component.html',
  styleUrl: './criar-usuario.component.scss',
})
export class CriarUsuarioComponent {
  perfis = Object.values(PerfilUsuario);
  form: FormGroup;
  carregando = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    public activeModal: NgbActiveModal,
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cpf: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\d{11})$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      perfil: [PerfilUsuario.USUARIO, Validators.required],
    });
  }

  formatarCpf(event: any) {
    let valor = event.target.value.replace(/\D/g, ''); // Remove tudo que não é número

    if (valor.length <= 11) {
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    // Atualiza o valor no formulário com a máscara
    this.form.get('cpf')?.setValue(valor, { emitEvent: false });
  }

  onSubmit() {
    console.log('--- STATUS DO FORMULÁRIO ---');
  console.log('Form Válido?', this.form.valid);
  console.log('Erros por campo:', {
    nome: this.form.get('nome')?.errors,
    cpf: this.form.get('cpf')?.errors,
    email: this.form.get('email')?.errors,
    senha: this.form.get('senha')?.errors,
    perfil: this.form.get('perfil')?.errors
  });
    if (this.form.valid) {
      this.carregando = true;

      // Limpa o CPF para enviar apenas números
      const dadosParaEnviar: CreateUsuarioRequestDTO = {
        ...this.form.value,
        cpf: this.form.get('cpf')?.value.replace(/\D/g, ''),
      };
      console.log('Dados enviados', this.carregando);
      console.log('Dados do formulário (form.value):', this.form.value);
      this.usuarioService.criarUsuario(dadosParaEnviar).subscribe({
        next: (response) => {
          this.carregando = false;
          console.log('Sucesso no cadastro:', response);
          this.activeModal.close('salvo');
        },
        error: (err) => {
          this.carregando = false;
          alert('Erro ao comunicar com o servidor. Verifique o console.');
          console.error(err);
        },
      });
    }
  }
}
