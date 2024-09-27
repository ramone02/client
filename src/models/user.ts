export interface UserProps {
  id: string;
  estado: Estado;
  sector: number;
  usuario: string;
}

export interface UserError {
  id?: string;
  usuario?: string;
  estado?: string;
  sector?: string;
}

export enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}