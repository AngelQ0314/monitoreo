export class UpdateMaintenanceDto {
  estado?: 'Programado' | 'En progreso' | 'Finalizado';
  fechaFin?: string;
}
