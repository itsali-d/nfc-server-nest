import { PartialType } from '@nestjs/mapped-types';
import { SignUpUserDto } from './signUpUser.dto';

export class UpdateUserDto extends PartialType(SignUpUserDto) {}
