import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dtos/create-portfolio.dto';
import { UpdatePortfolioDto } from './dtos/update-portfolio.dto';
import { Portfolio, PortfolioCategory } from './entities/portfolio.entity';

@ApiTags('portfolios')
@Controller('portfolios')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new portfolio' })
  @ApiResponse({
    status: 201,
    description: 'The portfolio has been successfully created.',
    type: Portfolio,
  })
  @ApiResponse({
    status: 409,
    description: 'Portfolio with this title already exists.',
  })
  async create(@Body() createPortfolioDto: CreatePortfolioDto): Promise<Portfolio> {
    return this.portfolioService.create(createPortfolioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all portfolios' })
  @ApiResponse({
    status: 200,
    description: 'List of all portfolios.',
    type: [Portfolio],
  })
  async findAll(): Promise<Portfolio[]> {
    return this.portfolioService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a portfolio by id' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the portfolio',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The found portfolio.',
    type: Portfolio,
  })
  @ApiResponse({
    status: 404,
    description: 'Portfolio not found.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Portfolio> {
    return this.portfolioService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a portfolio' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the portfolio to update',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The portfolio has been successfully updated.',
    type: Portfolio,
  })
  @ApiResponse({
    status: 404,
    description: 'Portfolio not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Portfolio with this title already exists.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
  ): Promise<Portfolio> {
    return this.portfolioService.update(id, updatePortfolioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a portfolio' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the portfolio to delete',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The portfolio has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Portfolio not found.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.portfolioService.remove(id);
  }

  // Additional endpoints for helper methods
  @Get('filter/active')
  @ApiOperation({ summary: 'Get all active portfolios' })
  @ApiResponse({
    status: 200,
    description: 'List of active portfolios.',
    type: [Portfolio],
  })
  async findActive(): Promise<Portfolio[]> {
    return this.portfolioService.findActive();
  }

  @Get('filter/category/:category')
  @ApiOperation({ summary: 'Get portfolios by category' })
  @ApiParam({
    name: 'category',
    description: 'The category to filter by',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of portfolios in the specified category.',
    type: [Portfolio],
  })
  async findByCategory(@Param('category') category: PortfolioCategory): Promise<Portfolio[]> {
    return this.portfolioService.findByCategory(category);
  }
} 