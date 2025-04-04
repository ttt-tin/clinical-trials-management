import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber, IsArray, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PortfolioCategory } from '../entities/portfolio.entity';

export class CreatePortfolioDto {
  @ApiProperty({
    description: 'The title of the portfolio',
    example: 'Clinical Trial XYZ',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the portfolio',
    example: 'A study of...',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The category of the portfolio',
    enum: PortfolioCategory,
    example: PortfolioCategory.PHASE_1,
  })
  @IsEnum(PortfolioCategory)
  category: PortfolioCategory;

  @ApiProperty({
    description: 'Whether the portfolio is active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'The progress of the portfolio (0-100)',
    example: 50,
    minimum: 0,
    maximum: 100,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress?: number;

  @ApiProperty({
    description: 'Tags associated with the portfolio',
    example: ['oncology', 'phase-1'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[];
} 