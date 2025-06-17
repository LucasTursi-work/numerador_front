export enum UserSearchEnum {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  senha: string;  // Observação: Em cenários reais, senhas não devem vir no DTO de resposta!
  perfil: PerfilUsuario;
  status: StatusUsuario;
  dataCadastro: string;  // Ou Date, se converter
  dataLogin?: string;    // Opcional
  codigoValidador?: string;
}

