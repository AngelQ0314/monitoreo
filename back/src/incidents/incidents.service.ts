import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IncidentEntity } from './schemas/incident.schema';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentStatusDto } from './dto/update-incident-status.dto';
import { AddIncidentUpdateDto } from './dto/add-incident-update.dto';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectModel(IncidentEntity.name)
    private readonly incidentModel: Model<IncidentEntity>,
  ) {}

  async create(dto: CreateIncidentDto) {
    return this.incidentModel.create({
      ...dto,
      actualizaciones: [],
      fechaResolucion: null,
    });
  }

  async updateStatus(id: string, dto: UpdateIncidentStatusDto) {
    const incident = await this.incidentModel.findById(id);
    if (!incident) throw new NotFoundException('Incidente no encontrado');

    incident.estado = dto.estado;

    if (dto.estado === 'Resuelto') {
      incident.fechaResolucion =
        dto.fechaResolucion ?? new Date().toISOString();
    }

    return incident.save();
  }

  async addUpdate(id: string, dto: AddIncidentUpdateDto) {
    const incident = await this.incidentModel.findById(id);
    if (!incident) throw new NotFoundException('Incidente no encontrado');

    incident.actualizaciones.push(dto);
    return incident.save();
  }

  async findAll(filters: any) {
    const query: any = {};

    if (filters.serviceId) {
      query.serviceId = filters.serviceId;
    }

    if (filters.estado) {
      query.estado = filters.estado;
    }

    if (filters.severidad) {
      query.severidad = filters.severidad;
    }

    if (filters.cadena) {
      query.cadena = filters.cadena;
    }

    if (filters.restaurante) {
      query.restaurante = filters.restaurante;
    }

    return this.incidentModel
      .find(query)
      .sort({ fechaInicio: -1 })
      .exec();
  }

  async findByService(serviceId: string) {
    return this.incidentModel
      .find({ serviceId })
      .sort({ fechaInicio: -1 })
      .exec();
  }
}
