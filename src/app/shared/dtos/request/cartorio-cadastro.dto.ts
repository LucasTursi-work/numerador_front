import { PerfilUsuario, StatusUsuario } from '../../enums/user-enums';

export interface CartorioCadastroDto {
  nome: string; // O nome é obrigatório
  usuarioCriadorId: number; // ID do usuário logado
  cartorioAtivo?: boolean; // Opcional, o backend deve definir se é obrigatório ou não
}
