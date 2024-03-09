import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EventStatus } from '../types/event.types';
import { CreateEventDateDto } from './create-event-date.dto';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateEventDateDto)
  readonly dates: CreateEventDateDto[];

  @IsInt()
  readonly venueId: number;

  @IsEnum(EventStatus)
  readonly status?: EventStatus;
}
