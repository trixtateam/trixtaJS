import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { get } from '../../../../utils';
import { submitTrixtaActionResponse } from '../../../reduxActions';
import {
  makeSelectHasTrixtaRoleAccess,
  makeSelectIsTrixtaActionInProgress,
  makeSelectTrixtaActionCommonForRole,
  makeSelectTrixtaActionResponseInstancesForRole,
} from '../../../selectors';
import { trixtaDebugger, TrixtaDebugType } from '../../../TrixtaDebugger';
import { TrixtaState } from '../../../types';
import { TrixtaActionInstanceComponent } from '../TrixtaActionInstanceComponent';
import { TrixtaActionComponentArgs } from '../types';
import { TrixtaActionComponentProps } from './types';

const TrixtaActionComponent = ({
  dispatchSubmitActionResponse,
  common,
  instances,
  isInProgress,
  roleName,
  actionName,
  hasRoleAccess,
  renderResponse = false,
  children,
  debugMode = false,
  ...rest
}: TrixtaActionComponentProps & DispatchProps & ConnectProps) => {
  trixtaDebugger({
    type: TrixtaDebugType.Action,
    debugMode,
    hasRoleAccess,
    common,
    name: actionName,
    instances,
    roleName,
  });
  if (!hasRoleAccess) return null;
  const actionProps: TrixtaActionComponentArgs = {
    dispatchSubmitActionResponse,
    submit: dispatchSubmitActionResponse,
    common,
    roleName,
    actionName,
    isInProgress,
    response: get(instances, '0.response', { success: false, error: false }),
  };
  if (!renderResponse && React.isValidElement(children)) {
    return React.cloneElement(children, { ...actionProps, ...rest });
  }
  if (!renderResponse && typeof children === 'function') {
    return children({ ...actionProps, ...rest });
  }

  return instances.map((_, index) => (
    <TrixtaActionInstanceComponent
      key={`${roleName}-${actionName}-${index}`}
      actionName={actionName}
      instance={instances[index]}
      instanceIndex={index}
      debugMode={debugMode}
      roleName={roleName}
      {...rest}
    >
      {children && children}
    </TrixtaActionInstanceComponent>
  ));
};

const makeMapStateToProps = () => {
  const getTrixtaCommonForRole = makeSelectTrixtaActionCommonForRole();
  const getTrixtaActionResponseInstancesForRole = makeSelectTrixtaActionResponseInstancesForRole();
  const getHasTrixtaRoleAccess = makeSelectHasTrixtaRoleAccess();
  const getIsTrixtaActionInProgress = makeSelectIsTrixtaActionInProgress();
  const mapStateToProps = (
    state: { trixta: TrixtaState },
    props: TrixtaActionComponentProps,
  ) => {
    return {
      common: getTrixtaCommonForRole(state, props),
      instances: getTrixtaActionResponseInstancesForRole(state, props),
      hasRoleAccess: getHasTrixtaRoleAccess(state, props),
      /**
       * If 'true', Trixta is waiting for response
       */
      isInProgress: getIsTrixtaActionInProgress(state, props),
    };
  };
  return mapStateToProps;
};

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: TrixtaActionComponentProps,
) {
  return {
    dispatchSubmitActionResponse: (formData?: Record<string, unknown>) =>
      dispatch(
        submitTrixtaActionResponse({
          errorEvent: ownProps.errorEvent,
          responseEvent: ownProps.responseEvent,
          requestEvent: ownProps.requestEvent,
          debugMode: ownProps.debugMode,
          formData,
          actionOptions: ownProps.actionOptions,
          debugOptions: ownProps.debugOptions,
          roleName: ownProps.roleName,
          actionName: ownProps.actionName,
        }),
      ),
  };
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type ConnectProps = ReturnType<ReturnType<typeof makeMapStateToProps>>;

const connector = connect(makeMapStateToProps, mapDispatchToProps);
export default connector(TrixtaActionComponent);
