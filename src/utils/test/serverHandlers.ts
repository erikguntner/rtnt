import { rest } from 'msw';
import { routes } from './data';

const handlers = [
  rest.get('/api/routes', (req, res, ctx) => {
    return res(ctx.json({ routes, units: 'miles' }));
  })
]

export { handlers }