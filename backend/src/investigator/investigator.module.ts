import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestigatorController } from './investigator.controller';
import { InvestigatorService } from './investigator.service';
import { Investigator } from './entities/investigator.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Investigator]),
  ],
  controllers: [InvestigatorController],
  providers: [InvestigatorService],
  exports: [InvestigatorService],
})
export class InvestigatorModule {} 