import { Injectable } from '@nestjs/common';
import * as bcryptHelpers from './helpers/bcrypt.helper';
import * as cookieHelpers from './helpers/cookie.helper';
import * as responseBuilderHelpers from './helpers/response-builder.helper';

@Injectable()
export class UtilsProvider {
  bcrypt = bcryptHelpers;
  responseBuilder = responseBuilderHelpers;
  cookies = cookieHelpers;
}
