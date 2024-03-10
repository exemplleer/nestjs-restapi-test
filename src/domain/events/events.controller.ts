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
  HttpCode,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: 'Create new event' })
  @ApiResponse({ status: 201, description: 'Event created' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Example: message: ["name must be a string"]',
  })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  create(@Body() createEventDto: CreateEventDto, @UploadedFile() thumbnail) {
    return this.eventsService.create(createEventDto, thumbnail);
  }

  @ApiOperation({
    summary: 'Get all events',
    description: 'Return empty array if the query string is invalid',
  })
  @ApiResponse({ description: 'Return all events', status: 200 })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'filter={"id": [1, 2]}',
    example: ' filter={"status": "APPROVED"}',
  })
  @ApiQuery({ name: 'sort', required: false, example: 'sort=["id", "DESC"]' })
  @ApiQuery({ name: 'range', required: false, example: 'range=[0, 9]' })
  @Get()
  getMany(
    @Query('sort') sort: string,
    @Query('range') range: string,
    @Query('filter') filter: string,
  ) {
    return this.eventsService.getList(sort, range, filter);
  }

  @ApiOperation({ summary: 'Get one event' })
  @ApiResponse({ description: 'Return one event', status: 200 })
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.eventsService.getOne(+id);
  }

  @ApiOperation({ summary: 'Update event' })
  @ApiResponse({ description: 'Event updated', status: 200 })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Example: message: ["name must be a string"]',
  })
  @ApiConsumes('multipart/form-data')
  @Put(':id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFile() thumbnail,
  ) {
    return this.eventsService.update(+id, updateEventDto, thumbnail);
  }

  @ApiOperation({ summary: 'Delete event' })
  @ApiResponse({ description: 'Event deleted', status: 204 })
  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.eventsService.delete(+id);
  }
}
