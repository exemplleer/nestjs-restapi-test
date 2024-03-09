import { IsRFC3339 } from 'class-validator';

export class CreateEventDateDto {
  @IsRFC3339()
  readonly startDate: string;

  @IsRFC3339()
  readonly endDate: string;
}
