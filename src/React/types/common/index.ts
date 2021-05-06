import { UiSchema } from '@rjsf/core';
import { JSONSchema7Object } from 'json-schema';
import {
  SubmitTrixtaActionResponseAction,
  SubmitTrixtaReactionResponseAction,
} from '../../reduxActions';
import {
  TrixtaAction,
  TrixtaActionDetails,
  TrixtaActionHandlerType,
} from '../actions';
import {
  TrixtaReaction,
  TrixtaReactionDetails,
  TrixtaReactionType,
} from '../reactions';

export interface LoadingStatus {
  status?: boolean;
}

export type TrixtaErrorResponse = {
  message?: string;
  reason?: string;
};

export enum RequestStatus {
  NONE = 0,
  REQUEST = 1,
  SUCCESS = 2,
  FAILURE = 3,
}

export interface submitTrixtaFunctionParameters {
  /**
   * Data to submit for Trixta Reaction / Action
   */
  data: DefaultUnknownType;
  /**
   * Unique reference no for Trixta to respond for Reaction
   */
  ref?: string;
  /**
   * Event name / dispatch action type for data to dispatch before submitting to Trixta Reaction / Action response
   */
  requestEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta Reaction / Action response
   */
  responseEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta Reaction / Action error response
   */
  errorEvent?: string;
}

export interface LastActionSubmit {
  parameters: SubmitTrixtaActionResponseAction['payload'];
  timeStamp: string;
}

export interface LastReactionSubmit {
  parameters: SubmitTrixtaReactionResponseAction['payload'];
  timeStamp: string;
}
export type TrixtaChannelJoinResponse = {
  contract_reactions?: Record<string, TrixtaReactionDetails>;
  contract_actions?: Record<string, TrixtaActionDetails>;
};

export interface TrixtaBaseRoleProps {
  /**
   * Name of Trixta role
   */
  roleName: string;
}

export enum TrixtaDataType {
  action = 'action',
  reaction = 'reaction',
}

export interface TrixtaRoleParameter {
  name: string;
  logPresence?: boolean;
}

export interface TrixtaRole {
  name: string;
}

export type DefaultUnknownType =
  | Record<string, unknown>
  | Array<Record<string, unknown> | unknown>
  | unknown
  | undefined
  | string
  | boolean;

export type TrixtaInstanceModeType = 'replace' | 'accumulate';

export interface TrixtaInstanceMode {
  type: TrixtaInstanceModeType;
  limit?: number;
}

export interface TrixtaCommon {
  /**
   * Form data to pass to Trixta Json Schema Form
   */
  form_data?:DefaultUnknownType
  /**
   * Name of Trixta action or reaction
   */
  name?: string;
  /**
   * Description of Trixta action or reaction
   */
  description: string;
  /**
   * Notes of Trixta action or reaction
   */
  notes: string;
  /**
   * Json schema for React Json Schema Form
   */
  request_schema: JSONSchema7Object;
  /**
   * Json schema for React Json Schema Form on response
   */
  // eslint-disable-next-line camelcase
  response_schema: JSONSchema7Object;
  /**
   * Ui Schema for React Json Schema Form
   */
  // eslint-disable-next-line camelcase
  request_settings: UiSchema;
  handler?: TrixtaActionHandlerType;
  tags: Array<string>;
}

export type TrixtaState = {
  reactions: Record<string, TrixtaReaction>;
  actions: Record<string, TrixtaAction>;
  error: DefaultUnknownType;
  authorizationStarted: boolean;
  authorizingStatus: Record<string, LoadingStatus>;
  agentDetails: string[];
};

export interface TrixtaInstanceResponse<
  TSuccessType = DefaultUnknownType,
  TErrorType = DefaultUnknownType
> {
  /**
   * If, error from Trixta, the error response for Reaction / Action
   */
  error?: TErrorType;
  /**
   * If, no error from Trixta, the response for Reaction / Action
   */
  success?: TSuccessType;
}

export interface TrixtaInstanceDetails<TInitialData = DefaultUnknownType>
  extends Record<string, unknown> {
  // eslint-disable-next-line camelcase
  /**
   * Initial Data returned from Trixta for Reaction / Action
   */
  initial_data: TInitialData;
  /**
   * Type of Trixta reaction if instance of Trixta Reaction
   */
  type?: TrixtaReactionType;
  /**
   * Status from from Trixta
   */
  status?: string;
  /**
   * Unique reference no for Trixta to respond for Reaction
   */
  ref: string;
  /**
   * Timestamp of when instance created
   */
  dateCreated?: string;
}

export interface TrixtaInstance<
  /**
   * Type of data for Trixta response for Reaction / Action
   */
  TSuccessType = DefaultUnknownType,
  /**
   * Type of data for Trixta error response for Reaction / Action
   */
  TErrorType = DefaultUnknownType
> extends Record<string, unknown> {
  response: TrixtaInstanceResponse<TSuccessType, TErrorType>;
}

export interface TrixtaReactionInstance<
  /**
   * Type of data for initial data from Trixta for Reaction / Action
   */
  TInitialData = DefaultUnknownType,
  /**
   * Type of data for Trixta response for Reaction / Action
   */
  TSuccessType = DefaultUnknownType,
  /**
   * Type of data for Trixta error response for Reaction / Action
   */
  TErrorType = DefaultUnknownType
> extends TrixtaInstance<TSuccessType, TErrorType> {
  details: TrixtaInstanceDetails<TInitialData>;
}

export type TrixtaDispatch<T = never> = [T] extends [never]
  ? () => void
  : (data: T) => void;
export interface TrixtaAuthProps {
  /**
   * Trixta roles or role name
   */
  roles?: string | string[];
}
