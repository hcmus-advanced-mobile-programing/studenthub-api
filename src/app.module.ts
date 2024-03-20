import * as dotenv from 'dotenv';
dotenv.config();
import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import configuration from 'src/config/configuration';
import loggerConfig from 'src/logger/config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { HttRequestContextMiddleware } from 'src/shared/http-request-context/http-request-context.middleware';
import { HttRequestContextModule } from 'src/shared/http-request-context/http-request-context.module';
import { RequestIdHeaderMiddleware } from 'src/shared/middlewares/request-id-header.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from 'src/database/mongoose.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
      },
    }),
    HttRequestContextModule,
    LoggerModule.forRootAsync(loggerConfig),
    AuthModule,
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdHeaderMiddleware, HttRequestContextMiddleware).forRoutes('*');
  }
}
