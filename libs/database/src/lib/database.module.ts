import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from '@org/config';
import { PostgresModule } from './postgres/postgres.module';
import { MongoDbModule } from './mongodb/mongodb.module';
@Global()
@Module({
  imports: [AppConfigModule, PostgresModule, MongoDbModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
