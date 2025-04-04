import { IsString, IsEmail, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InvestigatorRole } from '../entities/investigator.entity';

export class CreateInvestigatorDto {
  @ApiProperty({
    description: 'The first name of the investigator',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the investigator',
    example: 'Smith',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The email address of the investigator',
    example: 'john.smith@hospital.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'The phone number of the investigator',
    example: '+1-555-555-5555',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'The role of the investigator',
    example: 'Oncologist',
  })
  @IsEnum(InvestigatorRole)
  @IsOptional()
  role?: InvestigatorRole;

  @ApiProperty({
    description: 'Whether the investigator is active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'The specialization of the investigator',
    example: 'Oncology',
  })
  @IsString()
  @IsOptional()
  specialization?: string;

  @ApiProperty({
    description: 'The institution of the investigator',
    example: 'Hospital',
  })
  @IsString()
  @IsOptional()
  institution?: string;
} 