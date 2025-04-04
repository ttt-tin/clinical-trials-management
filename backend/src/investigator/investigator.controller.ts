import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { InvestigatorService } from './investigator.service';
import { CreateInvestigatorDto } from './dtos/create-investigator.dto';
import { Investigator } from './entities/investigator.entity';

@ApiTags('investigators')
@Controller()
export class InvestigatorController {
  constructor(private readonly investigatorService: InvestigatorService) {}

  @Get('portfolios/:id/investigators')
  @ApiOperation({ summary: 'Get all investigators for a specific portfolio' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the portfolio',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of investigators for the specified portfolio.',
    type: [Investigator],
  })
  @ApiResponse({
    status: 404,
    description: 'No investigators found for the specified portfolio.',
  })
  async findByPortfolioId(@Param('id', ParseIntPipe) portfolioId: number): Promise<Investigator[]> {
    return this.investigatorService.findByPortfolioId(portfolioId);
  }

  @Post('investigators')
  @ApiOperation({ summary: 'Create a new investigator' })
  @ApiResponse({
    status: 201,
    description: 'The investigator has been successfully created.',
    type: Investigator,
  })
  @ApiResponse({
    status: 409,
    description: 'Investigator with this email already exists.',
  })
  async create(@Body() createInvestigatorDto: CreateInvestigatorDto): Promise<Investigator> {
    return this.investigatorService.create(createInvestigatorDto);
  }

  @Get('investigators')
  @ApiOperation({ summary: 'Get all investigators' })
  @ApiResponse({
    status: 200,
    description: 'List of all investigators.',
    type: [Investigator],
  })
  async findAll(): Promise<Investigator[]> {
    return this.investigatorService.findAll();
  }

  @Get('investigators/:id')
  @ApiOperation({ summary: 'Get an investigator by id' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the investigator',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The found investigator.',
    type: Investigator,
  })
  @ApiResponse({
    status: 404,
    description: 'Investigator not found.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Investigator> {
    return this.investigatorService.findOne(id);
  }

  @Put('investigators/:id')
  @ApiOperation({ summary: 'Update an investigator' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the investigator to update',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The investigator has been successfully updated.',
    type: Investigator,
  })
  @ApiResponse({
    status: 404,
    description: 'Investigator not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Investigator with this email already exists.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateInvestigatorDto>,
  ): Promise<Investigator> {
    return this.investigatorService.update(id, updateData);
  }

  @Delete('investigators/:id')
  @ApiOperation({ summary: 'Delete an investigator' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the investigator to delete',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The investigator has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Investigator not found.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.investigatorService.remove(id);
  }
} 