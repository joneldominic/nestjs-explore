import { IsString, IsOptional, MaxLength, IsBoolean } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isArchive?: boolean;
}
