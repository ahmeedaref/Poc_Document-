import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URI as string)],
  exports: [MongooseModule],
})
export class MongoDbModule {}
