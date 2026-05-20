import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from 'src/users/users.module';
import { ApplicationsService } from 'src/application/application.service';
import { RegleAppService } from 'src/regle-alerte/regle-app.service';
import { AlerteService } from 'src/alerte/alerte.service';
import { RegleService } from 'src/regle/regle.service';



@Module({
  
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
    }),
    MailModule,
    UsersModule,
    
  ],
  controllers: [LogsController],
  providers: [LogsService,ApplicationsService,RegleAppService,AlerteService,RegleService]
})
export class LogsModule {}
