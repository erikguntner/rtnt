import { serialize, CookieSerializeOptions } from 'cookie'
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

// how to delete a cookie
// res.setHeader(
//   "Set-Cookie",
//   "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
// );


/**
 * This sets `cookie` on `res` object
 */
const cookie = (res: NextApiResponse, name: string, value: string, options: CookieSerializeOptions = {}): void => {
  res.setHeader('Set-Cookie', serialize(name, String(value), options))
}

/**
 * Adds `cookie` function on `res.cookie` to set cookies for response
 */
const cookies = (handler: NextApiHandler) => (req: NextApiRequest, res: NextApiResponse) => {
  res.cookie = (name, value, options) => cookie(res, name, value, options)

  return handler(req, res)
}

export default cookies