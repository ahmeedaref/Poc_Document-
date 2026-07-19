import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard, RolesGuard, Roles } from '@org/auth';
import { CurrentUser } from '@org/auth';

import { InvestmentService } from './investment.service';
import { createInvestmentDto } from './Dto/create.investment';
import { CompleteTaskDto } from './Dto/complete-task.dto';
import { UserSyncGuard } from '../users/user-sync.guard';

@UseGuards(JwtAuthGuard, RolesGuard, UserSyncGuard)
@Controller('investments')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @Post()
  create(@Body() dto: createInvestmentDto, @CurrentUser() user: any) {
    console.log('CURRENT USER:', user);
    return this.investmentService.createInvestment(dto, user);
  }

  @Get()
  @Roles('APPROVER')
  findAll() {
    return this.investmentService.findAll();
  }

  @Post('tasks/:taskId/complete')
  @Roles('APPROVER')
  completeTask(@Param('taskId') taskId: string, @Body() dto: CompleteTaskDto) {
    return this.investmentService.completeTask(taskId, dto);
  }
}
