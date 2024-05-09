import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class EventDate {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'String date in RFC3339 format',
    example: '2024-02-29T12:00:00+03:00',
  })
  @Column({ type: 'timestamp with time zone' })
  startDate: string;

  @ApiProperty({
    description: 'String date in RFC3339 format',
    example: '2024-03-07T23:00:00+03:00',
  })
  @Column({ type: 'timestamp with time zone' })
  endDate: string;

  @ManyToOne(() => Event, (event) => event.dates)
  event: Event;
}
