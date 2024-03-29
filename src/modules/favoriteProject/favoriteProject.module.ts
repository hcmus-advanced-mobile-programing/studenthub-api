import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteProjectController } from 'src/modules/favoriteProject/favoriteProject.controller';
import { FavoriteProject } from 'src/modules/favoriteProject/favoriteProject.entity';
import { FavoriteProjectService } from 'src/modules/favoriteProject/favoriteProject.service';;

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteProject]), ConfigModule],
  controllers: [FavoriteProjectController],
  providers: [FavoriteProjectService],
  exports: [FavoriteProjectService],
})
export class FavoriteProjectModule {}
