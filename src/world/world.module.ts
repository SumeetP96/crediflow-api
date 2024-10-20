import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { City } from './entities/city.entity';
import { Country } from './entities/country.entity';
import { State } from './entities/state.entity';
import { WorldController } from './world.controller';
import { WorldService } from './world.service';

@Module({
  imports: [SequelizeModule.forFeature([Country, State, City])],
  controllers: [WorldController],
  providers: [WorldService, UtilsProvider],
})
export class WorldModule {}
