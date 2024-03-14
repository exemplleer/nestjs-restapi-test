import { ApiProperty } from '@nestjs/swagger';

export class CreateVenueDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly country: string;

  @ApiProperty({ required: false })
  readonly state?: string;

  @ApiProperty()
  readonly city: string;

  @ApiProperty({ example: 'Europe/Moscow' })
  readonly timezone: string;

  @ApiProperty({ required: false })
  readonly zipCode?: string;

  @ApiProperty({ required: false })
  readonly address?: string;
}
