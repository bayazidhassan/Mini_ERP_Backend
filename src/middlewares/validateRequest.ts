import { ZodType } from 'zod';
import catchAsync from '../utils/catchAsync';

const validateRequest = (schema: ZodType) => {
  return catchAsync(async (req, res, next) => {
    await schema.parseAsync(req.body);

    next();
  });
};

export default validateRequest;
