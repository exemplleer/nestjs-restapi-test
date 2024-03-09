import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDateDto } from './update-event-date.dto';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateEventDateDto)
  dates?: UpdateEventDateDto[];
}
