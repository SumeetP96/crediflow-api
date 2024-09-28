import {
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseFilters,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AllExceptionsFilter } from 'src/common/exception-filters/all-exception.filter';
import { UtilsProvider } from 'src/common/utils/utils.provider';
import { ZodValidationPipe } from 'src/common/validation-pipes/zod-validation.pipe';
import { TConfig } from 'src/config/config.types';
import { UserTransformService } from 'src/users/services/user-transform.service';
import { UsersService } from 'src/users/services/users.service';
import { ITransformedUser } from 'src/users/user.types';
import { Public } from './decorators/public.decorator';
import { RequestWithDbUser, RequestWithJwtParsedUser } from './dto/request-dto';
import { signInSchema } from './dto/signin-dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './services/auth.service';

@UseFilters(AllExceptionsFilter)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly userTransformService: UserTransformService,
    private readonly utilsProvider: UtilsProvider,
    private readonly configService: ConfigService<TConfig>,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @UsePipes(new ZodValidationPipe({ body: signInSchema }))
  async signIn(
    @Request() req: RequestWithDbUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.signIn(req.user);

    res.cookie(
      this.configService.get('authCookie'),
      data.access_token,
      this.utilsProvider.cookies.getOptions(
        this.configService.get('authExpiry'),
      ),
    );

    const user = await this.userService.findById(req.user.id);
    const transformed = this.userTransformService.transform(user);

    return this.utilsProvider.responseBuilder.success<ITransformedUser>(
      transformed,
      'Login successful',
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: RequestWithJwtParsedUser) {
    const data = await this.userService.findById(req.user.id);
    const transformed = this.userTransformService.transform(data);

    return this.utilsProvider.responseBuilder.success<ITransformedUser>(
      transformed,
    );
  }
}
