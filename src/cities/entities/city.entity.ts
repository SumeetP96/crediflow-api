import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Country } from 'src/countries/entities/country.entity';
import { State } from 'src/states/entities/state.entity';

@Table({
  tableName: 'cities',
})
export class City extends Model {
  @AllowNull
  @ForeignKey(() => Country)
  @Column
  countryId: number;

  @AllowNull
  @ForeignKey(() => State)
  @Column
  stateId: number;

  @Column
  name: string;

  // Relations

  @BelongsTo(() => Country)
  country: Country;

  @BelongsTo(() => State)
  state: State;
}
