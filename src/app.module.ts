import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import database from './config/database';
import { S3Module } from './modules/s3/s3.module';
import { ImagesModule } from './modules/images/image.module';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/file.module';
import { UsersModule } from './modules/users/user.module';

@Module({
  imports: [
    // Modules
    AuthModule,
    FilesModule,
    UsersModule,
    S3Module,
    ImagesModule,

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
})
export class AppModule {}
