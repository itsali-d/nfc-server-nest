import { ApiProperty } from '@nestjs/swagger';

export class AddOrRemoveContactDto {
  @ApiProperty({ type: String })
  _id: string;
}
