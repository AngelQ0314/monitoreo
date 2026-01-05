import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HealthCheckEntity,
  HealthCheckSchema,
} from './schemas/health-check.schema';
import { HealthChecksService } from './health-checks.service';
import { HealthChecksController } from './health-checks.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ServicesModule } from '../services/services.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HealthCheckEntity.name, schema: HealthCheckSchema },
    ]),
    ScheduleModule.forRoot(),
    ServicesModule,
    HttpModule,
  ],
  controllers: [HealthChecksController],
  providers: [HealthChecksService],
})
export class HealthChecksModule {}
