import {
  TrixtaActionBaseProps,
  TrixtaActionDebugOptions,
} from '../../../types';

export interface TrixtaActionComponentProps extends TrixtaActionBaseProps {
  /**
   * Override the initial data for Trixta Action
   */
  initialData?: unknown;
  /**
   * If 'true', will render the Trixta action response instances
   */
  renderResponse?: boolean;
  /**
   * Trixta action debugging options
   */
  debugOptions?: TrixtaActionDebugOptions;
  /**
   * Enables Trixta console debbugging
   */
  debugMode?: boolean;
  /**
   * Event name / dispatch action type for data to dispatch before submitting to Trixta Action response
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  requestEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta Action response
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  responseEvent?: string;
  /**
   * Event name / dispatch action type for data to dispatch after Trixta Action error response
   * [see Redux `dispatch` documentation for complete info](https://redux.js.org/api/store#dispatchaction)
   */
  errorEvent?: string;
  /**
   * Options for action in Trixta flow
   */
  actionOptions?: Record<string, unknown>;
  /**
   * Children can be a render props function or a react component
   */
  children?: React.ReactNode;
}
