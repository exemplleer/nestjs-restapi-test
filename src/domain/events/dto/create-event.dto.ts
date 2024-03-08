import { EventStatus } from '../types/event.types';
import { CreateEventDateDto } from './create-event-date.dto';

export class CreateEventDto {
  readonly name: string;
  readonly description?: string;
  readonly thumbnail?: string;
  readonly dates: CreateEventDateDto[];
  readonly venueId: number;
  readonly status?: EventStatus;
}
