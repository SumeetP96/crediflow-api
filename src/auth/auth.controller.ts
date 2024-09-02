import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/validation-pipes/zod-validation.pipe';
import { UserTransformService } from 'src/users/services/user-transform.service';
import { UsersService } from 'src/users/services/users.service';
import { Public } from './decorators/public.decorator';
import { RequestWithDbUser, RequestWithJwtParsedUser } from './dto/request-dto';
import { signInSchema } from './dto/signin-dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './services/auth.service';

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
