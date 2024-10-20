import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { City } from 'src/world/entities/city.entity';
import { State } from 'src/world/entities/state.entity';

@Table({
  tableName: 'countries',
  timestamps: false,
})
export class Country extends Model {
  @Column
  name: string;

  @Column
  iso3: string;

  @Column
  iso2: string;

  @Column
  numericCode: string;

  @Column
  phoneCode: string;

  @Column
  currency: string;

  @Column
  currencyName: string;

  @Column
  emoji: string;

  @Column
  emojiUnicode: string;

  // Relations

  @HasMany(() => State)
  states: State[];

  @HasMany(() => City)
  cities: City[];
}
