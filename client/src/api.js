import 'whatwg-fetch';
import { LKEY_SUBSCRIPTION_ID } from "./redux/constants";

const request = async (uri, opts = {}) => {
  const token = localStorage.getItem('token');

  opts.cache = 'no-cache';
  opts.headers = opts.headers || {
    'Content-Type': 'application/json',
  };
  if (token) {
    opts.headers['Authorization'] = `Bearer ${token}`;
  }
  if (localStorage.getItem(LKEY_SUBSCRIPTION_ID)) {
    opts.headers['x-domino-subscription-id'] = localStorage.getItem(LKEY_SUBSCRIPTION_ID);
  }

  const res = await fetch(uri, opts);
  if (res.status === 204) {
    return;
  } else if (res.status >= 400) {
    throw new Error({ statusCode: res.status });
  }
  if (res.headers.get('content-type').match(/application\/json/)) {
    return res.json();
  }
  return res.body;
};

const get = async (uri, opts) => {
  return request(uri, { method: 'GET', ...opts });
};

const post = async (uri, opts = {}) => {
  opts.method = 'POST';
  if (opts.body) {
    opts.body = JSON.stringify(opts.body);
  }

  return request(uri, opts);
};

const put = async (uri, opts = {}) => {
  opts.method = 'PUT';
  if (opts.body) {
    opts.body = JSON.stringify(opts.body);
  }

  return request(uri, opts);
};

export const authorize = async (username) => {
  return post('http://localhost:9000/auth', {
    body: {
      username,
    },
  });
};

export const subscribe = async () => {
  const { subscriptionId } = await post('http://localhost:9000/ws');
  return subscriptionId;
};

export const createGame = async () => {
  const { game } = await post('http://localhost:9000/games');
  return game;
};

export const getGame = async (gameId) => {
  const { game } = await get(`http://localhost:9000/games/${gameId}`);
  return game;
};

export const joinGame = async (gameId) => {
  await put(`http://localhost:9000/players/${gameId}`);
  const { game } = await get(`http://localhost:9000/games/${gameId}`);
  return game;
};

export const startGame = async (gameId) => {
  await put(`http://localhost:9000/sessions/${gameId}`);
  const { game } = await get(`http://localhost:9000/games/${gameId}`);
  return game;
};

export const listGames = async ({ ownerId=null } = {}) => {
  if (ownerId) {
    const { games } = await get(`http://localhost:9000/games?ownerId=${ownerId}`);
    return games;
  } else {
    const { games } = await get('http://localhost:9000/games');
    return games;
  }
};

export const move = async (gameId, pieceId, end) => {
  await post(`http://localhost:9000/pieces/${gameId}`, {
    body: { pieceId, end },
  });
};

export const getPieces = async (gameId) => {
  const { pieces } = await get(`http://localhost:9000/pieces/${gameId}`);
  return pieces;
};
