import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsBoolean, IsString, MaxLength } from 'class-validator';
import { CreateTodoDto } from './create-todo.dto';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
