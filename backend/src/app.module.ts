import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { PortfolioModule } from './portfolio/portfolio.module';
import { InvestigatorModule } from './investigator/investigator.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    PortfolioModule,
    InvestigatorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
