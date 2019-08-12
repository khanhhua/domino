import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import style from './style.module.scss';
import { selectPiece, move } from "../redux/actions";

const cx = require('classnames/bind').bind(style);

const Piece = (props) => {
  const { dispatch, pieceId, coords: { x, y } = {}, rotated, flipped, selected } = props;
  const classNames = props.layout === 'in-hand' ?
      ['piece', 'in-hand', selected && 'selected']
      : ['piece', 'on-board', flipped && 'flipped'];
  if (rotated) {
    classNames.push('rotated');
  }
  const [end0, end1] = pieceId.split('');

  return (
    <div
      {...props.layout === 'in-hand' ? { onClick: () => dispatch(selectPiece(pieceId))} : {} }
      className={cx(...classNames)}
      style={{ left: x, top: y }}
    >
      <div {...props.layout === 'on-board' ? { onClick: () => dispatch(move(end0))} : {} }>{end0}</div>
      <div {...props.layout === 'on-board' ? { onClick: () => dispatch(move(end1))} : {} }>{end1}</div>
    </div>
  );
};

Piece.propTypes = {
  dispatch: PropTypes.func.isRequired,
  layout: PropTypes.oneOf(['on-board', 'in-hand']).isRequired,
  pieceId: PropTypes.string.isRequired,
  coords: PropTypes.shape({ x: PropTypes.number.isRequired, y: PropTypes.number.isRequired }),
  rotated: PropTypes.bool.isRequired,
  flipped: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired
};

Piece.defaultProps = {
  layout: 'in-hand',
  rotated: false,
  flipped: false,
  selected: false,
};

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(null, mapDispatchToProps)(Piece);
