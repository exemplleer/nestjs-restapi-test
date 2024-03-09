import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from 'src/domain/events/entities/event.entity';

@Entity()
export class Venue {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  country: string;

  @ApiProperty()
  @Column()
  state: string;

  @ApiProperty()
  @Column()
  city: string;

  @ApiProperty({ example: 'Europe/Moscow' })
  @Column()
  timezone: string;

  @ApiProperty()
  @Column({ nullable: true })
  zipCode: string;

  @ApiProperty()
  @Column({ nullable: true })
  address: string;

  @ApiProperty({ type: () => Event })
  @OneToMany(() => Event, (event) => event.venue, { cascade: true })
  events: Event[];
}
