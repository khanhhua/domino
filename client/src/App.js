import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Col, Button } from 'reactstrap';

import Board from './Board';
import Piece from './Piece';
import './App.css';
import Auth from './Auth';
import GameList from './GameList';
import { createGame, move, startGame } from './redux/actions';

function App(props) {
  const { dispatch, currentUser, activeGame }= props;
  const games = props.games;
  const pieces = activeGame.getIn(['game', 'deals', '0', 'deck']);

  return (
    <div className="App">
      {!currentUser.get('isConnected') &&
      <Auth />
      }
      {currentUser.get('isConnected') &&
      <Container fluid>
        <h1>Domino</h1>
        <Row>
          <Col sm={3}>
            <Button
              block
              className="mb-1"
              onClick={() => dispatch(createGame())}
            >New Game</Button>
            <GameList games={games} />
          </Col>
          <Col sm={9}>
            {activeGame.getIn(['game', 'status']) === 'pending' &&
            <Button
              size="lg"
              color="success"
              onClick={() => dispatch(startGame())}
            >START</Button>
            }
            {!activeGame.get('isEmpty') && activeGame.getIn(['game', 'status']) === 'playing' &&
            <Fragment>
              {!(activeGame
                  && activeGame.getIn(['game', 'pieces'])
                  && activeGame.getIn(['game', 'pieces']).size)
                  && activeGame.get('selectedPiece') &&
              <Button color="success" onClick={() => dispatch(move())}>GO</Button>
              }
              <Board pieces={activeGame.getIn(['game', 'pieces'])} />
              <div className="hand">
              {pieces.map(pieceId => (
                <Piece
                  pieceId={pieceId}
                  selected={activeGame.getIn(['selectedPiece', 'pieceId']) === pieceId}
                />
              ))}
              </div>
            </Fragment>
            }
          </Col>
        </Row>
      </Container>
      }
    </div>
  );
}

App.propTypes = {
  activeGame: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  games: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeGame: state.get('activeGame'),
  currentUser: state.get('currentUser'),
  games: state.get('games'),
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(App);
