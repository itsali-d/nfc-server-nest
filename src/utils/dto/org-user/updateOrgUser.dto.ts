import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOrgUserDto } from './createOrgUser.dto';

export class UpdateOrgUserDto extends PartialType(CreateOrgUserDto) {
  @ApiProperty({ example: 'user 1' })
  name?: string;
  @ApiProperty({ example: '1234567' })
  newPassword?: string;

  @ApiProperty({ example: '123456' })
  oldPassword?: string;
  
  @ApiProperty()
  isDisable?: boolean;
  @ApiProperty()
  isOnine?: boolean;
}
