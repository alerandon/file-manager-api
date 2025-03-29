import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('auth-jwt'))
  async findAll() {
    const users = await this.usersService.findAll();
    const response = { data: users };
    return response;
  }

  @Get('current')
  @UseGuards(AuthGuard('auth-jwt'))
  currentUser(@Req() req) {
    const reqUser = req.user as User;
    const response = { data: reqUser };
    return response;
  }

  @Get('email/:email')
  @UseGuards(AuthGuard('auth-jwt'))
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }
}
