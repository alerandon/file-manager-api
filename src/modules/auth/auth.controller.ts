import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { LoginDocs } from './docs/login';
import { RegisterDocs } from './docs/register';
import { GoogleDocs, GoogleRedirectDocs } from './docs/google';
import { AuthService } from './auth.service';
import { RegisterDto, ResetPasswordDto, ChangePasswordDto } from './auth.dto';
import { User } from '../users/user.entity';
import { ResetPasswordDocs } from './docs/reset-password';
import { ChangePasswordDocs } from './docs/change-password';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ApiOperation(LoginDocs.apiOperation)
  @ApiResponse(LoginDocs.apiResponseStatus200)
  @ApiResponse(LoginDocs.apiResponseStatus401)
  @ApiBody(LoginDocs.apiBody)
  login(@Req() req) {
    const reqUser = req.user as User;
    const loginResponse = this.authService.login(reqUser);
    const response = { data: loginResponse };
    return response;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation(GoogleDocs.apiOperation)
  @ApiResponse(GoogleDocs.apiResponseStatus200)
  googleAuth() {
    /** Redirects to Google */
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @ApiOperation(GoogleRedirectDocs.apiOperation)
  @ApiResponse(GoogleRedirectDocs.apiResponseStatus200)
  @ApiResponse(GoogleRedirectDocs.apiResponseStatus401)
  async googleAuthRedirect(@Req() req) {
    const reqUser = req.user as User;
    const loginResponse = await this.authService.validateGoogleLogin(reqUser);
    const response = { data: loginResponse };
    return response;
  }

  @Post('register')
  @ApiOperation(RegisterDocs.apiOperation)
  @ApiResponse(RegisterDocs.apiResponseStatus200)
  @ApiResponse(RegisterDocs.apiResponseStatus409)
  async register(@Body() registerDto: RegisterDto) {
    const registerResponse = await this.authService.register(registerDto);
    const response = { data: registerResponse };
    return response;
  }

  @Post('reset-password')
  @ApiOperation(ResetPasswordDocs.apiOperation)
  @ApiResponse(ResetPasswordDocs.apiResponseStatus200)
  @ApiResponse(ResetPasswordDocs.apiResponseStatus404)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const resetPasswordResponse = await this.authService.resetPassword(
      resetPasswordDto.email,
    );
    const response = { data: resetPasswordResponse };
    return response;
  }

  @Post('change-password')
  @UseGuards(AuthGuard('reset-jwt'))
  @ApiOperation(ChangePasswordDocs.apiOperation)
  @ApiBody(ChangePasswordDocs.apiBody)
  @ApiResponse(ChangePasswordDocs.apiResponseStatus200)
  @ApiResponse(ChangePasswordDocs.apiResponseStatus401)
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const reqUser = req.user as User;
    const changePasswordResponse = await this.authService.changePassword(
      changePasswordDto,
      reqUser,
    );
    const response = { data: changePasswordResponse };
    return response;
  }
}
