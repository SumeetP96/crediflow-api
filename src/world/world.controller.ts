import { Controller, Get, Param } from '@nestjs/common';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { WorldService } from './world.service';

@Controller('world')
export class WorldController {
  constructor(
    private readonly worldService: WorldService,
    private readonly utilsProvider: UtilsProvider,
  ) {}

  @Get('countries')
  async findAllCountries() {
    return this.utilsProvider.responseBuilder.success(
      await this.worldService.findAllCountries(),
    );
  }

  @Get('countries/options')
  async findAllCountryOptions() {
    return this.utilsProvider.responseBuilder.success(
      await this.worldService.findAllCountryOptions(),
    );
  }

  @Get('countries/:id')
  async findCountryById(@Param('id') id: string) {
    return this.utilsProvider.responseBuilder.success(
      await this.worldService.findCountryById(+id),
    );
  }

  @Get('states')
  async findAllStates() {
    return this.utilsProvider.responseBuilder.success(
      await this.worldService.findAllStates(),
    );
  }

  @Get('states/options')
  async findAllStateOptions() {
    return this.utilsProvider.responseBuilder.success(
      await this.worldService.findAllStateOptions(),
    );
  }

  @Get('states/:id')
  async findStateById(@Param('id') id: string) {
    return this.utilsProvider.responseBuilder.success(
      await this.worldService.findStateById(+id),
    );
  }

  @Get('cities')
  async findAllCities() {
    return this.utilsProvider.responseBuilder.success(
      await this.worldService.findAllCities(),
    );
  }

  @Get('cities/options')
  async findAllCityOptions() {
    return this.utilsProvider.responseBuilder.success(
      await this.worldService.findAllCityOptions(),
    );
  }

  @Get('cities/:id')
  async findCityById(@Param('id') id: string) {
    return this.utilsProvider.responseBuilder.success(
      await this.worldService.findCityById(+id),
    );
  }
}
