import { IsEnum, IsOptional } from 'class-validator';

export class CompleteTaskDto {
  @IsOptional()
  @IsEnum(['APPROVED', 'REJECTED'])
  approvalStatus?: 'APPROVED' | 'REJECTED';
}
