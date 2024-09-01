import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
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
  ) {}

  @UseGuards(LocalAuthGuard)
  @UsePipes(new ZodValidationPipe(signInSchema))
  @Post('login')
  signIn(@Request() req: RequestWithDbUser) {
    return this.authService.signIn(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithJwtParsedUser) {
    return this.userService.findById(req.user.id);
  }
}
