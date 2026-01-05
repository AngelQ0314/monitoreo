export class CreateMaintenanceDto {
  _id: string;
  serviceId: string;
  titulo: string;
  descripcion: string;
  estado: 'Programado' | 'En progreso' | 'Finalizado';
  cadena: string;
  restaurante: string;
  fechaInicio: string;
  fechaFin: string;
}

