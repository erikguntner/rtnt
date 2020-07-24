import { serialize, CookieSerializeOptions } from 'cookie'
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';


/**
 * This sets `cookie` on `res` object
 */
const cookie = (res: NextApiResponse, name: string, value: string, options: CookieSerializeOptions = {}): void => {

  // if ('maxAge' in options) {
  //   options.expires = new Date(Date.now() + options.maxAge)
  //   options.maxAge /= 1000
  // }

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