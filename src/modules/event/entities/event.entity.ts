import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { EventDate } from './event-date.entity';
import { EventStatus } from '../event.types';
import { Venue } from 'src/modules/venue/entities/venue.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Event {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Thumbnail filename',
    example: '775affbe-03ab-4245-9186-3c9c869e7976.jpeg',
  })
  @Column({ nullable: true })
  thumbnail: string;

  @ApiProperty({
    example: [
      { startDate: '2019-10-12T10:20:50Z', endDate: '2024-03-09T21:00:00Z' },
    ],
  })
  @OneToMany(() => EventDate, (eventDate) => eventDate.event, {
    cascade: true,
    eager: true,
  })
  dates: EventDate[];

  @ApiProperty({ type: () => Venue })
  @ManyToOne(() => Venue, (venue) => venue.events, { eager: true })
  venue: Venue;

  @ApiProperty({ type: EventStatus })
  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.UNAPPROVED })
  status: EventStatus;
}
