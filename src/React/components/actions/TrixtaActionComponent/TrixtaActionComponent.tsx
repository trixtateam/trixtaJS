import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { get } from '../../../../utils';
import { submitTrixtaActionResponse } from '../../../reduxActions';
import {
  makeSelectHasTrixtaRoleAccess,
  makeSelectIsTrixtaActionInProgress,
  makeSelectTrixtaActionCommonForRole,
  makeSelectTrixtaActionResponseInstancesForRole
} from '../../../selectors';
import { trixtaDebugger, TrixtaDebugType } from '../../../TrixtaDebugger';
import { DefaultUnknownType, TrixtaState } from '../../../types/common';
import TrixtaReactJsonSchemaForm from '../../TrixtaFormComponent';
import { TrixtaActionInstanceComponent } from '../TrixtaActionInstanceComponent';
import { TrixtaActionComponentArgs } from '../types';
import { TrixtaActionComponentProps } from './types';

function TrixtaActionComponent({
  dispatchSubmitActionResponse,
  common,
  instances,
  isInProgress,
  roleName,
  actionName,
  hasRoleAccess,
  renderResponse = false,
  children,
  onError,
  onSuccess,
  debugMode = false,
  initialData = undefined,
  ...rest
}: TrixtaActionComponentProps & DispatchProps & ConnectProps) {
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

  if (!renderResponse) {
    if (React.isValidElement(children)) {
      return React.cloneElement(children, { ...actionProps, ...rest });
    }
    if (typeof children === 'function') {
      return children({ ...actionProps, ...rest });
    }

    if (!children && common) {
      onSuccess &&
        actionProps.response?.success &&
        onSuccess(actionProps.response?.success);
      onError &&
        actionProps.response?.error &&
        onError(actionProps.response?.error);
      const formData =
        initialData !== undefined
          ? initialData
          : common.form_data
          ? common.form_data
          : {};
      const schema = common.request_schema ?? {};
      const uiSchema = common.request_settings ?? {};

      return (
        <TrixtaReactJsonSchemaForm
          idPrefix={`${roleName}-${actionName}`}
          schema={schema}
          formData={formData}
          uiSchema={uiSchema}
          onSubmit={({ formData }: { formData: DefaultUnknownType }) => {
            dispatchSubmitActionResponse(formData);
          }}
        />
      );
    }
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
    />
  ));
}

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
    dispatchSubmitActionResponse: (formData: DefaultUnknownType) =>
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
