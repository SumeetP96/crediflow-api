import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Country } from 'src/world/entities/country.entity';
import { State } from 'src/world/entities/state.entity';

@Table({
  tableName: 'cities',
  timestamps: false,
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
