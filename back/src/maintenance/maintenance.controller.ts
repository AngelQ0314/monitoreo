import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly service: MaintenanceService) {}

@Get()
findAll(@Query() query: any) {
  return this.service.findWithFilters(query);
}


  @Get('service/:serviceId')
  findByService(@Param('serviceId') serviceId: string) {
    return this.service.findByService(serviceId);
  }

  @Post()
  create(@Body() dto: CreateMaintenanceDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMaintenanceDto,
  ) {
    return this.service.update(id, dto);
  }
}
