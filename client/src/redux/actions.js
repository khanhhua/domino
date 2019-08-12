import {
  LOGIN,
  CREATE_GAME,
  JOIN_GAME,
  LIST_GAMES,
  SELECT_GAME,
  MOVE,
  STATUS_PENDING,
  STATUS_SUCCESS,
  SELECT_PIECE,
  START_GAME,
} from './constants';

export const login = (username, password) => ({ type: LOGIN, status: STATUS_PENDING, username, password });
export const move = (end) => ({ type: MOVE, status: STATUS_PENDING, end });
export const createGame = () => ({ type: CREATE_GAME, status: STATUS_PENDING });
export const joinGame = () => ({ type: JOIN_GAME, status: STATUS_PENDING });
export const startGame = () => ({ type: START_GAME, status: STATUS_PENDING });
export const listGames = () => ({ type: LIST_GAMES, status: STATUS_PENDING });
export const selectGame = (gameId) => ({ type: SELECT_GAME, status: STATUS_PENDING, gameId });
export const selectPiece = (pieceId) => ({ type: SELECT_PIECE, status: STATUS_SUCCESS, pieceId });
