import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  create(@Body() createEventDto: CreateEventDto, @UploadedFile() thumbnail) {
    return this.eventsService.create(createEventDto, thumbnail);
  }

  @Get()
  getMany(
    @Query('sort') sort: string,
    @Query('range') range: string,
    @Query('filter') filter: string,
  ) {
    return this.eventsService.getList(sort, range, filter);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.eventsService.getOne(+id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFile() thumbnail,
  ) {
    return this.eventsService.update(+id, updateEventDto, thumbnail);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.eventsService.delete(+id);
  }
}
