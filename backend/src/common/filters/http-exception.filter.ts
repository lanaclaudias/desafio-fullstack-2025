/* eslint-disable @typescript-eslint/no-explicit-any */
// ...existing code...
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Ocorreu um erro interno';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      // res pode ser string | { message: ... } | array
      if (typeof res === 'string') message = res;
      else if (Array.isArray((res as any).message)) message = (res as any).message;
      else if ((res as any).message) message = (res as any).message;
      else message = (exception as any).message ?? message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
    });
  }
}
// ...existing code...