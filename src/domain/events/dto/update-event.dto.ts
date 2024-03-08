import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDateDto } from './update-event-date.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  dates?: UpdateEventDateDto[];
}
