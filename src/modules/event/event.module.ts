import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EventGateway } from 'src/modules/event/event.gateway';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { PublicStrategy } from 'src/modules/auth/strategies/public.strategy';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.secret'),
        signOptions: {
          expiresIn: configService.get('auth.expires'),
        },
      }),
    }),
  ],
  providers: [JwtStrategy, PublicStrategy, EventGateway],
  exports: [EventGateway],
})
export class EventModule {}
