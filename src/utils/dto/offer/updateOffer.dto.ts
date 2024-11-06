import { PartialType } from "@nestjs/swagger";
import { CreateOfferDto } from "./createOffer.dto";

export class UpdateOfferDto extends PartialType(CreateOfferDto) {}