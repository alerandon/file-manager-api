import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, ResetPasswordDto, ChangePasswordDto } from './auth.dto';
import { User } from '../users/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Req() req) {
    const reqUser = req.user as User;
    const loginResponse = this.authService.login(reqUser);
    const response = { data: loginResponse };
    return response;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const reqUser = req.user as User;
    const loginResponse = await this.authService.validateGoogleLogin(reqUser);
    const response = { data: loginResponse };
    return response;
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto.email);
  }

  @Post('change-password')
  @UseGuards(AuthGuard('reset-jwt'))
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const reqUser = req.user as User;
    return this.authService.changePassword(changePasswordDto, reqUser);
  }
}
