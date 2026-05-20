import { Module } from '@nestjs/common';
import { AlerteService } from './alerte.service';
import { AlerteController } from './alerte.controller';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
      ElasticsearchModule.register({
        node: 'http://localhost:9200',
      }),
    ],
  providers: [AlerteService],
  controllers: [AlerteController]
})
export class AlerteModule {}
