import { PerfilUsuario } from '../enums/user-enums';
import { StatusUsuario } from '../enums/user-enums';

export interface Usuario {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  perfil: PerfilUsuario;
  status: StatusUsuario;
  dataCadastro: string;
  dataLogin?: string;
  codigoValidador: string;
}
