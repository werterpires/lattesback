import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ErrorsServiceService } from './app/shared/shared-services/errors-service/errors-service.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ErrorsServiceService],
})
export class AppModule {}
