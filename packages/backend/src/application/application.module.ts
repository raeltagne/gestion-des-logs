import { Module } from '@nestjs/common';
import { ApplicationsController } from './application.controller';
import { ApplicationsService } from './application.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';



@Module({
  
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
    }),
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService]
})
export class ApplicationsModule {}