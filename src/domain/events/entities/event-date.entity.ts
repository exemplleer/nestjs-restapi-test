import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class EventDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp with time zone' })
  startDate: string;

  @Column({ type: 'timestamp with time zone' })
  endDate: string;

  @ManyToOne(() => Event, (event) => event.dates)
  event: Event;
}
