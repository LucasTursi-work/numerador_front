import { PerfilUsuario, StatusUsuario } from '../../enums/user-enums';

export interface UsuarioResponseDTO {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  status: StatusUsuario;
  dataCadastro: string; // Ou Date se converter
  dataLogin?: string;
}
