import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { Maintenance } from './schemas/maintenance.schema';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectModel(Maintenance.name)
    private maintenanceModel: Model<Maintenance>,
  ) {}

async findWithFilters(query: any) {
  const filters: any = {};

  if (query.serviceId) {
    filters.serviceId = query.serviceId;
  }

  if (query.estado) {
    filters.estado = query.estado;
  }

  if (query.cadena) {
    filters.cadena = query.cadena;
  }

  if (query.restaurante) {
    filters.restaurante = query.restaurante;
  }

  return this.maintenanceModel.find(filters).exec();
}


  async findByService(serviceId: string) {
    return this.maintenanceModel.find({ serviceId }).exec();
  }

  async create(dto: CreateMaintenanceDto) {
    return this.maintenanceModel.create({
      ...dto,
      fechaCreacion: new Date().toISOString(),
    });
  }

  async update(id: string, dto: UpdateMaintenanceDto) {
    const updated = await this.maintenanceModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Mantenimiento no encontrado');
    }

    return updated;
  }
}
