import { Controller, Post, Get, Param } from '@nestjs/common';
import { FlowableService } from './flowable.service';

@Controller('flowable')
export class FlowableController {
  constructor(private readonly flowableService: FlowableService) {}

  @Get('tasks')
  getTasks() {
    return this.flowableService.getTasks();
  }
  @Post('tasks/:id/claim')
  claimTask(@Param('id') id: string) {
    return this.flowableService.claimTask(id, 'ahmed');
  }
  @Post('tasks/:id/complete')
  completeTask(@Param('id') id: string) {
    return this.flowableService.completeTask(id);
  }
}
