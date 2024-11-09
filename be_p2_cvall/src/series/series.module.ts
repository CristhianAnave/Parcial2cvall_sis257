import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { Serie } from './entities/serie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Serie])],
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule {}
