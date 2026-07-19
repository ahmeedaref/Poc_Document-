import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FlowableService } from './flowable.service';
import { FlowableController } from './flowable.controller';
@Module({
  imports: [HttpModule],
  controllers: [FlowableController],
  providers: [FlowableService],
  exports: [FlowableService],
})
export class FlowableModule {}
