import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { User } from './user.entity';
import { UsersService } from './user.service';
import { FindAllDocs } from './docs/find-all';
import { CurrentUserDocs } from './docs/current-user';
import { FindByEmailDocs } from './docs/find-by-email';

@Swagger.ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('auth-jwt'))
  @Swagger.ApiOperation(FindAllDocs.apiOperation)
  @Swagger.ApiResponse(FindAllDocs.apiResponseStatus200)
  @Swagger.ApiResponse(FindAllDocs.apiResponseStatus401)
  async findAll() {
    const users = await this.usersService.findAll();
    const response = { data: users };
    return response;
  }

  @Get('current')
  @UseGuards(AuthGuard('auth-jwt'))
  @Swagger.ApiOperation(CurrentUserDocs.apiOperation)
  @Swagger.ApiResponse(CurrentUserDocs.apiResponseStatus200)
  @Swagger.ApiResponse(CurrentUserDocs.apiResponseStatus401)
  currentUser(@Req() req) {
    const reqUser = req.user as User;
    const response = { data: reqUser };
    return response;
  }

  @Get('email/:email')
  @UseGuards(AuthGuard('auth-jwt'))
  @Swagger.ApiOperation(FindByEmailDocs.apiOperation)
  @Swagger.ApiParam(FindByEmailDocs.apiParam)
  @Swagger.ApiResponse(FindByEmailDocs.apiResponseStatus200)
  @Swagger.ApiResponse(FindByEmailDocs.apiResponseStatus404)
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }
}
