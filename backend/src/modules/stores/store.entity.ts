import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Brand } from '../brands/brand.entity';
import { Car } from '../cars/car.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    name: string;

  @ManyToOne(() => Brand, (brand) => brand.stores)
    brand: Brand;

  @OneToMany(() => Car, (car) => car.store)
    cars: Car[];
}
