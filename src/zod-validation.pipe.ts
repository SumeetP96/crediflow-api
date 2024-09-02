import {
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  Paramtype,
  PipeTransform,
} from '@nestjs/common';
import { z, ZodIssue, ZodSchema } from 'zod';

type ZodRequestSchemas = {
  [key in Paramtype]?: ZodSchema;
};

export class ZodValidationPipe implements PipeTransform {
  constructor(private schemas: ZodRequestSchemas) {
    this.schemas.param = schemas.param || z.string();
  }

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      return this.schemas[metadata.type].parse(value);
    } catch (error) {
      throw new BadRequestException({
        message: 'Zod Validation error',
        statusCode: HttpStatus.BAD_REQUEST,
        issues: this.getErrors(metadata.type, error.issues),
      });
    }
  }

  private getErrors(paramType: Paramtype, errors: ZodIssue[]): ZodIssue[] {
    if (paramType === 'param') {
      return errors.map((error) => ({
        ...error,
        path: [...(error.path || []), 'url params'],
      }));
    }
    return errors;
  }
}
