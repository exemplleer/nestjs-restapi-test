import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { VenuesService } from './venues.service';

@ApiTags('venues')
@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @ApiOperation({
    summary: 'Get all venues',
    description: 'Return empty array if the query string is invalid',
  })
  @ApiResponse({ description: 'Return all events', status: 200 })
  @ApiQuery({ name: 'filter', required: false })
  @Get()
  getManyReference(@Query('filter') filter: string) {
    return this.venuesService.getManyReference(filter);
  }
}
