import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsNotEmpty()
  @IsNumber({
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @Min(0)
  balance: number;

}
