import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { VenueService } from './venue.service';

@ApiTags('venues')
@Controller('venues')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @ApiOperation({
    summary: 'Get all venues',
    description: 'Return empty array if the query string is invalid',
  })
  @ApiResponse({ description: 'Return all events', status: 200 })
  @ApiQuery({ name: 'filter', required: false })
  @Get()
  getManyReference(@Query('filter') filter: string) {
    return this.venueService.getManyReference(filter);
  }
}
