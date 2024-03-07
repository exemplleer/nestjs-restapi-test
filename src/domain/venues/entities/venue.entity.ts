import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from 'src/domain/events/entities/event.entity';

@Entity()
export class Venue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  timezone: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column({ nullable: true })
  address: string;

  @OneToMany(() => Event, (event) => event.venue, { cascade: true })
  events: Event[];
}
