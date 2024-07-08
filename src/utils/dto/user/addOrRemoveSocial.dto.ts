import { ApiProperty } from '@nestjs/swagger';

export class AddOrRemoveSocialMediaDto {
  @ApiProperty({ type: String })
  link: string;
  @ApiProperty({ type: String })
  name: string;
  @ApiProperty({ type: String })
  icon: string;
}
