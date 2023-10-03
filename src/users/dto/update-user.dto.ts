import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
// import { PartialType } from '@nestjs/mapped-types';
// PartialType still requires all props
// export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserDto {

  @IsOptional()
  @IsString()
  name?: string;
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  balance?: number;

}
