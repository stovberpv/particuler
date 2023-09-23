import type { ClassTransformOptions } from 'class-transformer';

export const transformationConfig: ClassTransformOptions = {
  exposeDefaultValues: true,
  enableCircularCheck: true,
};
