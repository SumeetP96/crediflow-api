import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/validation-pipes/zod-validation.pipe';
import { UserTransformService } from 'src/users/user-transform.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { signInSchema } from './dto/login-dto';
import { RequestWithDbUser, RequestWithJwtParsedUser } from './dto/request-dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly userTransformService: UserTransformService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @UsePipes(new ZodValidationPipe({ body: signInSchema }))
  signIn(@Request() req: RequestWithDbUser) {
    return this.authService.signIn(req.user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: RequestWithJwtParsedUser) {
    return this.userTransformService.transform(
      await this.userService.findById(req.user.id),
    );
  }
}
