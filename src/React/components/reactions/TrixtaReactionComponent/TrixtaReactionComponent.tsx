import React from 'react';
import { connect } from 'react-redux';
import { isNullOrEmpty } from '../../../../utils';
import {
  makeSelectHasTrixtaRoleAccess,
  makeSelectTrixtaReactionCommonForRole,
  makeSelectTrixtaReactionResponseInstancesForRole,
} from '../../../selectors';
import { trixtaDebugger, TrixtaDebugType } from '../../../TrixtaDebugger';
import { TrixtaState } from '../../../types';
import { TrixtaReactionInstanceComponent } from '../TrixtaReactionInstanceComponent';
import { TrixtaReactionComponentProps } from './types';

function TrixtaReactionComponent({
  common,
  roleName,
  reactionName,
  defaultComponent,
  requestForEffect = false,
  errorEvent,
  responseEvent,
  requestEvent,
  hasRoleAccess,
  debugMode = false,
  instances,
  ...rest
}: ConnectProps & TrixtaReactionComponentProps) {
  trixtaDebugger({
    type: TrixtaDebugType.Reaction,
    debugMode,
    hasRoleAccess,
    common,
    name: reactionName,
    instances,
    roleName,
  });
  if (!hasRoleAccess) return null;
  if (isNullOrEmpty(instances) || !Array.isArray(instances)) {
    if (React.isValidElement(defaultComponent)) {
      return React.cloneElement(defaultComponent);
    }
    return null;
  }
  if (isNullOrEmpty(common)) {
    return null;
  }

  return (
    <>
      {instances.map((value, index) => (
        <TrixtaReactionInstanceComponent
          key={`${reactionName}-${value.details.ref}-instance`}
          reactionName={reactionName}
          requestForEffect={requestForEffect}
          common={common}
          errorEvent={errorEvent}
          responseEvent={responseEvent}
          requestEvent={requestEvent}
          roleName={roleName}
          instanceIndex={index}
          instanceRef={value.details.ref}
          debugMode={debugMode}
          {...rest}
        />
      ))}
    </>
  );
}

const makeMapStateToProps = () => {
  const getTrixtaCommonForRole = makeSelectTrixtaReactionCommonForRole();
  const getTrixtaReactionResponseInstancesForRole = makeSelectTrixtaReactionResponseInstancesForRole();
  const getHasTrixtaRoleAccess = makeSelectHasTrixtaRoleAccess();
  const mapStateToProps = (
    state: { trixta: TrixtaState },
    props: TrixtaReactionComponentProps,
  ) => {
    return {
      common: getTrixtaCommonForRole(state, props),
      instances: getTrixtaReactionResponseInstancesForRole(state, props),
      hasRoleAccess: getHasTrixtaRoleAccess(state, props),
    };
  };
  return mapStateToProps;
};

type ConnectProps = ReturnType<ReturnType<typeof makeMapStateToProps>>;

const connector = connect(makeMapStateToProps);
export default connector(TrixtaReactionComponent);
