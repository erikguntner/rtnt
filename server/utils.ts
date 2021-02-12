import { NextApiResponse } from 'next';
import { serialize, CookieSerializeOptions } from 'cookie';
interface Options {
  expires?: Date;
  maxAge?: number;
}
/**
To delete a cookie.
value=deleted
path=/
expires is set to time in the past

res.setHeader(
  "Set-Cookie",
  "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
);
*/


export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions
) => {
  res.setHeader('Set-Cookie', serialize(name, String(value), options))
}