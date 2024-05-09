import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EventDate } from '../entities/event-date.entity';
import { UpdateEventDateDto } from './update-event-date.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @ApiProperty({ type: [UpdateEventDateDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateEventDateDto)
  dates?: EventDate[];
}
