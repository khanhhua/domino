import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalFooter, FormGroup, Label, Input, Button } from 'reactstrap';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';

const Auth = (props) => {
  const { dispatch } = props;

  return (
    <Modal isOpen={true}>
      <ModalBody>
        <FormGroup>
          <Label>Username</Label>
          <Input name="username" innerRef={props.refUsername} />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input type="password" name="password" innerRef={props.refPassword} />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => {
          const username = props.refUsername.current.value;
          const password = props.refPassword.current.value;

          dispatch(actions.login(username, password));
        }}>Login</Button>
      </ModalFooter>
    </Modal>
  );
};

Auth.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

Auth.defaultProps = {
  refUsername: React.createRef(),
  refPassword: React.createRef(),
};

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(null, mapDispatchToProps)(Auth);
