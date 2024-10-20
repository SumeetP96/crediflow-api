import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { City } from 'src/cities/entities/city.entity';
import { Country } from 'src/countries/entities/country.entity';

@Table({
  tableName: 'states',
  paranoid: true,
})
export class State extends Model {
  @AllowNull
  @ForeignKey(() => Country)
  @Column
  countryId: number;

  @Column
  name: string;

  @Column
  stateCode: string;

  // Relations

  @BelongsTo(() => Country)
  country: Country;

  @HasMany(() => City)
  cities: City[];
}
