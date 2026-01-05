import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'maintenance' })
export class Maintenance {

  @Prop({ type: String })
  _id: string;

  @Prop()
  serviceId: string;

  @Prop()
  titulo: string;

  @Prop()
  descripcion: string;

  @Prop()
  estado: string;

  @Prop()
  cadena: string;

  @Prop()
  restaurante: string;

  @Prop()
  fechaInicio: string;

  @Prop()
  fechaFin: string;

  @Prop()
  fechaCreacion: string;
}

export const MaintenanceSchema = SchemaFactory.createForClass(Maintenance);
