import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
    @ApiProperty()
    icon: string;
    @ApiProperty()
    name: string;
}