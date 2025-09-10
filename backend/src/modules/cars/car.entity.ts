import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Store } from '../stores/store.entity';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    model: string;

  @Column()
    version: string;


  @Column()
    year: string;

  @Column({ type: 'int', nullable: true })
    mileage?: number | null;

  @Column({ type: 'float', nullable: true })
    price?: number | null;

  @Column({ type: 'text', nullable: true })
    description?: string | null;

  // pode ser JSON string ou caminho
  @Column({ type: 'text', nullable: true })
    images?: string | null;

  @Column()
    storeId: number;

  @ManyToOne(() => Store, (s) => s.cars, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'storeId' })
    store: Store;
}