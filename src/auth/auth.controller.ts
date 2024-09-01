import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { TransformUserService } from 'src/users/transform-user.service';
import { UsersService } from 'src/users/users.service';
import { ZodValidationPipe } from 'src/zod-validation.pipe';
import { AuthService } from './auth.service';
import { signInSchema } from './dto/login-dto';
import { RequestWithDbUser, RequestWithJwtParsedUser } from './dto/request-dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly transformUserService: TransformUserService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @UsePipes(new ZodValidationPipe(signInSchema))
  signIn(@Request() req: RequestWithDbUser) {
    return this.authService.signIn(req.user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: RequestWithJwtParsedUser) {
    return this.transformUserService.transformUser(
      await this.userService.findById(req.user.id),
    );
  }
}
