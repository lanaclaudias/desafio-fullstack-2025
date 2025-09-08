import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Store } from '../stores/store.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  @Column({ type: 'varchar', nullable: true })
  version?: string | null;

  @Column('int')
  year: number;

  @Column('int', { nullable: true })
  mileage?: number | null;

  @Column('decimal', { nullable: true, precision: 12, scale: 2 })
  price?: number | null;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'text', nullable: true })
  images?: string | null; // JSON array of image URLs/base64

  @Column({ type: 'varchar', nullable: true })
  color?: string | null;

  @ManyToOne(() => Store, (store) => store.cars)
  store: Store;
}
