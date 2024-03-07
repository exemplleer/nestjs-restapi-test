import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity';
import { EventDate } from './entities/event-date.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventDate])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
