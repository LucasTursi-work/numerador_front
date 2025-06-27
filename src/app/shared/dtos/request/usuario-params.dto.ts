import { StatusUsuario, PerfilUsuario } from '../../enums/user-enums';

export interface AtualizarSenhaParams {
  novaSenha: string;
}

export interface ListarUsuariosParams {
  pagina: number;
  limite: number;
  filtro?: string;
}

export interface ResetarSenhaParams {
  token: string;
  senhaTemporaria: string;
}

export interface BuscarUsuariosParams {
  nome?: string;
  cpf?: string;
  status?: StatusUsuario;
  perfil?: PerfilUsuario;
  pagina: number;
  limite: number;
  ordenacao?: string;
}
//ordenacao?: OrdenacaoUsuario;
// Reusa enum local
