import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ListGroup, ListGroupItem } from 'reactstrap';

import { selectGame } from '../redux/actions';

const GameList = (props) => {
  const { dispatch, games } = props;

  return (
    <ListGroup>
    {games.map(item => (
      <ListGroupItem
        key={item.get('_id')}
        action={true}
        onClick={() => dispatch(selectGame(item.get('_id')))}
      >
        {item.get('_id')}
      </ListGroupItem>
    ))}
    </ListGroup>
  );
};

GameList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  games: PropTypes.object.isRequired,
};

const mapDispatchToProp = (dispatch) => ({ dispatch });

export default connect(null, mapDispatchToProp)(GameList);
