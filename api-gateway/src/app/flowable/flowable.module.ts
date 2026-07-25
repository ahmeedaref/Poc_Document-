import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FlowableService } from './flowable.service';
import { FlowableController } from './flowable.controller';
import { AuthModule } from '@org/auth';
@Module({
  imports: [HttpModule, AuthModule],
  controllers: [FlowableController],
  providers: [FlowableService],
  exports: [FlowableService],
})
export class FlowableModule {}
