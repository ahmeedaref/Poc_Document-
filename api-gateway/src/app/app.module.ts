import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from '@org/config';
import { DatabaseModule } from '@org/database';
import { UsersModule } from './users/users.module';
import { FlowableModule } from './flowable/flowable.module';
import { InvestmentModule } from './investment/investment.module';
import { AuthModule } from '@org/auth';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    UsersModule,
    FlowableModule,
    InvestmentModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
