import { Controller, Get, Query } from '@nestjs/common';
import { VenuesService } from './venues.service';

@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Get()
  getManyReference(@Query('filter') filter: string) {
    return this.venuesService.getManyReference(filter);
  }
}
