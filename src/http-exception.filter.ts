import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    let errorMessage = 'Internal server error';

    const responseObj = exception.getResponse();
    if (typeof responseObj === 'string') {
      errorMessage = responseObj;
    } else if (
      typeof responseObj === 'object' &&
      responseObj.hasOwnProperty('message')
    ) {
      errorMessage = responseObj['message'];
    }

    response.status(status).json({
      message: errorMessage,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
