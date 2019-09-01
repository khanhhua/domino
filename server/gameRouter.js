import KoaRouter from 'koa-router';
import { PIECES } from './constants';
import { Game } from './models';

const router = new KoaRouter();

router.get('/games', async (ctx) => {
  const { user: { userId } } = ctx;
  const { ownerId } = ctx.params;

  let games;
  if (ownerId) {
    games = await Game.find({ ownerId }, 'playerIds, ownerId');
  } else {
    games = await Game.find({}, 'playerIds, ownerId');
  }

  ctx.status = 200;
  ctx.body = { games: (games || []).map(item => item.toJSON()) };
});

router.post('/games', async (ctx) => {
  const { user: { userId: ownerId } } = ctx;

  const game = await new Game({ ownerId, playerIds: [ownerId] }).save();

  ctx.status = 201;
  ctx.body = { game: game.toJSON() };

  const subscriptionId = ctx.request.headers['x-domino-subscription-id'];
  ctx.app.joinRoom(subscriptionId, game._id.toString());
});

router.get('/games/:gameId', async (ctx) => {
  const { user: { userId } } = ctx;
  const { gameId } = ctx.params;
  const game = await Game.findById(gameId, {
    deals: 1, status: 1, playerIds: 1, ownerId: 1, pieces: 1, end0: 1, end1: 1
  });
  const gameJSON = game.toJSON();
  gameJSON.deals = gameJSON.deals.filter(({ playerId }) => playerId.toString() === userId);

  ctx.status = 200;
  ctx.body = {
    game: gameJSON,
  };
});

router.put('/sessions/:gameId', async (ctx) => {
  const { gameId } = ctx.params;
  const { user: { userId: ownerId } } = ctx;

  const game = await Game.findOne({ _id: gameId, ownerId });
  if (!game) {
    return ctx.throw({ statusCode: 404, message: 'Game not found' });
  }

  const stack = Object.values(PIECES).sort(() => (Math.random() - 0.5));
  const deals = game.playerIds.map((playerId, index) => {
    return {
      playerId,
      deck: stack.slice(index * 7, index * 7 + 7).map(({ pieceId }) => pieceId),
    };
  });
  await game.update({
    status: 'playing',
    activePlayerId: ownerId, // OWNER privilege! :D
    deals,
  });

  ctx.status = 204;

  ctx.app.broadcast({ gameId, status: 'playing' }, { gameId });
});

router.put('/players/:gameId', async (ctx) => {
  const { gameId } = ctx.params;
  const { user: { userId: playerId } } = ctx;
  const game = await Game.findOne({ _id: gameId });
  if (!(game.playerIds.length < 4)) {
    return ctx.throw({ statusCode: 400, message: 'Too many players' });
  }

  await Game.updateOne({ _id: gameId }, { $addToSet: { playerIds: playerId } });
  ctx.status = 204;

  const subscriptionId = ctx.request.headers['x-domino-subscription-id'];
  ctx.app.joinRoom(subscriptionId, gameId);
});

router.post('/pieces/:gameId', async (ctx) => {
  const { user: { userId: playerId } } = ctx;
  const { body: move } = ctx.request;
  const { gameId } = ctx.params;
  const { pieceId, end } = move; // "end" is the joining end of the new piece

  const piece = PIECES[pieceId];
  const game = await Game.findById(gameId);
  if (!game) {
    return ctx.throw({ statusCode: 404, message: 'Game not found' });
  }
  if (game.activePlayerId.toString() !== playerId) {
    return ctx.throw({ statusCode: 400, message: 'Invalid turn' });
  }
  // TODO Check whether the pieceId belongs to Player or NOT

  const { pieces, end0, end1 } = game;
  const playerDeckIndex = game.deals.findIndex(({ playerId: key }) => key.toString() === playerId);
  const nextActivePlayerId = (game.playerIds.findIndex(key => key.toString() === playerId) + 1) % game.playerIds.length;

  if (pieces.length === 0) {
    await game.update({
      activePlayerId: game.playerIds[nextActivePlayerId],
      end0: piece.ends[0],
      end1: piece.ends[1],
      pieces: [{ pieceId, playerId, origin: piece.ends }],
      $pull: { [`deals.${playerDeckIndex}.deck`]: pieceId }
    });
  } else {
    const index = piece.ends.indexOf(end);
    if (end === end0) {
      const updatedEnd0 = piece.ends[index === 0 ? 1 : 0];
      await game.update({
        activePlayerId: game.playerIds[nextActivePlayerId],
        end0: updatedEnd0,
        $push: { pieces: { pieceId, playerId, link: end, open: updatedEnd0 } },
        $pull: { [`deals.${playerDeckIndex}.deck`]: pieceId }
      });
    } else if (end === end1) {
      const updatedEnd1 = piece.ends[index === 1 ? 0 : 1];
      await game.update({
        activePlayerId: game.playerIds[nextActivePlayerId],
        end1: updatedEnd1,
        $push: { pieces: { pieceId, playerId, link: end, open: updatedEnd1 } },
        $pull: { [`deals.${playerDeckIndex}.deck`]: pieceId }
      });
    } else {
      ctx.throw(new Error('Bad move'));
      return;
    }
  }

  ctx.status = 201;

  const updatedGame = await Game.findById(gameId, 'pieces');
  ctx.app.broadcast({
    $type: 'game',
    game: updatedGame,
  }, { gameId });
});

router.get('/pieces/:gameId', async (ctx) => {
  const { gameId } = ctx.params;
  const game = await Game.findById(gameId);
  const { pieces } = game.toJSON();
  ctx.body = { pieces };
});

export default (app) => {
  app.use(router.routes()).use(router.allowedMethods());
};
