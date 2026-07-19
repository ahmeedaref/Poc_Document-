import { IsNumber, IsString } from 'class-validator';

export class createInvestmentDto {
  @IsString()
  investorId!: string;

  @IsString()
  companyName!: string;

  @IsNumber()
  investmentAmount!: number;
}
