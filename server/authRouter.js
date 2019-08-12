import KoaRouter from 'koa-router';
import jwt from 'jsonwebtoken';
import { Player } from './models';

const router = new KoaRouter();

router.post('/auth', async (ctx) => {
  const { username } = ctx.request.body;
  if (!username) {
    ctx.throw({ statusCode: 400 });
    return;
  }

  const player = await Player.findOne({ username });
  if (!player) {
    ctx.throw({ statusCode: 403 });
    return;
  }

  const token = jwt.sign({
    sub: player._id.toString(),
  }, 's3cr3t');
  ctx.body = { token };
});

export default (app) => {
  app.use(router.routes()).use(router.allowedMethods());
};
