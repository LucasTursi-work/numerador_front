import { PerfilUsuario, StatusUsuario } from '../../../../shared/enums';

export interface CreateUsuarioRequestDTO {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  perfil: PerfilUsuario;
  status?: StatusUsuario; // Opcional
  codigoValidador?: string;
}
