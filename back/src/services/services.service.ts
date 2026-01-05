 import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceEntity } from './schemas/service.schema';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(ServiceEntity.name)
    private readonly serviceModel: Model<ServiceEntity>,
  ) {}

  async getUniqueEstados() {
    return this.serviceModel.distinct('estado');
  }

  async getUniqueCadenas() {
    return this.serviceModel.distinct('clasificacion.cadena');
  }

  async getUniqueRestaurantes() {
    return this.serviceModel.distinct('clasificacion.restaurante');
  }

  async findAll(filters: any) {
    const query: any = {};

    if (filters.id) {
      query._id = filters.id;
    }

    if (filters.estado) {
      query.estado = filters.estado;
    }

    if (filters.tipo) {
      query.tipo = filters.tipo;
    }

    if (filters.ambiente) {
      query.ambiente = filters.ambiente;
    }

    if (filters.activo !== undefined) {
      query.activo = filters.activo === 'true';
    }

    if (filters.cadena) {
      query['clasificacion.cadena'] = filters.cadena;
    }

    if (filters.restaurante) {
      query['clasificacion.restaurante'] = filters.restaurante;
    }

if (filters.desde || filters.hasta) {
  const campoFecha =
    filters.campoFecha === 'fechaCreacion'
      ? 'fechaCreacion'
      : 'fechaActualizacion';

  query[campoFecha] = {};

  if (filters.desde) {
    query[campoFecha].$gte = `${filters.desde}T00:00:00Z`;
  }

  if (filters.hasta) {
    query[campoFecha].$lte = `${filters.hasta}T23:59:59Z`;
  }
}


    console.log('Query construida:', JSON.stringify(query, null, 2));

    const results = await this.serviceModel
      .find(query)
      .sort({ fechaActualizacion: -1 })
      .exec();

    console.log(`Resultados encontrados: ${results.length}`);

    return results;
  }

  async resumen() {
    const pipeline = [
      { $match: { activo: true } },
      {
        $group: {
          _id: '$estado',
          total: { $sum: 1 },
        },
      },
    ];

    const result = await this.serviceModel.aggregate(pipeline);

    const resumen = {
      operando: 0,
      impactado: 0,
      degradado: 0,
      interrumpido: 0,
    };

    result.forEach((item) => {
      switch (item._id) {
        case 'Operando normalmente':
          resumen.operando = item.total;
          break;
        case 'Impactado':
          resumen.impactado = item.total;
          break;
        case 'Degradado':
          resumen.degradado = item.total;
          break;
        case 'Interrumpido':
          resumen.interrumpido = item.total;
          break;
      }
    });

    return resumen;
  }

  async create(dto: any) {
    return this.serviceModel.create({
      ...dto,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    });
  }
}