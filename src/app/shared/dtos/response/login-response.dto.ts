export interface LoginResponseDto {
  token: string;
  usuarioId: number;
  senhaProvisoria: boolean;
  // Se quiser, adicione campos que podem vir no futuro
  nome?: string;
  perfil?: string;
  status?: string;
}
