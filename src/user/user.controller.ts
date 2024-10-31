import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AddOrRemoveContactDto,
  AddOrRemoveSocialMediaDto,
  DynamicAuthGuard,
  LoginUserDto,
  SignUpUserDto,
  UpdateUserDto,
  ForgetPasswordDto,
  VerifyOtpDto,
  AddReviewDto,
} from 'src/utils';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('signup')
  @ApiOperation({
    summary: 'Register new User for mobile application',
    description:
      'register new User with role of User using email ,name and password',
  })
  async signup(@Body() signUpUserDto: SignUpUserDto) {
    return this.userService.signup(signUpUserDto);
  }
  @Post('login')
  @ApiOperation({
    summary: 'Login User for mobile application',
    description: 'login User using email and password',
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }
  @Get('send-otp')
  @ApiBearerAuth()
  @UseGuards(DynamicAuthGuard(['user']))
  async sendOTP(
    @Req() req: any,
    @Query('isVerification') isVerification: boolean,
  ) {
    return this.userService.sendOtp(req.user.email, isVerification);
  }
  @Post('verify-otp')
  @ApiBearerAuth()
  @UseGuards(DynamicAuthGuard(['user']))
  async verifyOTP(@Req() req: any, @Body() body: VerifyOtpDto) {
    return this.userService.verifyOtp(req.user.email, body);
  }

  @ApiBearerAuth()
  @Get('/all')
  @UseGuards(DynamicAuthGuard(['jwt', 'user']))
  async getAllUsers() {
    let response = await this.userService.getUsers();
    return response;
  }
  @Get('search-user')
  @ApiBearerAuth()
  // @UseGuards(DynamicAuthGuard(['user']))
  async searchUser(
    @Query('type') _type: string,
    @Query('category') category: string,
    @Query('rating') rating: number,
    @Query('city') city: string,
  ) {
    const response = await this.userService.getFilterUsers({
      _type,
      category,
      rating,
      city,
    });
    return response;
  }

  @ApiBearerAuth()
  @Patch('add-contact')
  @UseGuards(DynamicAuthGuard(['user']))
  async addContact(@Body() body: AddOrRemoveContactDto, @Req() req: any) {
    const response = await this.userService.addContact(req.user._id, body._id);
    return response;
  }
  @ApiBearerAuth()
  @Patch('remove-contact')
  @UseGuards(DynamicAuthGuard(['user']))
  async removeContact(@Body() body: AddOrRemoveContactDto, @Req() req: any) {
    const response = await this.userService.removeContact(
      req.user._id,
      body._id,
    );
    return response;
  }
  @ApiBearerAuth()
  @Patch('add-social')
  @UseGuards(DynamicAuthGuard(['user']))
  async addSocial(@Body() body: AddOrRemoveSocialMediaDto, @Req() req: any) {
    const response = await this.userService.addSocialMedia(req.user._id, body);
    return response;
  }
  @ApiBearerAuth()
  @Patch('remove-social')
  @UseGuards(DynamicAuthGuard(['user']))
  async removeSocial(@Query('socialId') socialId: string, @Req() req: any) {
    const response = await this.userService.removeSocialMedia(
      req.user._id,
      socialId,
    );
    return response;
  }
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(DynamicAuthGuard(['jwt', 'user']))
  async update(@Param('id') id: string, @Body() updatedUser: UpdateUserDto) {
    const response = await this.userService.update(id, updatedUser);
    return response;
  }
  @ApiBearerAuth()
  @Patch('forget-password')
  @UseGuards(DynamicAuthGuard(['user']))
  async forgetPassword(@Body() body: ForgetPasswordDto, @Req() req: any) {
    const response = await this.userService.forgetPassword(
      req.user.email,
      body,
    );
    return response;
  }
  @ApiBearerAuth()
  @Post('add-review')
  @UseGuards(DynamicAuthGuard(['user']))
  async addReview(@Body() body: AddReviewDto) {
    const response = await this.userService.createReview(body);
    return response;
  }
  @ApiBearerAuth()
  @Get('reviews')
  @UseGuards(DynamicAuthGuard(['user']))
  async getReviews(@Query('id') id: string) {
    const response = await this.userService.getReviews(id);
    return response;
  }
  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(DynamicAuthGuard(['jwt', 'user']))
  async findOne(@Param('id') id: string) {
    const response = await this.userService.findOne(id);
    return response;
  }
}
