import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogsModule } from './logs/logs.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ApplicationsModule } from './application/application.module';
import { RegleAppModule } from './regle-alerte/regle-app.module';
import { RegleModule } from './regle/regle.module';
import { AlerteModule } from './alerte/alerte.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the config module available globally
    }),
    LogsModule,
    UsersModule,
    AuthModule,
    MailModule,
    ApplicationsModule,
    RegleAppModule,
    RegleModule,
    AlerteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 