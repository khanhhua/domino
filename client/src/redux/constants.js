export const STATUS_PENDING = 'pending';
export const STATUS_SUCCESS = 'success';
export const STATUS_ERROR = 'error';

export const LKEY_SUBSCRIPTION_ID = 'app/subscriptionId';

export const LOGIN = 'app/login';
export const CREATE_GAME = 'app/create-game';
export const JOIN_GAME = 'app/join-game';
export const START_GAME = 'app/start-game';
export const MOVE = 'app/move';
export const LIST_GAMES = 'app/list-games';
export const SELECT_GAME = 'app/select-game';
export const SELECT_PIECE = 'app/select-piece';
export const CONNECT_REALTIME = 'app/connect-realtime';
export const REFRESH_GAME = 'app/refresh-game';

export const PIECE_ID_00 = '00';
export const PIECE_ID_10 = '10';
export const PIECE_ID_20 = '20';
export const PIECE_ID_30 = '30';
export const PIECE_ID_40 = '40';
export const PIECE_ID_50 = '50';
export const PIECE_ID_60 = '60';

export const PIECE_ID_11 = '11';
export const PIECE_ID_21 = '21';
export const PIECE_ID_31 = '31';
export const PIECE_ID_41 = '41';
export const PIECE_ID_51 = '51';
export const PIECE_ID_61 = '61';

export const PIECE_ID_22 = '22';
export const PIECE_ID_32 = '32';
export const PIECE_ID_42 = '42';
export const PIECE_ID_52 = '52';
export const PIECE_ID_62 = '62';

export const PIECE_ID_33 = '33';
export const PIECE_ID_43 = '43';
export const PIECE_ID_53 = '53';
export const PIECE_ID_63 = '63';

export const PIECE_ID_44 = '44';
export const PIECE_ID_54 = '54';
export const PIECE_ID_64 = '64';

export const PIECE_ID_55 = '55';
export const PIECE_ID_65 = '65';

export const PIECE_ID_66 = '66';

export const PIECES = Object.freeze({
  [PIECE_ID_00]: { pieceId: PIECE_ID_00, ends: ['0', '0'] },
  [PIECE_ID_10]: { pieceId: PIECE_ID_10, ends: ['1', '0'] },
  [PIECE_ID_20]: { pieceId: PIECE_ID_20, ends: ['2', '0'] },
  [PIECE_ID_30]: { pieceId: PIECE_ID_30, ends: ['3', '0'] },
  [PIECE_ID_40]: { pieceId: PIECE_ID_40, ends: ['4', '0'] },
  [PIECE_ID_50]: { pieceId: PIECE_ID_50, ends: ['5', '0'] },
  [PIECE_ID_60]: { pieceId: PIECE_ID_60, ends: ['6', '0'] },
  [PIECE_ID_11]: { pieceId: PIECE_ID_11, ends: ['1', '1'] },
  [PIECE_ID_21]: { pieceId: PIECE_ID_21, ends: ['2', '1'] },
  [PIECE_ID_31]: { pieceId: PIECE_ID_31, ends: ['3', '1'] },
  [PIECE_ID_41]: { pieceId: PIECE_ID_41, ends: ['4', '1'] },
  [PIECE_ID_51]: { pieceId: PIECE_ID_51, ends: ['5', '1'] },
  [PIECE_ID_61]: { pieceId: PIECE_ID_61, ends: ['6', '1'] },
  [PIECE_ID_22]: { pieceId: PIECE_ID_22, ends: ['2', '2'] },
  [PIECE_ID_32]: { pieceId: PIECE_ID_32, ends: ['3', '2'] },
  [PIECE_ID_42]: { pieceId: PIECE_ID_42, ends: ['4', '2'] },
  [PIECE_ID_52]: { pieceId: PIECE_ID_52, ends: ['5', '2'] },
  [PIECE_ID_62]: { pieceId: PIECE_ID_62, ends: ['6', '2'] },
  [PIECE_ID_33]: { pieceId: PIECE_ID_33, ends: ['3', '3'] },
  [PIECE_ID_43]: { pieceId: PIECE_ID_43, ends: ['4', '3'] },
  [PIECE_ID_53]: { pieceId: PIECE_ID_53, ends: ['5', '3'] },
  [PIECE_ID_63]: { pieceId: PIECE_ID_63, ends: ['6', '3'] },
  [PIECE_ID_44]: { pieceId: PIECE_ID_44, ends: ['4', '4'] },
  [PIECE_ID_54]: { pieceId: PIECE_ID_54, ends: ['5', '4'] },
  [PIECE_ID_64]: { pieceId: PIECE_ID_64, ends: ['6', '4'] },
  [PIECE_ID_55]: { pieceId: PIECE_ID_55, ends: ['5', '5'] },
  [PIECE_ID_65]: { pieceId: PIECE_ID_65, ends: ['6', '5'] },
  [PIECE_ID_66]: { pieceId: PIECE_ID_66, ends: ['6', '6'] },
});
