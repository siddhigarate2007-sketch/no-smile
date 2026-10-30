import { type Request, type Response, type NextFunction } from 'express';
import { type AnyZodObject, ZodError } from 'zod';
import { BadRequestError } from '../utils/errors.js';

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((e) => ({
          field: e.path.join('.').replace(/^body\./, ''),
          message: e.message,
        }));
        next(
          new BadRequestError(
            `Validation error: ${errorMessages.map((m) => m.message).join(', ')}`,
            'VALIDATION_ERROR'
          )
        );
      } else {
        next(error);
      }
    }
  };
