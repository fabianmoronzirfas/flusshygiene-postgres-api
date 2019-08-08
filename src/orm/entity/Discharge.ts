import { Column, Entity, ManyToOne } from 'typeorm';
import { Bathingspot } from './Bathingspot';
import { Measurement } from './Measurement';

@Entity()
export class Discharge extends Measurement {
  @Column({ nullable: true })
  public comment!: string;

  @ManyToOne((_type) => Bathingspot, (bathingspot) => bathingspot.discharges, {
    cascade: true,
  })
  public bathingspot!: Bathingspot;
}
