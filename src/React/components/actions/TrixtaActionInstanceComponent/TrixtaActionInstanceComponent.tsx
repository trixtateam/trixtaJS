import React from 'react';
import { connect } from 'react-redux';
import {
  makeSelectTrixtaActionCommonForRole,
  makesSelectTrixtaActionResponseInstance,
} from '../../../selectors';
import {
  TrixtaDebugType,
  trixtaInstanceDebugger,
} from '../../../TrixtaDebugger';
import { TrixtaState } from '../../../types/common';
import { TrixtaActionInstanceComponentProps } from './types';

function TrixtaActionInstanceComponent({
  response,
  actionName,
  roleName,
  instance,
  debugMode = false,
  ...props
}: TrixtaActionInstanceComponentProps & ConnectProps) {
  trixtaInstanceDebugger({
    type: TrixtaDebugType.Action,
    debugMode,
    name: actionName,
    instance,
    response: response ?? { success: false, error: false },
    roleName,
  });
  if (!response) return null;
  //const actionProps = { ...props, response };

  // TODO render response using json schema form
  return <>{JSON.stringify(response, null, 2)}</>;
}

const makeMapStateToProps = () => {
  const getTrixtaActionResponseInstance = makesSelectTrixtaActionResponseInstance();
  const getTrixtaCommonForRole = makeSelectTrixtaActionCommonForRole();
  const mapStateToProps = (
    state: { trixta: TrixtaState },
    props: TrixtaActionInstanceComponentProps,
  ) => {
    return {
      common: getTrixtaCommonForRole(state, props),
      response: getTrixtaActionResponseInstance(state, props),
    };
  };
  return mapStateToProps;
};

type ConnectProps = ReturnType<ReturnType<typeof makeMapStateToProps>>;

const connector = connect(makeMapStateToProps);
export default connector(TrixtaActionInstanceComponent);
