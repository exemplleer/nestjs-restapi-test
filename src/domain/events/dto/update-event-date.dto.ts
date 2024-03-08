import { CreateEventDateDto } from './create-event-date.dto';

export class UpdateEventDateDto extends CreateEventDateDto {
  readonly id?: number;
}
