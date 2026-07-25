import { IsNumber, IsString } from 'class-validator';

export class createInvestmentDto {
  @IsString()
  companyName!: string;

  @IsNumber()
  investmentAmount!: number;

  @IsString()
  nationalId!: string;

  @IsString()
  companyId!: string;
}
