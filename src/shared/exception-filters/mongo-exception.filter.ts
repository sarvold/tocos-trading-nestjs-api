import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongoose/node_modules/mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const timestamp = new Date().toISOString();
    const path = ctx.getRequest<Request>().url;
    if (exception.code === 11000) {
      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: path.includes('users') ? 'User already exists.' : 'Item already exists, duplicate error.',
        timestamp,
        path,
      });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'MongoDB Error!!: ' + exception.message,
        timestamp,
        path,
      });
    }
  }
}