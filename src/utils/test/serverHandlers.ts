import { rest } from 'msw';
import { routes } from './data';

const handlers = [
  rest.get('/api/routes', (req, res, ctx) => {
    return res(ctx.json({ routes, units: 'miles' }));
  }),
  rest.get('/api/user', (req, res, ctx) => {
    return res(ctx.json({ user: { email: 'erikguntner@gmail.com', username: 'erik', units: 'miles' }, authenticated: 'THIS_IS_A_FAKE_TOKEN' }));
  })
]

export { handlers }