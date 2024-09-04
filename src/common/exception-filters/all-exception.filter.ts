import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody: Record<string, unknown> = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: this.getResponseMessage(exception),
    };

    // Zod Error
    if (exception.response?.issues) {
      responseBody.issues = exception.response.issues;
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  private getResponseMessage(exception: any): string {
    if (exception.name.includes('Sequelize')) {
      const errors = exception?.errors?.length
        ? exception.errors.map((error: any) => error.message).join(', ')
        : exception.message;
      return `Sequelize Error: ${errors}`;
    }

    return (
      exception.message || 'An error occurred while processing your request.'
    );
  }
}
