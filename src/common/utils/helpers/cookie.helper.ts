import { CookieOptions } from 'express';
import ms, { StringValue } from 'ms';
import { dayjs } from './date.helper';

export const getOptions = (
  expiry: string | number,
  options?: CookieOptions,
): CookieOptions => {
  const expiryInMs =
    typeof expiry === 'string' ? ms(expiry as StringValue) : expiry;

  const expires = dayjs().add(expiryInMs, 'milliseconds').toDate();

  return {
    expires,
    httpOnly: true,
    ...(options || {}),
  };
};
