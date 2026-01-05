import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';
import { IncidentEntity, IncidentSchema } from './schemas/incident.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IncidentEntity.name, schema: IncidentSchema },
    ]),
  ],
  providers: [IncidentsService],
  controllers: [IncidentsController],
})
export class IncidentsModule {}
