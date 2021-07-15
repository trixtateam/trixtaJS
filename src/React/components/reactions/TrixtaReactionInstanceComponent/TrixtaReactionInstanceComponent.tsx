import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { get } from '../../../../utils';
import { submitTrixtaReactionResponse } from '../../../reduxActions';
import {
  makeSelectIsTrixtaReactionInProgress,
  makeSelectIsTrixtaReactionLoading,
  makesSelectIsTrixtaReactionReadyForRole,
  makesSelectTrixtaReactionResponseInstance,
} from '../../../selectors';
import {
  TrixtaDebugType,
  trixtaInstanceDebugger,
} from '../../../TrixtaDebugger';
import TrixtaReactJsonSchemaForm from '../../TrixtaFormComponent';
import { TrixtaReactionComponentArgs } from '../types';
import {
  DefaultUnknownType,
  TrixtaInstanceResponse,
  TrixtaState,
} from './../../../types/common';
import { TrixtaReactionInstanceComponentProps } from './types';
function TrixtaReactionInstanceComponent({
  dispatchSubmitReactionResponse,
  roleName,
  reactionName,
  requestForEffect,
  common,
  debugMode,
  children,
  instance,
  isInProgress,
  instanceRef,
  loading,
  isReady,
  ...rest
}: ConnectProps &
  DispatchProps &
  TrixtaReactionInstanceComponentProps &
  Record<string, any>) {
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
      isInProgress: isReady ? isInProgress : true,
      loading: isReady ? loading : true,
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

  if (!hasResponse && !children && instance?.details) {
    const formData = instance?.details.initial_data ?? {};
    const uiSchema = common.request_settings ?? {};
    const schema = common.request_schema ?? {};
    return (
      <TrixtaReactJsonSchemaForm
        formData={formData}
        uiSchema={uiSchema}
        schema={schema}
        formContext={{ ...rest }}
        idPrefix={`${roleName}-${reactionName}-${instanceRef}`}
        submittable={!requestForEffect}
        onSubmit={({ formData }: { formData: DefaultUnknownType }) => {
          dispatchSubmitReactionResponse(formData);
        }}
      />
    );
  }

  return null;
}

const makeMapStateToProps = () => {
  const getTrixtaReactionResponseInstance = makesSelectTrixtaReactionResponseInstance();
  const getTrixtaReactionInProgress = makeSelectIsTrixtaReactionInProgress();
  const getIsTrixtaReactionLoading = makeSelectIsTrixtaReactionLoading();
  const getIsTrixtaReactionReady = makesSelectIsTrixtaReactionReadyForRole();
  const mapStateToProps = (
    state: { trixta: TrixtaState },
    props: TrixtaReactionInstanceComponentProps,
  ) => {
    return {
      instance: getTrixtaReactionResponseInstance(state, props),
      isInProgress: getTrixtaReactionInProgress(state, props),
      loading: getIsTrixtaReactionLoading(state, props),
      isReady: getIsTrixtaReactionReady(state, props),
    };
  };
  return mapStateToProps;
};

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: TrixtaReactionInstanceComponentProps,
) {
  return {
    dispatchSubmitReactionResponse: (formData: unknown) =>
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
