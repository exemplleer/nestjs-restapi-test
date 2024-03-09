import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class EventDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp with time zone' })
  startDate: Date;

  @Column({ type: 'timestamp with time zone' })
  endDate: Date;

  @ManyToOne(() => Event, (event) => event.dates)
  event: Event;
}
