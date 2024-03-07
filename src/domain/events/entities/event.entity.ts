import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { EventDate } from './event-date.entity';
import { EventStatus } from '../types/event.types';
import { Venue } from 'src/domain/venues/entities/venue.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  thumbnail: string;

  @OneToMany(() => EventDate, (eventDate) => eventDate.event)
  dates: EventDate[];

  @ManyToOne(() => Venue, (venue) => venue.events)
  venue: Venue;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.UNAPPROVED })
  status: EventStatus;
}
