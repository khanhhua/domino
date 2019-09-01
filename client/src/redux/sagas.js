import { takeLatest, takeEvery, put, select } from 'redux-saga/effects';

import * as api from '../api';
import {
  CREATE_GAME,
  JOIN_GAME,
  START_GAME,
  LIST_GAMES,
  LOGIN,
  MOVE,
  SELECT_GAME,
  STATUS_PENDING,
  STATUS_SUCCESS, SELECT_PIECE, CONNECT_REALTIME
} from './constants';
import { listGames, refreshGame } from './actions';

function filter(actionType) {
  return ({ type, status }) => type === actionType && status === STATUS_PENDING;
}

function* doLogin({ username, password }) {
  const { token } = yield api.authorize(username);
  localStorage.setItem('token', token);

  yield put({ type: LOGIN, status: STATUS_SUCCESS });
  yield put(listGames());

  const [, encoded] = token.split('.');
  const payload = JSON.parse(atob(encoded));
  const games = yield api.listGames({ ownerId: payload.sub });

  if (!games || !games.length) {
    const game = yield api.createGame();
    yield doSelectGameAsActive({ gameId: game._id });
  }

  yield doListGames();
  yield put({ type: CONNECT_REALTIME, status: STATUS_PENDING });
}

function* doCreateGameAsActive() {
  const game = yield api.createGame();
  yield put({ type: SELECT_GAME, status: STATUS_SUCCESS, game });
}

function* doListGames() {
  const games = yield api.listGames();

  yield put({ type: LIST_GAMES, status: STATUS_SUCCESS, games });
}

function* doSelectGameAsActive({ gameId }) {
  const game = yield api.getGame(gameId);

  yield put({ type: SELECT_GAME, status: STATUS_SUCCESS, game });
}

function* doMove({ end }) {
  const { gameId, pieceId } = yield select(state => ({
    gameId: state.getIn(['activeGame', 'game', '_id']),
    pieceId: state.getIn(['activeGame', 'selectedPiece', 'pieceId'])
  }));

  if (end) {
    yield api.move(gameId, pieceId, end);
  } else {
    yield api.move(gameId, pieceId);
  }
  const game = yield api.getGame(gameId);

  yield put({ type: MOVE, status: STATUS_SUCCESS, game });
}

function* doJoinGame() {
  const gameId = yield select(state => state.getIn(['activeGame', 'game', '_id']));
  const game = yield api.joinGame(gameId);

  yield put({ type: JOIN_GAME, status: STATUS_SUCCESS, game });
}

function* doStartGame() {
  const gameId = yield select(state => state.getIn(['activeGame', 'game', '_id']));
  const game = yield api.startGame(gameId);

  yield put({ type: START_GAME, status: STATUS_SUCCESS, game });
}

function* doConnect() {
  const subscriptionId = yield api.subscribe();
  yield put({ type: CONNECT_REALTIME, status: STATUS_SUCCESS, subscriptionId });

  const webSocket = new WebSocket(`ws://localhost:9000/ws/${subscriptionId}`);

  yield new Promise((resolve) => {
    webSocket.onopen = resolve;
  });

  while (true) {
    const message = yield new Promise((resolve) => {
      webSocket.onmessage = (rawMsg) => {
        resolve(JSON.parse(rawMsg.data));
      }
    });
    console.log({ message });
    const { $type, ...param } = message;
    switch ($type) {
      case 'game': {
        yield put(refreshGame(param.game));
        break
      }
      default: break;
    }
  }
}

export default function* rootSaga() {
  yield takeLatest(filter(LOGIN), doLogin);
  yield takeLatest(filter(LIST_GAMES), doListGames);
  yield takeLatest(filter(CREATE_GAME), doCreateGameAsActive);
  yield takeLatest(filter(SELECT_GAME), doSelectGameAsActive);
  yield takeLatest(filter(JOIN_GAME), doJoinGame);
  yield takeLatest(filter(START_GAME), doStartGame);
  yield takeLatest(filter(MOVE), doMove);
  yield takeLatest(filter(CONNECT_REALTIME), doConnect);
}
