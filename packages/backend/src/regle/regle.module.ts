import { Module } from '@nestjs/common';
import { RegleService } from './regle.service';
import { RegleController } from './regle.controller';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
      ElasticsearchModule.register({
        node: 'http://localhost:9200',
      }),
    ],
  providers: [RegleService],
  controllers: [RegleController]
})
export class RegleModule {}
