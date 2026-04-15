import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from '../tasks/task.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    /* 1. config module 설정 : .env 파일 로드 */
    ConfigModule.forRoot({
      isGlobal: true /* 전역으로 ConfigService 사용 */,
      envFilePath: `.env/${process.env.NODE_ENV || 'development'}.env`,
    }),

    /* TypeORMModule 비동기 설정 : ConfigService의 환경 변수 주입 */
    TypeOrmModule.forRootAsync({
      inject: [ConfigService] /* ConfigService 인스턴스를 주입 */,

      /* 실제 데이터베이스와 연결을 하기 위해 설정을 수행하는 펙토리 함수 */
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DB_TYPE') as 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),

        /* 엔티티 로드 설정 */
        autoLoadEntities: true,

        /* 데이터베이스 스키마 동기화 (개발 시 편리, **운영 시 절대 금지**) */
        synchronize:
          configService.get('NODE_ENV') ===
          'development' /* 운영 시 절대 금지 (true로 설정하고 개발 단계에서 mock 데이터를 넣으면 실제 데이터베이스에 영향을 줌) */,
      }),
    }),

    TaskModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
