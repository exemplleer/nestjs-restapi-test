import { IsInt, IsOptional } from 'class-validator';
import { CreateEventDateDto } from './create-event-date.dto';

export class UpdateEventDateDto extends CreateEventDateDto {
  @IsInt()
  @IsOptional()
  readonly id?: number;
}
