import { ApiProperty } from '@nestjs/swagger';
import { IsRFC3339 } from 'class-validator';

export class CreateEventDateDto {
  @ApiProperty({
    description: 'String date in RFC3339 format',
    example: '2024-03-07T23:00:00+03:00',
  })
  @IsRFC3339()
  readonly startDate: string;

  @ApiProperty({
    description: 'String date in RFC3339 format',
    example: '2024-03-07T23:00:00+03:00',
  })
  @IsRFC3339()
  readonly endDate: string;
}
