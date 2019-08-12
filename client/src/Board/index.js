import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Piece from '../Piece';
import { PIECES } from '../redux/constants';
import style from './style.module.scss';

const WIDTH = 40;
const HEIGHT = 80;

const layout = (items) => {
  const originIndex = items.findIndex(({ origin }) => !!origin);
  const slicedItems = items.slice(originIndex).map(item => ({ ...item, ends: PIECES[item.pieceId].ends }));
  if (!slicedItems.length) {
    return [];
  }

  let coordX = 400;

  return slicedItems.reduce((acc, item, index) => {
    coordX += HEIGHT;
    const flipped = index !== 0 && (
        acc[index - 1].flipped ? acc[index - 1].ends[0] === item.ends[1]
            : (acc[index - 1].ends[0] === item.ends[0])
    );

    return acc.concat({
      ...item,
      rotated: true,
      flipped,
      coords: {
        x: coordX,
        y: 250,
      }
    });
  }, [])
};

const Board = (props) => {
  const { dispatch, pieces } = props;
  const piecesWithCoords = layout(pieces.toJS());

  return (
    <div className={style.board}>
      {piecesWithCoords.map(item => <Piece {...item} key={item._id} layout={'on-board'} />)}
    </div>
  );
};

Board.propTypes = {
  pieces: PropTypes.arrayOf(PropTypes.shape({
    pieceId: PropTypes.string.isRequired,
    coords: PropTypes.shape({ x: PropTypes.number.isRequired, y: PropTypes.number.isRequired })
  })),
};

Board.defaultProps = {
  dispatch: PropTypes.func.isRequired,
  pieces: [],
};

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(null, mapDispatchToProps)(Board);
