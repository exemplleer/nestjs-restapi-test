import { VenuesService } from './../venues/venues.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { EventDate } from './entities/event-date.entity';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventDate)
    private readonly eventDateRepository: Repository<EventDate>,
    private venuesService: VenuesService,
    private filesService: FilesService,
  ) {}

  async create(createEventDto: CreateEventDto, thumbnail: any) {
    const { dates, venueId, ...eventData } = createEventDto;

    const thumbnailFilename = thumbnail
      ? await this.filesService.createFile(thumbnail)
      : null;

    const event = this.eventRepository.create({
      ...eventData,
      thumbnail: thumbnailFilename,
    });

    const venue = await this.venuesService.getOne(venueId);
    const createdDates = this.eventDateRepository.create(dates);
    event.venue = venue;
    event.dates = createdDates;
    await this.eventDateRepository.save(createdDates);
    return await this.eventRepository.save(event);
  }

  async getList(sort: string, range: string, filter: string) {
    try {
      const parsedSort = sort ? JSON.parse(sort) : ['id', 'ASC'];
      const parsedRange = range ? JSON.parse(range) : [0, 9];
      const parsedFilter = filter ? JSON.parse(filter) : {};
      const [sortField, sortOrder] = parsedSort;
      const [rangeStart, rangeEnd] = parsedRange;
      const filterProps = parsedFilter;

      const events = await this.eventRepository.find({
        where: {
          ...filterProps,
        },
        order: {
          [sortField]: sortOrder,
        },
        skip: rangeStart,
        take: rangeEnd - rangeStart + 1,
        relations: { dates: true, venue: true },
      });

      return events;
    } catch (error) {
      return [];
    }
  }

  async getMany(filter: string) {
    if (!filter) {
      return this.eventRepository.find({
        relations: { dates: true, venue: true },
      });
    }

    try {
      const parsedIds = JSON.parse(filter).id;

      if (!Array.isArray(parsedIds)) {
        return [];
      }

      const ids: number[] = parsedIds.map(Number).filter((i) => i);

      return this.eventRepository.find({
        where: {
          id: In(ids),
        },
        relations: { dates: true, venue: true },
      });
    } catch (e) {
      return [];
    }
  }

  async getOne(id: number) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: { dates: true, venue: true },
    });

    if (!event) {
      throw new NotFoundException(`Event with id '${id}' not found`);
    }

    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto, thumbnail) {
    const { dates, venueId, ...eventData } = updateEventDto;
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: { dates: true, venue: true },
    });

    if (!event) {
      throw new NotFoundException(`Event with id '${id}' not found`);
    }

    event.thumbnail = thumbnail
      ? await this.filesService.updateFile(event.thumbnail, thumbnail)
      : event.thumbnail;

    dates?.forEach(async (date) => {
      const { id: dateId, ...dateData } = date;
      const dateWithEvent = { ...dateData, event };
      if (dateId) {
        await this.eventDateRepository.update(dateId, dateWithEvent);
      }
      const newDate = this.eventDateRepository.create(dateWithEvent);
      await this.eventDateRepository.save(newDate);
    });

    const newEvent = this.eventRepository.merge(event, eventData);
    const newVenue = await this.venuesService.getOne(venueId);
    newEvent.venue = newVenue;
    await this.eventRepository.save(newEvent);

    return { success: true };
  }

  async delete(id: number) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: { dates: true },
    });

    if (!event) {
      throw new NotFoundException(`Event with id '${id}' not found`);
    }

    try {
      const thumbnailFilename = event.thumbnail;
      await this.eventDateRepository.remove(event.dates);
      await this.eventRepository.remove(event);
      await this.filesService.deleteFile(thumbnailFilename);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
}
