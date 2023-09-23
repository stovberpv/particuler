import type { ValidatorOptions } from 'class-validator';

export const validationConfig: ValidatorOptions = {
  forbidUnknownValues: true,
  forbidNonWhitelisted: true,
  whitelist: true,
};
