import { model, Schema, SchemaTypes } from 'mongoose';

export const Game = model('Game', new Schema({
  ownerId: SchemaTypes.ObjectID,
  playerIds: [SchemaTypes.ObjectID],
  activePlayerId: SchemaTypes.ObjectID,
  end0: String,
  end1: String,
  pieces: [{
    pieceId: String,
    origin: [String],
    link: String,
    open: String,
  }],
  deals: [{
    playerId: SchemaTypes.ObjectID,
    deck: [String],
  }],
  status: {
    type: SchemaTypes.String,
    default: 'pending',
  }
}));

export const Player = model('Player', new Schema({
  username: String,
  alias: String,
}));
