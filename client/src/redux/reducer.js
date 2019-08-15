import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import {
  LOGIN,
  CREATE_GAME,
  MOVE,
  STATUS_PENDING,
  LIST_GAMES,
  SELECT_GAME,
  SELECT_PIECE,
  PIECES,
  START_GAME, JOIN_GAME
} from './constants';

const games = (initial = fromJS([]), action) => {
  if (!action.status || action.status === STATUS_PENDING) {
    return initial;
  }

  switch (action.type) {
    case LIST_GAMES: {
      return fromJS(action.games);
    }
    default: return initial;
  }
};

const activeGame = (initial = fromJS({ isEmpty: true, game: null, selectedPiece: null }), action) => {
  if (!action.status || action.status === STATUS_PENDING) {
    return initial;
  }

  switch (action.type) {
    case SELECT_GAME: {
      return fromJS({ game: action.game, selectedPiece: null });
    }
    case SELECT_PIECE: {
      const piece = PIECES[action.pieceId];
      return initial.set('selectedPiece', fromJS(piece));
    }
    case MOVE: {
      const { game } = action;
      return initial.set('game', fromJS(game));
    }
    case START_GAME: {
      return initial.set('game', fromJS(action.game));
    }
    case JOIN_GAME: {
      return initial.set('game', fromJS(action.game));
    }
    case CREATE_GAME: return initial;
    case MOVE: return initial;
    default: return initial;
  }
};

const currentUser = (initial = fromJS({ isConnected: false }), action) => {
  if (!action.status || action.status === STATUS_PENDING) {
    return initial;
  }

  switch (action.type) {
    case LOGIN: {
      return initial.set('isConnected', true)
    };
    default: return initial;
  }
};

export default combineReducers({
  games,
  activeGame,
  currentUser,
})
