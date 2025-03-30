import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { User } from './user.entity';
import { UsersService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('auth-jwt'))
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  async findAll() {
    const users = await this.usersService.findAll();
    const response = { data: users };
    return response;
  }

  @Get('current')
  @UseGuards(AuthGuard('auth-jwt'))
  @ApiOperation({ summary: 'Get the current authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Current user retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  currentUser(@Req() req) {
    const reqUser = req.user as User;
    const response = { data: reqUser };
    return response;
  }

  @Get('email/:email')
  @UseGuards(AuthGuard('auth-jwt'))
  @ApiOperation({ summary: 'Find a user by email' })
  @ApiParam({ name: 'email', description: 'Email of the user to retrieve' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }
}
