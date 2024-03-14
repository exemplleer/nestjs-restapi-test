import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Venue } from './entities/venue.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
  ) {}

  async getOne(id: number) {
    const venue = await this.venueRepository.findOneBy({ id });
    if (!venue) throw new NotFoundException(`Venue with id '${id}' not found`);
    return venue;
  }

  async getManyReference(filter?: string) {
    if (!filter) {
      return this.venueRepository.find({
        relations: { events: true },
        loadEagerRelations: false,
      });
    }

    try {
      const parsedEventId = filter ? JSON.parse(filter).event_id : null;
      const eventId: number | null = parsedEventId
        ? Number(parsedEventId)
        : null;

      if (!eventId || Array.isArray(parsedEventId)) return [];

      return this.venueRepository.find({
        relations: { events: true },
        where: { events: { id: eventId } },
        loadEagerRelations: false,
      });
    } catch (e) {
      return [];
    }
  }
}
