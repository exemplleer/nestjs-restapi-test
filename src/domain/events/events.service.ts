import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { VenuesService } from './../venues/venues.service';
import { FilesService } from 'src/files/files.service';
import { Event } from './entities/event.entity';
import { EventDate } from './entities/event-date.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UpdateEventDateDto } from './dto/update-event-date.dto';
import * as moment from 'moment-timezone';

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

      const filterProps = Object.keys(parsedFilter).reduce((acc, prop) => {
        acc[prop] = Array.isArray(parsedFilter[prop])
          ? In(parsedFilter[prop])
          : parsedFilter[prop];
        return acc;
      }, {});

      const events = await this.eventRepository.find({
        where: filterProps,
        order: { [sortField]: sortOrder },
        skip: rangeStart,
        take: rangeEnd - rangeStart + 1,
      });
      const eventsWithSyncTz = events.map((event) =>
        this.synchronizeTimezone(event),
      );
      return eventsWithSyncTz;
    } catch (error) {
      return [];
    }
  }

  async getMany(filter: string) {
    if (!filter) return this.eventRepository.find();
    try {
      const parsedIds = JSON.parse(filter).id;
      if (!Array.isArray(parsedIds)) return [];
      const ids: number[] = parsedIds.map(Number).filter((i) => i);
      const events = await this.eventRepository.find({
        where: { id: In(ids) },
      });
      const eventsWithSyncTz = events.map((event) =>
        this.synchronizeTimezone(event),
      );
      return eventsWithSyncTz;
    } catch (e) {
      return [];
    }
  }

  async getOne(id: number) {
    if (isNaN(id)) return new BadRequestException('Invalid query parameters');
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException(`Event with id '${id}' not found`);
    const eventWithSyncTz = this.synchronizeTimezone(event);
    return eventWithSyncTz;
  }

  async update(id: number, updateEventDto: UpdateEventDto, thumbnail) {
    const { dates, venueId, ...eventData } = updateEventDto;
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException(`Event with id '${id}' not found`);
    const newEvent = this.eventRepository.merge(event, eventData);

    newEvent.thumbnail = thumbnail
      ? await this.filesService.updateFile(newEvent.thumbnail, thumbnail)
      : event.thumbnail;

    if (dates) this.createOrUpdateEventDates(dates, event);

    if (venueId) {
      const newVenue = await this.venuesService.getOne(venueId);
      newEvent.venue = newVenue;
    }

    return await this.eventRepository.save(newEvent);
  }

  async delete(id: number) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException(`Event with id '${id}' not found`);

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

  private synchronizeTimezone(event: Event): Event {
    const newEvent = event;
    const timezone = newEvent?.venue?.timezone || null;
    newEvent?.dates.forEach((date) => {
      date.startDate = moment.tz(date.startDate, timezone).format();
      date.endDate = moment.tz(date.endDate, timezone).format();
    });
    return newEvent;
  }

  private async createOrUpdateEventDates(
    dates: UpdateEventDateDto[],
    event: Event,
  ): Promise<void> {
    await Promise.all(
      dates.map(async (date) => {
        const { id: dateId, ...dateData } = date;
        const dateWithEvent = { ...dateData, event };
        if (dateId) {
          await this.eventDateRepository.update(dateId, dateWithEvent);
        } else {
          const newDate = this.eventDateRepository.create(dateWithEvent);
          await this.eventDateRepository.save(newDate);
        }
      }),
    );
  }
}
