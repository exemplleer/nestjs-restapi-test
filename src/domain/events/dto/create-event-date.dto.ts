import { IsRFC3339 } from 'class-validator';

export class CreateEventDateDto {
  @IsRFC3339()
  readonly startDate: Date;

  @IsRFC3339()
  readonly endDate: Date;
}
