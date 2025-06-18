export interface AtualizarSenhaParams {
  novaSenha: string;
}

export interface ListarUsuariosParams {
  pagina: number;
  limite: number;
  ordenacao?: OrdenacaoUsuario; // Reusa enum local
  filtro?: string;
}

export interface ResetarSenhaParams {
  token: string;
  senhaTemporaria: string;
}
