import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HealthCheckEntity } from './schemas/health-check.schema';
import { HttpService } from '@nestjs/axios';
import { ServicesService } from '../services/services.service';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HealthChecksService {
  private readonly logger = new Logger(HealthChecksService.name);

  constructor(
    @InjectModel(HealthCheckEntity.name)
    private readonly model: Model<HealthCheckEntity>,
    private readonly httpService: HttpService,
    private readonly servicesService: ServicesService,
  ) {}

  async findAll(query: any) {
    const filter: any = {};

    if (query.serviceId) filter.serviceId = query.serviceId;
    if (query.estado) filter.estado = query.estado;
    if (query.cadena) filter.cadena = query.cadena;
    if (query.restaurante) filter.restaurante = query.restaurante;

    if (query.desde && query.hasta) {
      filter.fechaRevision = {
        $gte: query.desde,
        $lte: query.hasta,
      };
    }

    return this.model
      .find(filter)
      .sort({ fechaRevision: -1 })
      .limit(Number(query.limit) || 50);
  }

  async findByService(serviceId: string) {
    return this.model
      .find({ serviceId })
      .sort({ fechaRevision: -1 });
  }

  @Cron('0 */5 * * * *') 
  async performHealthChecks() {
    this.logger.log('Iniciando health checks automáticos');

    try {
      const services = await this.servicesService.findAll({ activo: 'true' });

      for (const service of services) {
        await this.checkServiceHealth(service);
      }

      this.logger.log('Health checks completados');
    } catch (error) {
      this.logger.error('Error en health checks automáticos', error);
    }
  }

  private async checkServiceHealth(service: any) {
    if (!service.endpoint || !service.endpoint.url) {
      this.logger.warn(`Servicio ${service._id} no tiene endpoint.url configurado`);
      return;
    }

    const url = service.endpoint.url;
    const method = service.endpoint.metodo || service.endpoint.method || 'GET';
    const expectedCode = service.endpoint.codigoEsperado || 200;
    const timeout = service.endpoint.timeoutMs || service.endpoint.timeout || 10000;
    const startTime = Date.now();

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url,
          timeout,
          // Ignorar errores de certificado SSL para URLs simuladas
          httpsAgent: new (require('https').Agent)({
            rejectUnauthorized: false,
          }),
        })
      );

      const responseTime = Date.now() - startTime;
      const status = this.determineStatus(response.status, responseTime, expectedCode);

      await this.model.create({
        _id: `${service._id}_${Date.now()}`,
        serviceId: service._id,
        estado: status,
        tiempoRespuestaMs: responseTime,
        codigoRespuesta: response.status,
        mensaje: response.status === expectedCode ? 'OK' : `Código ${response.status} (esperado ${expectedCode})`,
        fechaRevision: new Date().toISOString(),
        cadena: service.clasificacion?.cadena,
        restaurante: service.clasificacion?.restaurante,
      });

      this.logger.log(`Health check para ${service.nombre}: ${status}`);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const status = 'Interrumpido';

      await this.model.create({
        _id: `${service._id}_${Date.now()}`,
        serviceId: service._id,
        estado: status,
        tiempoRespuestaMs: responseTime,
        codigoRespuesta: error.response?.status || 0,
        mensaje: error.message || 'Error de conexión',
        fechaRevision: new Date().toISOString(),
        cadena: service.clasificacion?.cadena,
        restaurante: service.clasificacion?.restaurante,
      });

      this.logger.warn(`Health check fallido para ${service.nombre}: ${error.message}`);
    }
  }

  private determineStatus(statusCode: number, responseTime: number, expectedCode: number = 200): string {
    if (statusCode === expectedCode) {
      if (responseTime < 1000) return 'Operando normalmente';
      if (responseTime < 5000) return 'Degradado';
      return 'Impactado';
    }
    if (statusCode >= 400 && statusCode < 500) return 'Impactado';
    return 'Interrumpido';
  }
}
