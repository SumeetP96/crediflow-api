import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { City } from './entities/city.entity';
import { Country } from './entities/country.entity';
import { State } from './entities/state.entity';

@Injectable()
export class WorldService {
  constructor(
    @InjectModel(Country)
    private countryModel: typeof Country,
    @InjectModel(State)
    private stateModel: typeof State,
    @InjectModel(City)
    private cityModel: typeof City,
  ) {}
  async findAllCountries(): Promise<Country[]> {
    return await this.countryModel.findAll();
  }

  async findAllCountryOptions(): Promise<Country[]> {
    return await this.countryModel.findAll({
      attributes: ['id', 'name', 'emoji'],
      order: [['name', 'ASC']],
    });
  }

  async findCountryById(id: number): Promise<Country> {
    return await this.countryModel.findByPk(id);
  }

  async findAllStates(): Promise<State[]> {
    return await this.stateModel.findAll();
  }

  async findAllStateOptions(): Promise<State[]> {
    return await this.stateModel.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });
  }

  async findStateById(id: number): Promise<State> {
    return await this.stateModel.findByPk(id, {
      include: [{ model: Country }],
    });
  }

  async findAllCities(): Promise<City[]> {
    return await this.cityModel.findAll();
  }

  async findAllCityOptions(): Promise<City[]> {
    return await this.cityModel.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });
  }

  async findCityById(id: number): Promise<City> {
    return await this.cityModel.findByPk(id, {
      include: [Country, State],
    });
  }
}
