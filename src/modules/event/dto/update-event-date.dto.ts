import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { CreateEventDateDto } from './create-event-date.dto';

export class UpdateEventDateDto extends PartialType(CreateEventDateDto) {
  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  readonly id?: number;
}
