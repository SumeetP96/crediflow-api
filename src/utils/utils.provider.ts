import { Injectable } from '@nestjs/common';
import * as bcryptHelpers from './helpers/bcrypt';

@Injectable()
export class UtilsProvider {
  bcrypt = bcryptHelpers;
}
