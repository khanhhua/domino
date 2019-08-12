import Koa from 'koa';
import koaBody from 'koa-body';
import koaCors from 'koa-cors';
import jwt from 'jsonwebtoken';

import GameRouter from './gameRouter';
import AuthRouter from './authRouter';

const app = new Koa();

app.use(koaCors({ origin: 'http://localhost:3000' }));
app.use(async (ctx, next) => {
  if (ctx.req.headers['authorization']) {
    const [, token] = ctx.req.headers['authorization'].split('Bearer ');
    const payload = await jwt.verify(token, 's3cr3t');
    ctx.user = {
      userId: payload.sub,
    };
  }

  await next();
});
app.use(koaBody());
AuthRouter(app);
GameRouter(app);

export default (port) => {
  app.listen(port, () => { console.log('Listening at 3000...') });
};
