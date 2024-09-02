import { Injectable } from '@nestjs/common';
import * as bcryptHelpers from './helpers/bcrypt';
import * as responseBuilderHelpers from './helpers/response-builder';

@Injectable()
export class UtilsProvider {
  bcrypt = bcryptHelpers;
  responseBuilder = responseBuilderHelpers;
}
