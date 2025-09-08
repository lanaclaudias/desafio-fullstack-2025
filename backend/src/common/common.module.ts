import { Module } from '@nestjs/common';
import { ValidationPipe } from './pipes/validation.pipe';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
  providers: [ValidationPipe, HttpExceptionFilter],
  exports: [ValidationPipe, HttpExceptionFilter],
})
export class CommonModule {}
