import { PerfilUsuario, StatusUsuario } from '../../enums/user-enums';

export interface UpdateUsuarioRequestDTO {
  id: number;
  nome?: string; // Opcional (pode atualizar apenas alguns campos)
  cpf?: string;
  email?: string;
  senha?: string;
  perfil?: PerfilUsuario;
  status?: StatusUsuario;
  codigoValidador?: string;
  // Campos como dataCadastro/dataLogin geralmente não são atualizáveis
}

export interface UpdateUsuarioParamsDTO {
  novaSenha: string;
}
