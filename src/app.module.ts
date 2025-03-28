import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import database from './config/database';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/file.module';
import { UsersModule } from './modules/users/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3Module } from './modules/s3/s3.module';

@Module({
  imports: [
    // Modules
    AuthModule,
    FilesModule,
    UsersModule,
    S3Module,

    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [database],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseConfig = await configService.get('database');
        return databaseConfig;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
