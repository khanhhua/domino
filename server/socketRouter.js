import KoaRouter from 'koa-router';
import uuidV4 from 'uuid/v4';
import { Game } from './models';

const router = new KoaRouter();
const subscriptions = {};

router.post('/ws', async (ctx) => {
  const { user: { userId: playerId } } = ctx;
  const existingSubscription = Object.entries(subscriptions)
      .find(([, { playerId: key }]) => key === playerId);

  if (existingSubscription) {
    ctx.status = 201;
    ctx.body = {
      subscriptionId: existingSubscription[0],
    };
    return;
  }

  const uuid = uuidV4();
  subscriptions[uuid] = {
    playerId,
    websockets: [],
    gameIds: [],
  };

  ctx.status = 201;
  ctx.body = {
    subscriptionId: uuid,
  };
});

router.get('/ws/:subscriptionId', async (ctx) => {
  const { subscriptionId } = ctx.params;
  if (!(subscriptionId in subscriptions)) {
    return ctx.throw(new Error({ statusCode: 403 }));
  }
  console.log(`Establishing websocket connection #${subscriptionId}!`);
  const { playerId } = subscriptions[subscriptionId];
  const games = await Game.find({ playerIds: playerId });
  const { websockets, gameIds } = subscriptions[subscriptionId];
  const { websocket } = ctx;

  websockets.push(websocket);
  gameIds.push(...games.map(item => item._id.toString()));
  websocket.send(JSON.stringify({ ok: true, gameIds }));
  websocket.on('message', (rawMsg) => {
    console.log({ rawMsg });
  });
});

router.post('/ws/:subscriptionId/games', async (ctx) => {
  const { subscriptionId } = ctx.params;
  const { body: { gameId } } = ctx.request;
  console.log(`Joining game #${gameId} with #${subscriptionId}...`);
  if (!(subscriptionId in subscriptions)) {
    return ctx.throw(new Error({ statusCode: 403 }));
  }

  const { gameIds } = subscriptions[subscriptionId];
  gameIds.push(gameId);

  ctx.status = 204;
});

export default (app) => {
  app.ws.use(router.routes()).use(router.allowedMethods());
  app.use(router.routes()).use(router.allowedMethods());

  /**
   *
   * @param payload
   * @param gameId
   */
  app.broadcast = (payload, { gameId = null } = {}) => {
    console.log('Broadcasting:', payload);
    const subscriptionsByGameId = Object.values(subscriptions)
        .filter(({ gameIds }) => gameIds.includes(gameId));
    subscriptionsByGameId.forEach(({ websockets }) => {
      websockets.forEach((websocket) => {
        websocket.send(JSON.stringify(payload));
      });
    });
  };

  app.joinRoom = (playerId, gameId) => {
    const subscription = Object.values(subscriptions).find(({ playerId: key }) => key === playerId);
    if (!subscription) {
      return;
    }
    const { gameIds } = subscription[1];
    gameIds.push(gameId);
  };
};
