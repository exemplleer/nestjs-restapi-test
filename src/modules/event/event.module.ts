import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event } from './entities/event.entity';
import { EventDate } from './entities/event-date.entity';
import { VenueModule } from '../venue/venue.module';
import { FileModule } from 'src/shared/services/file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventDate]),
    VenueModule,
    FileModule,
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
