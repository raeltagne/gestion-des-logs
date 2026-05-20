import { Module } from '@nestjs/common';
import { RegleAppService } from './regle-app.service';
import { RegleAppController } from './regle-app.controller';
import { RegleService } from 'src/regle/regle.service';
import { ApplicationsService } from 'src/application/application.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
      ElasticsearchModule.register({
        node: 'http://localhost:9200',
      }),
    ],
  providers: [RegleAppService,RegleService,ApplicationsService],
  controllers: [RegleAppController]
})
export class RegleAppModule {}
