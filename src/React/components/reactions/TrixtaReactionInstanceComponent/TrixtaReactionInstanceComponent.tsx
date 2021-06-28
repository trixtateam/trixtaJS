import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { get } from '../../../../utils';
import { submitTrixtaReactionResponse } from '../../../reduxActions';
import { makesSelectTrixtaReactionResponseInstance } from '../../../selectors';
import {
  TrixtaDebugType,
  trixtaInstanceDebugger,
} from '../../../TrixtaDebugger';
import { TrixtaInstanceResponse, TrixtaState } from '../../../types';
import { TrixtaReactionComponentArgs } from '../types';
import {
  TrixtaReactionInstanceComponentDispatchProps,
  TrixtaReactionInstanceComponentProps,
} from './types';
const TrixtaReactionInstanceComponent = ({
  dispatchSubmitReactionResponse,
  roleName,
  reactionName,
  requestForEffect,
  common,
  debugMode,
  children,
  instance,
  ...rest
}: ConnectProps & DispatchProps & TrixtaReactionInstanceComponentProps) => {
  const response = get<TrixtaInstanceResponse>(instance, 'response', {
    success: false,
    error: false,
  });
  trixtaInstanceDebugger({
    debugMode,
    response,
    roleName,
    instance,
    name: reactionName,
    type: TrixtaDebugType.Reaction,
  });

  const hasResponse = response.error || response.success;

  if (!hasResponse) {
    const reactionProps: TrixtaReactionComponentArgs = {
      dispatchSubmitReactionResponse,
      submit: dispatchSubmitReactionResponse,
      common,
      data: get(instance, 'details.initial_data', {}),
      roleName,
      requestForEffect,
      reactionName,
      response,
      details: instance?.details,
    };
    if (typeof children === 'function') {
      return children({ ...reactionProps, ...rest });
    }
    if (React.isValidElement(children)) {
      return React.cloneElement(children, { ...reactionProps, ...rest });
    }
  }

  return null;
};

const makeMapStateToProps = () => {
  const getTrixtaReactionResponseInstance = makesSelectTrixtaReactionResponseInstance();

  const mapStateToProps = (
    state: { trixta: TrixtaState },
    props: TrixtaReactionInstanceComponentProps,
  ) => {
    return {
      instance: getTrixtaReactionResponseInstance(state, props),
    };
  };
  return mapStateToProps;
};

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: TrixtaReactionInstanceComponentProps,
): TrixtaReactionInstanceComponentDispatchProps {
  return {
    dispatchSubmitReactionResponse: (formData) =>
      dispatch(
        submitTrixtaReactionResponse({
          formData,
          errorEvent: ownProps.errorEvent,
          requestEvent: ownProps.requestEvent,
          responseEvent: ownProps.responseEvent,
          ref: ownProps.instanceRef,
          roleName: ownProps.roleName,
          reactionName: ownProps.reactionName,
        }),
      ),
  };
}

type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type ConnectProps = ReturnType<ReturnType<typeof makeMapStateToProps>>;

const connector = connect(makeMapStateToProps, mapDispatchToProps);

export default connector(
  React.memo(
    TrixtaReactionInstanceComponent,
    (
      props: TrixtaReactionInstanceComponentProps,
      nextProps: TrixtaReactionInstanceComponentProps,
    ) => props.instanceRef === nextProps.instanceRef,
  ),
);
