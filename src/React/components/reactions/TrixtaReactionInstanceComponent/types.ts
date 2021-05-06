import {
  DefaultUnknownType,
  TrixtaCommon,
  TrixtaDispatch,
} from './../../../types/common';
import {
  TrixtaReactionBaseProps,
  TrixtaReactionInstance,
} from './../../../types/reactions';

export interface TrixtaReactionInstanceComponentStateProps {
  instance: TrixtaReactionInstance;
}
export interface TrixtaReactionInstanceComponentDispatchProps<
  TFormData = DefaultUnknownType
> {
  dispatchSubmitReactionResponse: TrixtaDispatch<TFormData>;
}
export interface TrixtaReactionInstanceComponentProps
  extends TrixtaReactionBaseProps {
  instanceIndex: number;
  /**
   * Event name / dispatch action type for data to dispatch before submitting to Trixta Reaction response
   */
  requestEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta reaction response
   */
  responseEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta reaction error response
   */
  errorEvent?: string;
  common: TrixtaCommon;
  /**
   * Enables Trixta console debbugging
   */
  debugMode: boolean;
  /**
   * Children can be a render props function or a react component
   */
  children?: React.ReactNode;
  instanceRef: string;
}
