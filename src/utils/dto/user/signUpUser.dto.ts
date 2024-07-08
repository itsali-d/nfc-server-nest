import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";

export class SignUpUserDto {
    @ApiProperty({ type: String, required: true })
    name: string;

    @ApiProperty({ type: String })
    image: string;

    @ApiProperty({ type: String })
    phoneNumber: string;

    @ApiProperty({ type: String })
    countryCode: string;
    @ApiProperty({ type: String, required: true })
    password: string;

    @ApiProperty({ type: String, required: true })
    nationality: string;
    @ApiHideProperty()
    userId: string;

}