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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
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
  SendOtpForgetPasswordDto,
  VerifyOtpForgetPasswordDto,
  GoogleSignInDto,
} from 'src/utils';

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
  @Post('google-signin')
  async googleSignIn(@Body() signUpGoogleDto: GoogleSignInDto) {
    return this.userService.googleSignIn(signUpGoogleDto);
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
  async sendOTP(@Req() req: any) {
    return this.userService.sendOtp(req.user.email);
  }
  @Post('send-otp-forget-password')
  async sendOtpForgetPassword(@Body() body: SendOtpForgetPasswordDto) {
    return this.userService.sendOtpForgetPassword(body.email);
  }
  @Post('verify-otp')
  @ApiBearerAuth()
  @UseGuards(DynamicAuthGuard(['user']))
  async verifyOTP(@Req() req: any, @Body() body: VerifyOtpDto) {
    return this.userService.verifyOtp(req.user.email, body);
  }
  @Post('verify-otp-forget-password')
  async verifyOTPForgetPassword(@Body() body: VerifyOtpForgetPasswordDto) {
    return this.userService.verifyOtpForgetPassword(body);
  }

  @ApiBearerAuth()
  @Get('/all')
  @UseGuards(DynamicAuthGuard(['jwt', 'user']))
  async getAllUsers() {
    const response = await this.userService.getUsers();
    return response;
  }
  @Get('search-user')
  @ApiBearerAuth()
  @ApiQuery({ name: 'type', required: false, allowEmptyValue: true })
  @ApiQuery({ name: 'category', required: false, allowEmptyValue: true })
  @ApiQuery({ name: 'rating', required: false, allowEmptyValue: true })
  @ApiQuery({ name: 'city', required: false, allowEmptyValue: true })
  @ApiQuery({ name: 'search', required: false, allowEmptyValue: true })
  // @UseGuards(DynamicAuthGuard(['user']))
  async searchUser(
    @Query('search') search: string,
    @Query('type') _type: string,
    @Query('category') category: string,
    @Query('rating') rating: number,
    @Query('city') city: string,
  ) {
    console.log(search, _type, category, rating, city);
    const response = await this.userService.getFilterUsers({
      _type,
      category,
      rating: rating ? rating : 1,
      city,
      search,
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
  @Patch('forget-password')
  async forgetPassword(@Body() body: ForgetPasswordDto) {
    const response = await this.userService.forgetPassword(body);
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
  @Post('add-review')
  @UseGuards(DynamicAuthGuard(['user']))
  async addReview(@Body() body: AddReviewDto) {
    const response = await this.userService.createReview(body);
    return response;
  }

  // delete
  @ApiBearerAuth()
  @Post('delete-account')
  @UseGuards(DynamicAuthGuard(['user']))
  async deleteAccunt(@Query('id') id: string) {
    const response = await this.userService.deleteAccunt(id);
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
  // @UseGuards(DynamicAuthGuard(['jwt', 'user']))
  async findOne(@Param('id') id: string) {
    const response = await this.userService.findOne(id);
    return response;
  }
}
