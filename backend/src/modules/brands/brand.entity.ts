import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Store } from '../stores/store.entity';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    name: string;

  @OneToMany(() => Store, (store) => store.brand)
    stores: Store[];
}
