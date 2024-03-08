import { Event } from '../entities/event.entity';

export class CreateEventDateDto {
  readonly startDate: Date;
  readonly endDate: Date;
  readonly event: Event;
}
