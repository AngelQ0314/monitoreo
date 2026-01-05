import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() dto: any) {
    return this.servicesService.create(dto);
  }
  
  @Get('resumen')
  getResumen() {
    return this.servicesService.resumen();
  }

  @Get('filtrar-fecha')
  async filtrarPorFecha(@Query() query: any) {
    const filters = { ...query, tipoFiltro: 'fecha' };
    return this.servicesService.findAll(filters);
  }

  @Get()
  async getServices(@Query() query: any) {
    return this.servicesService.findAll(query);
  }

  @Get('estados')
  async getEstados() {
    return this.servicesService.getUniqueEstados();
  }

  @Get('cadenas')
  async getCadenas() {
    return this.servicesService.getUniqueCadenas();
  }

  @Get('restaurantes')
  async getRestaurantes() {
    return this.servicesService.getUniqueRestaurantes();
  }

  
}