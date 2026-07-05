import { TErrorSource, TGenericErrorResponse } from './errorInterface';

export const handleMongooseDuplicateError = (
  err: any,
): TGenericErrorResponse => {
  const path = Object.keys(err.keyPattern)[0];
  const value = err.keyValue[path];

  const errorSource: TErrorSource[] = [
    {
      path: path,
      message: `${value} is already exists`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Duplicate Error',
    errorSource,
  };
};
