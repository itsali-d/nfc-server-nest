import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DynamicAuthGuard, LoginUserDto, SignUpUserDto, UpdateUserDto } from 'src/utils';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('signup')
  @ApiOperation({
    summary: 'Register new User for mobile application',
    description:
      'register new User with role of User using phone number ,name and password',
  })
  async signup(@Body() signUpUserDto: SignUpUserDto) {
    return this.userService.signup(signUpUserDto);
  }
  @Post('login')
  @ApiOperation({
    summary: 'Login User for mobile application',
    description: 'login User using phone number and password',
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @ApiBearerAuth()
  @Get('/all')
  @UseGuards(DynamicAuthGuard(['jwt', 'user']))
  async getAllUsers() {
    let response = await this.userService.getUsers();
    return response;
  }
  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(DynamicAuthGuard(['jwt', 'user']))
  async findOne(@Param('id') id: string) {
    const response = await this.userService.findOne(id);
    return response;
  }

  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(DynamicAuthGuard(['jwt', 'user']))
  async update(@Param('id') id: string, @Body() updatedUser: UpdateUserDto) {
    const response = await this.userService.update(id, updatedUser);
    return response;
  }
}
